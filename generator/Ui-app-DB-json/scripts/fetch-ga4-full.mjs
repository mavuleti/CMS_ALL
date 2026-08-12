#!/usr/bin/env node
// Dumps a comprehensive GA4 dataset to temp/ga4-full-report.json for offline analysis.
// Usage: node scripts/fetch-ga4-full.mjs [--days=28]

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GA4_PROPERTY_ID = "538431454";
const KEY_FILE = path.join(__dirname, "..", ".secrets", "search-console-service-account.json");
const OUT_FILE = path.join(__dirname, "..", "temp", "ga4-full-report.json");

const daysArg = process.argv.find((a) => a.startsWith("--days="));
const days = daysArg ? Number(daysArg.split("=")[1]) : 28;

const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });
const property = `properties/${GA4_PROPERTY_ID}`;
const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];

function simplify(response) {
  const dims = (response.dimensionHeaders ?? []).map((h) => h.name);
  const mets = (response.metricHeaders ?? []).map((h) => h.name);
  return (response.rows ?? []).map((row) => {
    const out = {};
    row.dimensionValues.forEach((v, i) => (out[dims[i]] = v.value));
    row.metricValues.forEach((v, i) => (out[mets[i]] = v.value));
    return out;
  });
}

async function report(name, request) {
  try {
    const [response] = await client.runReport({ property, dateRanges, limit: 250, ...request });
    console.log(`fetched: ${name} (${response.rows?.length ?? 0} rows)`);
    return simplify(response);
  } catch (err) {
    console.error(`FAILED: ${name}: ${err.message}`);
    return { error: err.message };
  }
}

async function main() {
  const data = {
    generatedAt: new Date().toISOString(),
    propertyId: GA4_PROPERTY_ID,
    days,

    daily: await report("daily", {
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),

    channels: await report("channels", {
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "engagementRate" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),

    sourceMedium: await report("sourceMedium", {
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "engagementRate" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),

    // Daily breakdown by channel to explain the traffic spikes
    dailyByChannel: await report("dailyByChannel", {
      dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),

    topPages: await report("topPages", {
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    }),

    landingPages: await report("landingPages", {
      dimensions: [{ name: "landingPage" }],
      metrics: [{ name: "sessions" }, { name: "bounceRate" }, { name: "engagementRate" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),

    countries: await report("countries", {
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "engagementRate" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),

    languages: await report("languages", {
      dimensions: [{ name: "language" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),

    devices: await report("devices", {
      dimensions: [{ name: "deviceCategory" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "engagementRate" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),

    events: await report("events", {
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    }),

    newVsReturning: await report("newVsReturning", {
      dimensions: [{ name: "newVsReturning" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "engagementRate" }],
    }),

    // What pages the spike-day visitors hit, to identify the traffic driver
    spikePages: await report("spikePages", {
      dimensions: [{ name: "date" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "date",
          inListFilter: { values: ["20260702", "20260714", "20260715", "20260716", "20260718"] },
        },
      },
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    }),
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\nWrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("GA4 full report failed:", err.message);
  process.exitCode = 1;
});
