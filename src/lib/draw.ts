// The draw: which game the meeting plays. It's decided first, from the browser's crypto, and only then
// does Folio's reel spin its way to it (the strip's filler rows are decoration). An integer comes from
// 32-bit words by rejection, never by scaling: 2^32 words don't split evenly into n games, so a word
// at or past the last full multiple of n is drawn again and every game owns exactly as many words.
// learnings/randomness.md in the workspace has the why.

/** One 32-bit word from the platform's crypto (the browser's, or Node's global webcrypto). */
export function cryptoWord(): number {
  return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
}

/** A random integer in 0..n-1, exactly uniform. */
export function fairInt(n: number, word: () => number = cryptoWord): number {
  if (!Number.isInteger(n) || n < 1 || n > 0x100000000) throw new RangeError('fairInt needs an integer 1 ≤ n ≤ 2^32');
  const limit = Math.floor(0x100000000 / n) * n;
  let w = word() >>> 0;
  while (w >= limit) w = word() >>> 0;
  return w % n;
}

/**
 * The drawn game's index among `size`: never the previous draw again (with two or more), every other
 * game equally likely. -1 for an empty pool.
 */
export function drawIndex(size: number, previous = -1, word: () => number = cryptoWord): number {
  if (size <= 0) return -1;
  if (size === 1) return 0;
  const skip = previous >= 0 && previous < size;
  const i = fairInt(skip ? size - 1 : size, word);
  return skip && i >= previous ? i + 1 : i;
}
