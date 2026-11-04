// Production server: serves the built page from ../dist, the Census forwarder, and the games as
// Dashboard set them (on and off, in order: Folio's config-server, the manifest in
// dist/ewo.config.json). No dependencies; the games ship with the page.
//
//   PORT=8080 HOST=0.0.0.0 node server/server.mjs
//
// The environment variables are in the README.

import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { createCensus } from './census.mjs';
import { createConfig } from '../vendor/ewo/elements/config-server.js';

const portFlag = process.argv.indexOf('--port');
const PORT = Number(portFlag > -1 ? process.argv[portFlag + 1] : (process.env.PORT ?? 8080));
const HOST = process.env.HOST ?? '0.0.0.0';
const DIST = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.txt']);

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'content-security-policy': [
    "default-src 'self'",
    "script-src 'self'",
    // Svelte writes style="" attributes for each game's colours; the shared elements use
    // constructable stylesheets, which 'self' already allows.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; '),
};

const census = createCensus({ target: process.env.AALE_SPIELE_CENSUS ?? '', site: 'aale-spiele' });
const compressed = new Map();

// Dashboard's values for this app, checked against the manifest the build wrote from games.ts.
// Until Dashboard answers, and whenever it's down, every game in games.ts's order: the page as it
// ships. Never part of /healthz, so Dashboard being down can't turn Aale Spiele red in Pulse.
const config = createConfig({
  manifest: JSON.parse(await readFile(path.join(DIST, 'ewo.config.json'), 'utf8')),
  url: process.env.DASHBOARD_URL ?? '',
});
config.start();

const TILES = JSON.parse(await readFile(path.join(DIST, 'games.json'), 'utf8'));

/** The games Dashboard leaves on, in its order, as Atrium's tile draws them (src/lib/config.ts does the same for the page). */
function shownTiles() {
  const bySlug = new Map(TILES.map((tile) => [tile.slug, tile]));
  const shown = (config.get().values.games ?? []).filter((item) => item.on && bySlug.has(item.id)).map((item) => bySlug.get(item.id));
  return shown.length ? shown : TILES;
}

// The page and /games.json change with the values: their bodies are kept for the current version
// only, the static files' for as long as the server runs.
let byValues = { etag: '', bodies: new Map() };
function valuesCache() {
  if (byValues.etag !== config.etag()) byValues = { etag: config.etag(), bodies: new Map() };
  return byValues.bodies;
}

/** A body in the encoding asked for, made once per key; `make` gives the plain bytes. */
async function encoded(cache, key, encoding, make) {
  const id = `${key}:${encoding ?? 'identity'}`;
  let body = cache.get(id);
  if (!body) {
    const raw = await make();
    body = encoding === 'br' ? zlib.brotliCompressSync(raw) : encoding === 'gzip' ? zlib.gzipSync(raw) : raw;
    cache.set(id, body);
  }
  return body;
}

function send(req, res, headers, body, encoding) {
  res.writeHead(200, { ...headers, 'content-length': body.length, vary: 'accept-encoding', ...(encoding && { 'content-encoding': encoding }) });
  res.end(req.method === 'HEAD' ? undefined : body);
}

async function resolveFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const file = path.join(DIST, path.normalize(decoded));
  if (file !== DIST && !file.startsWith(DIST + path.sep)) return null;
  try {
    const info = await stat(file);
    if (info.isFile()) return { file, size: info.size, mtime: info.mtime };
  } catch {}
  return null;
}

async function serveStatic(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');
  let entry = await resolveFile(pathname);
  // The page is one document: / serves it, and so does any path without a file extension (an
  // old bookmark, a typo). A missing file with an extension stays a 404, so an old /assets/
  // name after a deploy never gets the HTML.
  if (!entry && !path.extname(pathname)) entry = await resolveFile('/index.html');
  if (!entry) {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
    return;
  }

  const ext = path.extname(entry.file);
  const headers = {
    'content-type': MIME[ext] ?? 'application/octet-stream',
    'cache-control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    'last-modified': entry.mtime.toUTCString(),
  };

  const accept = req.headers['accept-encoding'] ?? '';
  const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null;

  // The page carries Dashboard's values (#ewo-config, a data block the CSP allows), and
  // /games.json the games they leave on.
  if (entry.file === path.join(DIST, 'index.html')) {
    const page = async () => Buffer.from(config.inject(await readFile(entry.file, 'utf8')));
    return send(req, res, headers, await encoded(valuesCache(), `page:${entry.mtime.getTime()}`, encoding, page), encoding);
  }
  if (entry.file === path.join(DIST, 'games.json')) {
    const games = () => Buffer.from(JSON.stringify(shownTiles()));
    return send(req, res, headers, await encoded(valuesCache(), 'games', encoding, games), encoding);
  }

  if (encoding && COMPRESSIBLE.has(ext) && entry.size < 8 * 1024 * 1024) {
    const file = () => readFile(entry.file);
    return send(req, res, headers, await encoded(compressed, `${entry.file}:${entry.mtime.getTime()}`, encoding, file), encoding);
  }

  res.writeHead(200, { ...headers, 'content-length': entry.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(entry.file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/healthz') return res.writeHead(200, { 'content-type': 'text/plain' }).end('ok');

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);

  try {
    if (await census(req, res)) return;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end();
      return;
    }
    await serveStatic(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.writeHead(500).end('Internal error');
    else res.destroy();
  }
});

// Docker stops containers with SIGTERM, which Node ignores as PID 1 unless handled; without
// this, every Watchtower update waits out the 10 s grace period and then kills us.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeAllConnections();
    setTimeout(() => process.exit(0), 2000).unref();
  });
}

server.listen(PORT, HOST, () => {
  console.log(`Aale Spiele listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
