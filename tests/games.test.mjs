import { test } from 'node:test';
import assert from 'node:assert/strict';
// Node runs the TypeScript sources directly (type stripping, Node 24).
import { GAMES, GROUPS, buttonColor, contrast, host } from '../src/lib/games.ts';
// The draw and the reel's strip are Folio's now (its tests cover them); this checks the vendored copy.
import { reelPick, reelStrip } from '../vendor/ewo/elements/reel-strip.js';

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

test('the list is the team’s ten, in their order, plus our own Kritzle beside skribbl.io, Schätzle beside Guess the Price, CDNMS beside Codenames, CurveExtreme beside CurveCrash, and Vollmond', () => {
  assert.deepEqual(
    GAMES.map(host),
    ['skribbl.io', 'kritzle.ewolution.cloud', 'garticphone.com', 'codenames.game', 'cdnms.ewolution.cloud', 'travle.earth', 'impromptu.fun', 'songl.io', 'guess-the-price.de', 'schaetzle.ewolution.cloud', 'vollmond.ewolution.cloud', 'stichle.ewolution.cloud', 'stammtisch.ewolution.cloud', 'wuerfle.ewolution.cloud', 'yksi.ewolution.cloud', 'skibbo.ewolution.cloud', 'geoguessr.com', 'curvecrash.com', 'curveextreme.ewolution.cloud', 'haxball.com'],
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

test('the vendored draw never repeats the previous game and its strip lands on the winner', () => {
  for (let previous = 0; previous < 10; previous++) {
    for (let r = 0; r < 1; r += 0.05) {
      const target = reelPick(10, previous, () => r);
      assert.notEqual(target, previous);
      const strip = reelStrip(10, target, 18, previous);
      assert.equal(strip[0], previous);
      assert.equal(strip.at(-1), target);
      for (let i = 1; i < strip.length; i++) assert.notEqual(strip[i], strip[i - 1]);
    }
  }
});
