#!/usr/bin/env node
// Pulls a basic traffic report from GA4 using a service account.
// Usage: node scripts/fetch-ga4-report.mjs [--days=28]

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GA4_PROPERTY_ID = "538431454";
const KEY_FILE = path.join(__dirname, "..", ".secrets", "search-console-service-account.json");

const daysArg = process.argv.find((a) => a.startsWith("--days="));
const days = daysArg ? Number(daysArg.split("=")[1]) : 28;

const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

async function main() {
  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  const rows = response.rows ?? [];
  if (rows.length === 0) {
    console.log("No rows returned. Check property ID, service account access, and API enablement.");
    return;
  }

  console.log(`date       activeUsers  sessions  pageViews`);
  for (const row of rows) {
    const [date] = row.dimensionValues.map((v) => v.value);
    const [users, sessions, views] = row.metricValues.map((v) => v.value);
    const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    console.log(
      `${formattedDate}  ${users.padStart(11)}  ${sessions.padStart(8)}  ${views.padStart(9)}`
    );
  }
}

main().catch((err) => {
  console.error("GA4 report fetch failed:", err.message);
  process.exitCode = 1;
});
