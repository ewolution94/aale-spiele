// The draw (src/lib/draw.ts): exactly uniform integers from 32-bit words, never the previous game
// twice. The statistics on the real crypto source are in draw.sim.mjs (npm run test:sim).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cryptoWord, drawIndex, fairInt } from '../src/lib/draw.ts';

/** Seeded 32-bit words (mulberry32), so the statistics are the same on every run. */
function words(seed = 1) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
}

/** The chi-square value df degrees of freedom stay under with probability 1 - 1e-6 (Wilson–Hilferty). */
function bound(df) {
  const z = 4.753;
  return df * (1 - 2 / (9 * df) + z * Math.sqrt(2 / (9 * df))) ** 3;
}
const chi = (count) => {
  const total = count.reduce((a, b) => a + b, 0);
  const e = total / count.length;
  return count.reduce((s, c) => s + (c - e) ** 2 / e, 0);
};

test('every number owns the same count of words; the few past the limit are drawn again', () => {
  for (const n of [1, 2, 3, 7, 9, 10, 23, 30]) {
    const limit = Math.floor(2 ** 32 / n) * n;
    assert.equal(limit % n, 0);
    assert.ok(2 ** 32 - limit < n, 'fewer than n words are ever redrawn');
    const seq = (...ws) => () => ws.shift();
    assert.equal(fairInt(n, seq(limit - 1)), (limit - 1) % n, 'the last word kept');
    if (limit < 2 ** 32) assert.equal(fairInt(n, seq(limit, 2 ** 32 - 1, 4)), 4 % n, 'a word past the limit is drawn again');
  }
  assert.throws(() => fairInt(0, () => 0), RangeError);
  assert.throws(() => fairInt(2.5, () => 0), RangeError);
});

test('the draw skips the previous game and gives every other game the same words', () => {
  assert.equal(drawIndex(0), -1);
  assert.equal(drawIndex(1, 0), 0);
  // Ten games after game 3: nine numbers, the ones from 3 up shifted past it.
  const seq = (w) => () => w;
  assert.equal(drawIndex(10, 3, seq(0)), 0);
  assert.equal(drawIndex(10, 3, seq(2)), 2);
  assert.equal(drawIndex(10, 3, seq(3)), 4);
  assert.equal(drawIndex(10, 3, seq(8)), 9);
  assert.equal(drawIndex(10, -1, seq(9)), 9, 'nothing drawn yet: all ten');
});

test('every game but the previous one is drawn as often (chi-square on seeded words)', () => {
  const word = words(7);
  const count = new Array(10).fill(0);
  for (let i = 0; i < 90_000; i++) count[drawIndex(10, 4, word)]++;
  assert.equal(count[4], 0);
  const others = count.filter((_, i) => i !== 4);
  assert.ok(chi(others) < bound(8), `chi-square ${chi(others).toFixed(1)} with 8 degrees of freedom`);
});

test('the draw takes the platform crypto, never Math.random', () => {
  const real = Math.random;
  Math.random = () => {
    throw new Error('the draw came from Math.random');
  };
  try {
    for (let i = 0; i < 100; i++) {
      const w = cryptoWord();
      assert.ok(Number.isInteger(w) && w >= 0 && w < 2 ** 32);
      assert.notEqual(drawIndex(5, 2), 2);
    }
  } finally {
    Math.random = real;
  }
});
