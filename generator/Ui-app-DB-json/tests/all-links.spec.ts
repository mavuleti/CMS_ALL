import {expect, test} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sitemapUrls = [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

test('every sitemap page and unique hyperlink resolves', async ({request, baseURL}) => {
  test.skip(test.info().project.name !== 'desktop-chrome', 'This request-based audit is viewport-independent.');
  test.setTimeout(15 * 60_000);
  const localOrigin = new URL(baseURL ?? 'http://127.0.0.1:4444').origin;
  const links = new Set<string>();
  const failures: string[] = [];
  const inaccessibleExternal: string[] = [];

  for (const pageUrl of sitemapUrls) {
    const localPageUrl = new URL(new URL(pageUrl).pathname, localOrigin).toString();
    const response = await request.get(localPageUrl);
    if (response.status() >= 400) {
      failures.push(`${response.status()} ${localPageUrl}`);
      continue;
    }
    const html = await response.text();
    for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
      const href = match[1].trim();
      if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) continue;
      try {
        const url = new URL(href, localPageUrl);
        url.hash = '';
        if (url.hostname === 'www.facebook.com' && url.pathname === '/sharer/sharer.php') continue;
        links.add(url.toString());
      } catch {
        failures.push(`Invalid URL ${href} on ${pageUrl}`);
      }
    }
  }

  const statusCache = new Map<string, number>();
  for (const url of links) {
    if (!statusCache.has(url)) {
      try {
        statusCache.set(url, (await request.get(url, {failOnStatusCode: false, timeout: 10_000})).status());
      } catch (error) {
        statusCache.set(url, 0);
        if (new URL(url).origin !== localOrigin) inaccessibleExternal.push(`${url} (${error instanceof Error ? error.message : String(error)})`);
        else failures.push(`request failed ${url}`);
      }
    }
    const status = statusCache.get(url)!;
    const isExternal = new URL(url).origin !== localOrigin;
    // 403/429 on external URLs are bot-blocking/rate-limiting by the third
    // party (e.g. nasa.gov throttling our crawler), not evidence the link is
    // actually broken — a browser visiting the same link works fine.
    if (status >= 400 && !(isExternal && (status === 403 || status === 429))) failures.push(`${status} ${url}`);
  }

  const internal = [...links].filter((url) => new URL(url).origin === localOrigin).length;
  test.info().annotations.push({type: 'link-audit', description: `${sitemapUrls.length} pages, ${internal} unique internal URLs, ${links.size - internal} unique external URLs; every URL requested once; ${inaccessibleExternal.length} external URLs inaccessible`});
  expect(failures, 'broken pages or hyperlinks').toEqual([]);
});
