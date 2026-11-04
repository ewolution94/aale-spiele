import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// What Aale Spiele hands Dashboard and Atrium (src/lib/family.ts), checked with Folio's own rules,
// and what the page shows from Dashboard's values (src/lib/config.ts; the family's language and
// theme in src/lib/defaults.ts and public/boot.js).
import { GAMES, host } from '../src/lib/games.ts';
import { GLYPHS } from '../src/lib/glyphs.ts';
import { manifest, tiles } from '../src/lib/family.ts';
import { shownGames } from '../src/lib/config.ts';
import { languageFor, themeFor } from '../src/lib/defaults.ts';
import { checkManifest, resolve } from '../vendor/ewo/elements/config-core.js';

test('the manifest is one Dashboard takes, with a row per game in games.ts, in its order', () => {
  const { ok, problems, manifest: checked } = checkManifest(manifest(GAMES));
  assert.deepEqual(problems, []);
  assert.ok(ok);
  assert.deepEqual(Object.keys(checked.settings), ['games', 'lang', 'theme']);
  const ids = checked.settings.games.ids;
  assert.deepEqual(ids.map((item) => item.id), GAMES.map((game) => game.slug));
  assert.deepEqual(ids.map((item) => item.label), GAMES.map((game) => game.name));
  for (const item of ids) assert.ok(item.hint.en && item.hint.de, `${item.id}: no kind`);
});

test('with nothing set in Dashboard, every game is on, in games.ts’s order: the page as it ships', () => {
  const { values, sources } = resolve(manifest(GAMES), {});
  assert.deepEqual(values.games, GAMES.map((game) => ({ id: game.slug, on: true })));
  assert.equal(sources.games, 'built-in');
  assert.deepEqual(shownGames(GAMES, values.games), GAMES);
});

test('Dashboard’s order and the games it turns off reach the page; a value that doesn’t fit is dropped', () => {
  const { values } = resolve(manifest(GAMES), {
    app: { games: [{ id: 'kritzle', on: true }, { id: 'skribbl', on: false }, { id: 'nope', on: true }, { id: 'travle', on: 'yes' }] },
  });
  const shown = shownGames(GAMES, values.games).map((game) => game.slug);
  // Kritzle first, skribbl.io gone, Travle back on (its value didn't fit), the rest in their order.
  assert.deepEqual(shown, ['kritzle', 'travle', ...GAMES.map((game) => game.slug).filter((slug) => !['skribbl', 'kritzle', 'travle'].includes(slug))]);
});

test('the page shows every game without values, keeps a game the values don’t name, and never shows none', () => {
  globalThis.document = { getElementById: () => null };
  try {
    assert.deepEqual(shownGames(GAMES), GAMES);
  } finally {
    delete globalThis.document;
  }
  const [first, second, ...rest] = GAMES;
  assert.deepEqual(shownGames(GAMES, [{ id: second.slug, on: true }]), [second, first, ...rest]);
  assert.deepEqual(shownGames(GAMES, GAMES.map((game) => ({ id: game.slug, on: false }))), GAMES);
});

test('every game reaches Atrium’s tile with its drawing and its address', () => {
  const list = tiles(GAMES, GLYPHS);
  assert.equal(list.length, GAMES.length);
  for (const [i, tile] of list.entries()) {
    assert.equal(tile.slug, GAMES[i].slug);
    assert.equal(tile.host, host(GAMES[i]));
    assert.match(tile.mark, /^<[a-z]/, `${tile.slug}: no mark`);
  }
});

test('with nothing set in Dashboard, the language and theme follow the device: the page as it ships', () => {
  const { values, sources } = resolve(manifest(GAMES), {});
  assert.equal(values.lang, 'system');
  assert.equal(values.theme, 'system');
  assert.equal(sources.lang, 'built-in');
  assert.equal(sources.theme, 'built-in');
  assert.equal(themeFor('system', values.theme), 'system');
  assert.equal(languageFor('system', values.lang, 'de'), 'de');
  assert.equal(languageFor('system', values.lang, 'en'), 'en');
  // No #ewo-config at all (offline, Dashboard off): the same.
  assert.equal(themeFor('system', undefined), 'system');
  assert.equal(languageFor('system', undefined, 'de'), 'de');
});

test('Dashboard’s family default and this app’s own value reach the page', () => {
  const family = resolve(manifest(GAMES), { family: { theme: 'dark', lang: 'en' } }).values;
  assert.deepEqual([family.lang, family.theme], ['en', 'dark']);
  const own = resolve(manifest(GAMES), { family: { theme: 'dark', lang: 'en' }, app: { theme: 'light' } }).values;
  assert.deepEqual([own.lang, own.theme], ['en', 'light']);
});

test('the device’s own choice beats Dashboard’s default, which beats the built-in one', () => {
  assert.equal(themeFor('light', 'dark'), 'light');
  assert.equal(themeFor('system', 'dark'), 'dark');
  assert.equal(themeFor('system', 'system'), 'system');
  assert.equal(themeFor('system', 'purple'), 'system');
  // QA's `ewo:lang` = `en` is this device's own choice, so it keeps winning.
  assert.equal(languageFor('en', 'de', 'de'), 'en');
  assert.equal(languageFor('system', 'en', 'de'), 'en');
  assert.equal(languageFor('system', 'system', 'de'), 'de');
});

/** public/boot.js against a stub page: the theme and language it applies before first paint. */
function boot({ stored = {}, config, language = 'de-DE' }) {
  const root = { dataset: {}, lang: 'de', classList: { add() {}, remove() {} }, style: { setProperty() {} } };
  const metas = [{ content: '#09090b', media: '(prefers-color-scheme: dark)' }, { content: '#f5f4f1', media: '(prefers-color-scheme: light)' }];
  const document = {
    documentElement: root,
    getElementById: (id) => (id === 'ewo-config' && config ? { textContent: JSON.stringify(config) } : null),
    querySelectorAll: () => metas,
    addEventListener() {},
  };
  vm.runInNewContext(readFileSync(new URL('../public/boot.js', import.meta.url), 'utf8'), {
    document,
    localStorage: { getItem: (key) => stored[key] ?? null },
    matchMedia: () => ({ matches: false }),
    navigator: { language },
    location: { search: '' },
    screen: {},
    addEventListener() {},
    setTimeout() {},
  });
  return { theme: root.dataset.theme, lang: root.lang, colors: metas.map((m) => m.content) };
}

test('before first paint: the saved theme and language, else Dashboard’s, else the system’s and the browser’s', () => {
  assert.deepEqual(boot({}), { theme: undefined, lang: 'de', colors: ['#09090b', '#f5f4f1'] });
  assert.deepEqual(boot({ language: 'en-US', config: { theme: 'system', lang: 'system' } }), { theme: undefined, lang: 'en', colors: ['#09090b', '#f5f4f1'] });
  assert.deepEqual(boot({ config: { theme: 'dark', lang: 'en' } }), { theme: 'dark', lang: 'en', colors: ['#09090b', '#09090b'] });
  assert.deepEqual(boot({ stored: { 'ewo:theme': 'light', 'ewo:lang': 'de' }, config: { theme: 'dark', lang: 'en' } }), { theme: 'light', lang: 'de', colors: ['#f5f4f1', '#f5f4f1'] });
  assert.equal(boot({ stored: { 'ewo:lang': 'en' }, config: { lang: 'de' } }).lang, 'en');
});
