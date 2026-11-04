import { test } from 'node:test';
import assert from 'node:assert/strict';
// What Aale Spiele hands Dashboard and Atrium (src/lib/family.ts), checked with Folio's own rules,
// and what the page shows from Dashboard's values (src/lib/config.ts).
import { GAMES, host } from '../src/lib/games.ts';
import { GLYPHS } from '../src/lib/glyphs.ts';
import { manifest, tiles } from '../src/lib/family.ts';
import { shownGames } from '../src/lib/config.ts';
import { checkManifest, resolve } from '../vendor/ewo/elements/config-core.js';

test('the manifest is one Dashboard takes, with a row per game in games.ts, in its order', () => {
  const { ok, problems, manifest: checked } = checkManifest(manifest(GAMES));
  assert.deepEqual(problems, []);
  assert.ok(ok);
  assert.deepEqual(Object.keys(checked.settings), ['games']);
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
