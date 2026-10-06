import { test } from 'node:test';
import assert from 'node:assert/strict';
// Node runs the TypeScript sources directly (type stripping, Node 24).
import { GAMES, GROUPS, buttonColor, contrast, host } from '../src/lib/games.ts';
import { pick, strip } from '../src/lib/pick.ts';

test('every game is complete and links out over https', () => {
  const slugs = new Set();
  for (const game of GAMES) {
    assert.match(game.slug, /^[a-z0-9-]+$/, game.slug);
    assert.ok(!slugs.has(game.slug), `${game.slug} twice`);
    slugs.add(game.slug);
    assert.equal(new URL(game.url).protocol, 'https:', game.slug);
    assert.ok(GROUPS.includes(game.group), `${game.slug}: unknown group ${game.group}`);
    assert.ok(game.modes.length > 0, `${game.slug}: no mode`);
    for (const lang of ['de', 'en']) assert.ok(game.text[lang]?.length > 20, `${game.slug}: no ${lang} text`);
    for (const colour of [...game.ground, game.ink, game.spark]) assert.match(colour, /^#[0-9a-f]{6}$/, game.slug);
  }
});

test('the list is the team’s ten, in their order, plus our own Schätzle beside Guess the Price', () => {
  assert.deepEqual(
    GAMES.map(host),
    ['skribbl.io', 'garticphone.com', 'codenames.game', 'travle.earth', 'impromptu.fun', 'songl.io', 'guess-the-price.de', 'schaetzle.ewolution.cloud', 'geoguessr.com', 'curvecrash.com', 'haxball.com'],
  );
});

test('every "Let’s go" label reads on its button', () => {
  assert.equal(contrast('#ffffff', '#000000').toFixed(0), '21');
  for (const game of GAMES) {
    const ratio = contrast(buttonColor(game), game.ink);
    assert.ok(ratio >= 4.5, `${game.slug}: ${buttonColor(game)} gives ${ratio.toFixed(2)}`);
  }
});

test('every filter has games in it', () => {
  for (const group of GROUPS) assert.ok(GAMES.some((g) => g.group === group), group);
});

/** Random numbers from a list, for repeatable draws. */
const seq = (...values) => {
  let i = 0;
  return () => values[i++ % values.length];
};

test('pick never repeats the previous game', () => {
  for (let previous = 0; previous < 10; previous++) {
    for (let r = 0; r < 1; r += 0.01) {
      const i = pick(10, previous, () => r);
      assert.ok(i >= 0 && i < 10);
      assert.notEqual(i, previous);
    }
  }
});

test('pick reaches every other game', () => {
  const seen = new Set();
  for (let r = 0; r < 1; r += 0.001) seen.add(pick(10, 3, () => r));
  assert.deepEqual([...seen].sort((a, b) => a - b), [0, 1, 2, 4, 5, 6, 7, 8, 9]);
});

test('pick handles tiny pools', () => {
  assert.equal(pick(0, -1), -1);
  assert.equal(pick(1, 0), 0);
  assert.equal(pick(2, 0, () => 0.99), 1);
  assert.equal(pick(2, 1, () => 0), 0);
  // A previous index from a bigger pool (the filter changed) doesn't count.
  assert.equal(pick(2, 7, () => 0.99), 1);
});

test('the reel ends on the target and never stalls', () => {
  for (let target = 0; target < 4; target++) {
    for (const from of [-1, 0, 1, 2, 3]) {
      const random = seq(0.1, 0.7, 0.4, 0.95, 0.2, 0.55);
      const reel = strip(4, target, 12, from, random);
      assert.equal(reel.at(-1), target);
      if (from >= 0) assert.equal(reel[0], from);
      assert.ok(reel.length >= 12);
      for (let i = 1; i < reel.length; i++) assert.notEqual(reel[i], reel[i - 1], `stalls in ${reel}`);
    }
  }
});

test('the reel of a single game is just that game', () => {
  assert.deepEqual(strip(1, 0, 12, 0), [0]);
});
