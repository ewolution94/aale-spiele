// Each game's mark, drawn like the ewolution app icons (development/plans/app-icons): a 64-unit
// canvas, one stroke weight, and exactly one dot, the spark. `.i` is drawn in the game's ink,
// `.k` (the spark) in its spark colour; the ground is the tile behind the drawing (Tile.svelte).
// Only these fixed strings are ever rendered as markup.

export const GLYPHS: Record<string, string> = {
  // A pencil; the spark is the point that draws.
  skribbl: '<path class="i" d="M40 13 L51 24 L29 46 L16 49 L18 35 Z"/><path class="i" d="M34 19 L45 30"/><circle class="k" cx="16" cy="49" r="4.5"/>',
  // Kritzle's own mark (kritzle/brand): a scribble looping across a sheet, the spark the pen's tip.
  kritzle: '<rect class="i" x="12.9" y="16.4" width="38.2" height="31.2" rx="2.8" transform="rotate(-6 32 32)" opacity=".5"/><path class="i" d="M15.9 44.3 C20 37.7 24.2 33.5 26.3 29.4 C28.3 25.5 23.8 23.8 22.5 27.8 C21 32.5 26.6 40 32.9 36.8 C37.9 34.4 38.4 28.6 34.7 28.4 C31.3 28.4 32.9 37.7 39.8 37.7 C44 37.7 46.3 33.5 48.1 30.2"/><circle class="k" cx="49.2" cy="28.1" r="4"/>',
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
  // Vollmond's own mark (vollmond/brand): a wolf howling across the full moon, the moon the spark.
  // The wolf is solid (`.s`), as in the app icon.
  vollmond: '<circle class="k" cx="35.4" cy="21.1" r="9.4"/><path class="s" d="M13.7 50.5C13.7 50.5 14.7 46.9 15.7 44.5C16.6 42 17.3 40.7 18.3 38.4C19.2 36.1 19.7 35 20.3 33C20.9 31.1 20.8 30.7 21.3 28.8C21.7 26.9 22.1 25.2 22.5 23.6C22.9 21.9 23 21.2 23.2 20.4C23.4 19.5 23.5 19.3 23.5 19.3C23.5 19.3 22.9 17.9 22.7 17C22.4 16 22.3 14.3 22.3 14.3C22.3 14.3 23.8 15.2 24.5 15.9C25.1 16.5 25.7 17.6 25.7 17.6C25.7 17.6 25.7 16.3 26 15.4C26.2 14.6 26.8 13.2 26.8 13.2C26.8 13.2 27.4 14.6 27.8 15.4C28.1 16.3 28.4 17.6 28.4 17.6C28.4 17.6 29.8 19 29.8 19C29.8 19 31.9 17.8 33.3 17.1C34.6 16.3 35.4 15.9 36.4 15.3C37.4 14.7 38.3 14.2 38.3 14.2C38.3 14.2 39.1 14.2 39.3 14.5C39.5 14.7 39.6 15.4 39.6 15.4C39.6 15.4 39 16.3 39 16.3C39 16.3 38.1 16.8 37.1 17.5C36.1 18.2 33.9 20 33.9 20C33.9 20 35.1 19.5 35.9 19.3C36.6 19.1 37.5 18.9 37.5 18.9C37.5 18.9 37.4 19.6 36.8 20.1C36.3 20.6 35.6 20.9 34.8 21.4C33.9 21.8 32.7 22.6 32.7 22.6C32.7 22.6 32.1 24 32.3 25.1C32.4 26.1 33.4 27.8 33.4 27.8C33.4 27.8 32.6 28.5 32.6 28.5C32.6 28.5 34.1 33 34.1 33C34.1 33 34.8 35.2 35.2 36.8C35.6 38.3 35.8 39.2 36.1 40.9C36.5 42.5 36.7 43.1 37 45C37.3 46.9 37.7 50.5 37.7 50.5C37.7 50.5 13.7 50.5 13.7 50.5Z"/>',
  // A map pin; the spark is the spot.
  geoguessr: '<path class="i" d="M32 53 C25 45 18 38 18 28 A14 14 0 0 1 46 28 C46 38 39 45 32 53 Z"/><circle class="k" cx="32" cy="28" r="4.8"/>',
  // Two trails; the spark is the head about to crash into the other one.
  curvecrash: '<path class="i" d="M11 22 C30 22 30 45 53 45"/><path class="i" d="M13 52 C17 47 20 45 23 43"/><circle class="k" cx="27" cy="40" r="4.5"/>',
  // The pitch from above, halfway line and all; the spark is the ball.
  haxball: '<rect class="i" x="10" y="15" width="44" height="34" rx="7"/><path class="i" d="M32 15 V49"/><circle class="k" cx="43" cy="32" r="5"/>',
  // Nothing drawn yet: a question mark whose dot is the spark.
  unknown: '<path class="i" d="M23.5 24 C23.5 14.5 40.5 14.5 40.5 24 C40.5 31 32 31.5 32 39"/><circle class="k" cx="32" cy="48.5" r="4.5"/>',
};
