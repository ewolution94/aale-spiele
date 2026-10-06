// Each game's mark, drawn like the ewolution app icons (development/plans/app-icons): a 64-unit
// canvas, one stroke weight, and exactly one dot, the spark. `.i` is drawn in the game's ink,
// `.k` (the spark) in its spark colour; the ground is the tile behind the drawing (Tile.svelte).
// Only these fixed strings are ever rendered as markup.

export const GLYPHS: Record<string, string> = {
  // A pencil; the spark is the point that draws.
  skribbl: '<path class="i" d="M40 13 L51 24 L29 46 L16 49 L18 35 Z"/><path class="i" d="M34 19 L45 30"/><circle class="k" cx="16" cy="49" r="4.5"/>',
  // Two speech bubbles, one passing to the next; the spark is what's being passed on.
  'gartic-phone': '<path class="i" d="M16 11 H32 Q38 11 38 17 V22 Q38 28 32 28 H22 L15 33 V27 Q11 26 11 21 V16 Q11 11 16 11 Z"/><path class="i" d="M32 33 H48 Q53 33 53 38 V43 Q53 48 49 49 V55 L42 50 H32 Q26 50 26 44 V39 Q26 33 32 33 Z"/><circle class="k" cx="39.5" cy="41.5" r="4.2"/>',
  // Four of the 25 cards; the spark is the agent found.
  codenames: '<rect class="i" x="13" y="13" width="16" height="16" rx="4"/><rect class="i" x="35" y="13" width="16" height="16" rx="4"/><rect class="i" x="13" y="35" width="16" height="16" rx="4"/><rect class="i" x="35" y="35" width="16" height="16" rx="4"/><circle class="k" cx="43" cy="43" r="4.5"/>',
  // A route from country to country; the spark is the destination.
  travle: '<circle class="i" cx="16" cy="47" r="4.5"/><path class="i" d="M19.5 43 L27 32 L36 38 L44 26"/><circle class="k" cx="47.5" cy="20.5" r="4.8"/>',
  // A painting from a prompt; the spark is its sun.
  impromptu: '<rect class="i" x="11" y="13" width="42" height="38" rx="8"/><path class="i" d="M18 44 L27 33 L34 40 L39 35 L46 43"/><circle class="k" cx="40" cy="24" r="4.5"/>',
  // A note; the spark is its head.
  songlio: '<path class="i" d="M37 44 V14 C42 16 47 19 47 26"/><circle class="k" cx="30" cy="44" r="7.5"/>',
  // A gauge: how close was the guess. The spark is the needle's pivot.
  'guess-the-price': '<path class="i" d="M13 43 A19 19 0 0 1 51 43"/><path class="i" d="M32 43 L41 30"/><circle class="k" cx="32" cy="43" r="5"/>',
  // Schätzle's own mark (schaetzle/brand): "Was kostet das?", the dot is the guess.
  schaetzle: '<path class="i" d="M23.5 24 C23.5 14.5 40.5 14.5 40.5 24 C40.5 31 32 31.5 32 39"/><circle class="k" cx="32" cy="48.5" r="4.5"/>',
  // A map pin; the spark is the spot.
  geoguessr: '<path class="i" d="M32 53 C25 45 18 38 18 28 A14 14 0 0 1 46 28 C46 38 39 45 32 53 Z"/><circle class="k" cx="32" cy="28" r="4.8"/>',
  // Two trails; the spark is the head about to crash into the other one.
  curvecrash: '<path class="i" d="M11 22 C30 22 30 45 53 45"/><path class="i" d="M13 52 C17 47 20 45 23 43"/><circle class="k" cx="27" cy="40" r="4.5"/>',
  // The pitch from above, halfway line and all; the spark is the ball.
  haxball: '<rect class="i" x="10" y="15" width="44" height="34" rx="7"/><path class="i" d="M32 15 V49"/><circle class="k" cx="43" cy="32" r="5"/>',
  // Nothing drawn yet: a question mark whose dot is the spark.
  unknown: '<path class="i" d="M23.5 24 C23.5 14.5 40.5 14.5 40.5 24 C40.5 31 32 31.5 32 39"/><circle class="k" cx="32" cy="48.5" r="4.5"/>',
};
