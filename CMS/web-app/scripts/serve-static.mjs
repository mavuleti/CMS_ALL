import { createGzip } from 'node:zlib';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve('out');

// Mirror firebase.json's hosting redirects locally so `next start`-free static
// serving (used by Playwright) matches production Firebase Hosting behavior —
// e.g. the bare "/" has no out/index.html and only works via the "^/$" -> "/en/"
// redirect declared there, never as a static file.
function loadRedirectRules() {
  const firebaseJson = JSON.parse(readFileSync(path.resolve('firebase.json'), 'utf8'));
  const redirects = firebaseJson.hosting?.redirects ?? [];

  return redirects.map((rule) => {
    if (rule.regex) {
      return { pattern: new RegExp(rule.regex), destination: rule.destination };
    }

    if (rule.source.includes(':path*')) {
      const prefix = rule.source.slice(0, rule.source.indexOf(':path*'));
      const pattern = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(.*)$');
      return { pattern, destination: rule.destination, isPathWildcard: true };
    }

    return { pattern: rule.source, destination: rule.destination };
  });
}

const redirectRules = loadRedirectRules();

function resolveRedirect(pathname) {
  for (const rule of redirectRules) {
    if (typeof rule.pattern === 'string') {
      if (rule.pattern === pathname) return rule.destination;
      continue;
    }

    const match = pathname.match(rule.pattern);
    if (!match) continue;

    if (rule.isPathWildcard) {
      return rule.destination.replace(':path*', match[1]);
    }

    return rule.destination.replace(/:(\d+)\??/g, (_, index) => match[Number(index)] ?? '');
  }

  return null;
}
// Dedicated test-server port (see playwright.config.ts / playwright.i18n.config.ts
// for why this isn't 3000: other agents/processes may already have that in use).
const port = Number.parseInt(process.env.PORT ?? '4444', 10);
const idleExitMs = Number.parseInt(process.env.PLAYWRIGHT_STATIC_IDLE_EXIT_MS ?? '0', 10);
let idleExitTimer;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const compressible = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt']);
const immutableAssets = new Set(['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico']);

function isMissingRscPrefetch(requestUrl) {
  const url = new URL(requestUrl ?? '/', `http://localhost:${port}`);
  return url.pathname.endsWith('.txt') && url.searchParams.has('_rsc');
}

// Mirrors Firebase Hosting's 404.html lookup: walk up from the requested
// path's own directory to the site root, serving the first 404.html found
// with a real 404 status. Never falls back to index.html/homepage content —
// that would be a soft-404 (real content served with a 200-shaped response)
// which is exactly what the "Custom 404 page" work item fixed for production.
function resolveNotFoundFile(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  segments.pop();

  for (let i = segments.length; i >= 0; i -= 1) {
    const candidate = path.join(root, ...segments.slice(0, i), '404.html');
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function resolveFile(requestPath) {
  const pathname = decodeURIComponent(new URL(requestPath, `http://localhost:${port}`).pathname);
  let file = path.join(root, pathname);

  if (!file.startsWith(root)) {
    return null;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }

  if (!existsSync(file)) {
    const extension = path.extname(pathname).toLowerCase();
    if (extension || pathname.startsWith('/_next/') || pathname.startsWith('/assets/') || pathname.startsWith('/images/')) {
      return null;
    }

    const withIndex = path.join(root, pathname, 'index.html');
    file = existsSync(withIndex) ? withIndex : null;
  }

  return file;
}

const server = http.createServer((request, response) => {
  scheduleIdleExit();

  const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://localhost:${port}`).pathname);
  const redirectTo = resolveRedirect(pathname);
  if (redirectTo) {
    response.writeHead(301, { Location: redirectTo });
    response.end();
    return;
  }

  const file = resolveFile(request.url ?? '/');
  let notFoundFile = null;

  if (!file) {
    if (isMissingRscPrefetch(request.url)) {
      response.writeHead(204, { 'Content-Type': 'text/x-component; charset=utf-8' });
      response.end();
      return;
    }

    notFoundFile = resolveNotFoundFile(pathname);
    if (!notFoundFile) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
  }

  const servedFile = file ?? notFoundFile;
  const extension = path.extname(servedFile).toLowerCase();
  const headers = {
    'Content-Type': contentTypes[extension] ?? 'application/octet-stream'
  };

  if (immutableAssets.has(extension)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (extension === '.html') {
    headers['Cache-Control'] = 'no-cache';
  }

  const status = notFoundFile ? 404 : 200;
  const acceptsGzip = /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
  if (acceptsGzip && compressible.has(extension)) {
    response.writeHead(status, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    createReadStream(servedFile).pipe(createGzip()).pipe(response);
    return;
  }

  response.writeHead(status, headers);
  createReadStream(servedFile).pipe(response);
});

function scheduleIdleExit() {
  if (!idleExitMs) return;
  clearTimeout(idleExitTimer);
  idleExitTimer = setTimeout(() => {
    shutdown();
  }, idleExitMs);
  idleExitTimer.unref();
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Compressed static server running at http://localhost:${port}`);
  scheduleIdleExit();
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
