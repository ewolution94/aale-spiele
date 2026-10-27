// The draw on its real source, the platform crypto: a million draws among ten games after game 4.
// Stochastic, so local only (npm run test:sim, the workspace's CLAUDE.md): a fair source fails this
// 1-in-a-million bound once in a million runs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drawIndex } from '../src/lib/draw.ts';

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

test('crypto: a million draws land on every game but the previous one evenly', () => {
  const count = new Array(10).fill(0);
  for (let i = 0; i < 1_000_000; i++) count[drawIndex(10, 4)]++;
  assert.equal(count[4], 0);
  const others = count.filter((_, i) => i !== 4);
  console.log(`  draws: chi-square ${chi(others).toFixed(1)} (bound ${bound(8).toFixed(1)}), ${others.join(' ')}`);
  assert.ok(chi(others) < bound(8));
});
