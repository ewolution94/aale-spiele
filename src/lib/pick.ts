// The draw behind "Was spielen wir?": which game, and the strip of names the reel spins
// through on its way there. Pure, so the tests can hand in their own random numbers.

/**
 * A random index into a pool of `size`, never `previous` when there's anything else to pick:
 * "Again" should always land somewhere new.
 */
export function pick(size: number, previous: number, random: () => number = Math.random): number {
  if (size <= 0) return -1;
  if (size === 1) return 0;
  const skip = previous >= 0 && previous < size;
  const i = Math.floor(random() * (skip ? size - 1 : size));
  return skip && i >= previous ? i + 1 : i;
}

/**
 * The reel: about `length` indices into a pool of `size`, ending on `target`, never the same
 * index twice in a row (the reel would look stuck). It starts at `from` when that's given, so
 * the strip continues from whatever the window showed last.
 */
export function strip(size: number, target: number, length: number, from = -1, random: () => number = Math.random): number[] {
  if (size <= 1) return [target];
  const out = from >= 0 && from < size ? [from] : [];
  while (out.length < length - 1) out.push(pick(size, out.at(-1) ?? -1, random));
  if (out.at(-1) === target) out.push((target + 1) % size);
  out.push(target);
  return out;
}
