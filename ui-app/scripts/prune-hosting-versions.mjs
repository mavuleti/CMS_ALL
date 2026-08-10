#!/usr/bin/env node
// Deletes old Firebase Hosting versions beyond the last N (default 2: live +
// one rollback). Firebase Hosting keeps every deployed version's files
// indefinitely (dedup by content hash), so frequent deploys with
// regenerated PDFs/bundles slowly fill the free storage quota. Run after
// every deploy via `npm run postdeploy` (wired into deploy.sh/deploy.ps1).
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEEP = Number(process.env.HOSTING_VERSIONS_TO_KEEP || 2);
const DRY_RUN = process.argv[2] !== "--apply";

const rc = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".firebaserc"), "utf8"));
const SITE = rc.projects.default;

const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const refreshToken = config.tokens.refresh_token;

// Public firebase-tools CLI OAuth client (same one the CLI itself uses)
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

async function getAccessToken() {
  const res = await fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function api(accessToken, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const token = await getAccessToken();

  const releases = await api(
    token,
    `https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/channels/live/releases?pageSize=1`
  );
  const liveVersionName = releases.releases?.[0]?.version?.name;

  let versions = [];
  let pageToken;
  do {
    const url = new URL(`https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/versions`);
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const data = await api(token, url.toString());
    versions.push(...(data.versions || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  versions.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  const keepSet = new Set();
  if (liveVersionName) keepSet.add(liveVersionName);
  for (const v of versions) {
    if (keepSet.size >= KEEP) break;
    if (v.status === "FINALIZED") keepSet.add(v.name);
  }

  const toDelete = versions.filter(
    (v) => !keepSet.has(v.name) && v.status !== "CREATED" && v.status !== "DELETED"
  );

  if (toDelete.length === 0) {
    console.log(`[prune-hosting-versions] Nothing to prune (${versions.length} versions, keeping ${keepSet.size}).`);
    return;
  }

  if (DRY_RUN) {
    console.log(`[prune-hosting-versions] Dry run: would delete ${toDelete.length} of ${versions.length} versions (keeping ${keepSet.size}). Re-run with --apply.`);
    return;
  }

  let deleted = 0;
  for (const v of toDelete) {
    const res = await fetch(`https://firebasehosting.googleapis.com/v1beta1/${v.name}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) deleted++;
    else console.error(`[prune-hosting-versions] Failed to delete ${v.name}: ${res.status}`);
  }
  console.log(`[prune-hosting-versions] Deleted ${deleted}/${toDelete.length} old hosting versions (kept ${keepSet.size}).`);
}

main().catch((e) => {
  console.error("[prune-hosting-versions]", e);
  // Don't fail the deploy over cleanup issues.
  process.exit(0);
});
