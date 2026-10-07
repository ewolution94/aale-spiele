// The games the afternoon meeting plays, in the order the team listed them (2026-10-06).
// Nothing is fetched: a game is here because it's listed here, and the page works offline.
//
// The texts say how each game plays, from the games' own pages. `mode` is how the team plays
// it: Travle is a solo daily puzzle, solved together on a shared screen.
//
// Each game gets a small tile in the style of the ewolution app icons (the Field set): its
// colour as the ground (`ground`, top to bottom), a mark in `ink`, and one dot, the `spark`.
// The marks are drawn in Glyph.svelte.

export type Group = 'creative' | 'guessing' | 'geo' | 'action';
export type Mode = 'ffa' | 'teams' | 'together';
export type Lang = 'en' | 'de';

export interface Game {
  slug: string;
  name: string;
  url: string;
  group: Group;
  modes: Mode[];
  /** Playing needs a sign-in. */
  account?: true;
  ground: [string, string];
  ink: string;
  spark: string;
  text: Record<Lang, string>;
}

export const GROUPS: Group[] = ['creative', 'guessing', 'geo', 'action'];

export const GAMES: Game[] = [
  {
    slug: 'skribbl',
    name: 'skribbl.io',
    url: 'https://skribbl.io/',
    group: 'creative',
    modes: ['ffa'],
    ground: ['#5bb6ff', '#1f6fe0'],
    ink: '#ffffff',
    spark: '#ffe14d',
    text: {
      de: 'Eine Person zeichnet ein Wort, alle anderen raten im Chat. Wer früher richtig liegt, bekommt mehr Punkte.',
      en: 'One player draws a word, everyone else guesses in the chat. The earlier you get it, the more points.',
    },
  },
  {
    slug: 'gartic-phone',
    name: 'Gartic Phone',
    url: 'https://garticphone.com/de',
    group: 'creative',
    modes: ['together'],
    ground: ['#b18bff', '#6a3be6'],
    ink: '#ffffff',
    spark: '#ffb0dc',
    text: {
      de: 'Stille Post mit Bildern: Ein Satz wird gezeichnet, die Zeichnung beschrieben, und so weiter. Am Ende läuft die ganze Kette ab.',
      en: 'Telephone with drawings: a sentence gets drawn, the drawing gets described, and so on. At the end the whole chain plays back.',
    },
  },
  {
    slug: 'codenames',
    name: 'Codenames',
    url: 'https://codenames.game/',
    group: 'guessing',
    modes: ['teams'],
    ground: ['#ff7a6b', '#d92b3a'],
    ink: '#ffffff',
    spark: '#1d4fd8',
    text: {
      de: 'Zwei Teams, 25 Wörter. Wer die Geheimdienstchefs spielt, gibt Hinweise aus einem Wort, das eigene Team sucht die passenden Agenten.',
      en: 'Two teams, 25 words. The spymasters give one-word clues, and their team picks out its agents.',
    },
  },
  {
    slug: 'travle',
    name: 'Travle',
    url: 'https://travle.earth/',
    group: 'geo',
    modes: ['together'],
    ground: ['#4fdcb4', '#13997a'],
    ink: '#ffffff',
    spark: '#0b3d33',
    text: {
      de: 'Der kürzeste Weg von einem Land ins andere, Nachbarland für Nachbarland. Jeden Tag eine neue Strecke.',
      en: 'The shortest route from one country to another, neighbour by neighbour. A new route every day.',
    },
  },
  {
    slug: 'impromptu',
    name: 'Impromptu',
    url: 'https://impromptu.fun/',
    group: 'creative',
    modes: ['ffa'],
    ground: ['#ffab5c', '#f0661a'],
    ink: '#ffffff',
    spark: '#7a2e00',
    text: {
      de: 'Eine KI malt einen geheimen Prompt, alle anderen erfinden falsche dazu. Punkte gibt es fürs Erkennen des echten und fürs Reinlegen.',
      en: 'An AI paints a secret prompt, everyone else makes up fake ones. You score for spotting the real one and for fooling the others.',
    },
  },
  {
    slug: 'songlio',
    name: 'Songlio',
    url: 'https://songl.io/',
    group: 'guessing',
    modes: ['ffa'],
    ground: ['#e07bff', '#a531db'],
    ink: '#ffffff',
    spark: '#5ef0d0',
    text: {
      de: 'Alle wählen einen Song, alle hören 20 Sekunden davon und raten. Je schneller, desto mehr Punkte.',
      en: 'Everyone picks a song, everyone hears 20 seconds of it and guesses. The faster, the more points.',
    },
  },
  {
    slug: 'guess-the-price',
    name: 'Guess the Price',
    url: 'https://guess-the-price.de/',
    group: 'guessing',
    modes: ['ffa'],
    ground: ['#ffd45c', '#f2a20e'],
    ink: '#1b1712',
    spark: '#ffffff',
    text: {
      de: 'Was kostet das? Zufällige eBay-Artikel, und wer am nächsten am echten Preis liegt, punktet.',
      en: 'What does it cost? Random eBay listings, and the guess closest to the real price scores.',
    },
  },
  {
    // Ours (schaetzle.ewolution.cloud): Guess the Price rebuilt for this meeting, in OTTO's red.
    slug: 'schaetzle',
    name: 'Schätzle',
    url: 'https://schaetzle.ewolution.cloud/',
    group: 'guessing',
    modes: ['ffa'],
    ground: ['#dc001d', '#a30016'],
    ink: '#ffffff',
    spark: '#212121',
    text: {
      de: 'Unsere eigene Version von Guess the Price: Artikel ansehen, Preis tippen, wer am nächsten dran ist, punktet. Beitreten mit Code, ohne Konto.',
      en: 'Our own take on Guess the Price: look at an item, guess its price, the closest guess scores. Join with a code, no account.',
    },
  },
  {
    // Ours (vollmond.ewolution.cloud): Werewolf with the app as the narrator, its cards woodcuts.
    slug: 'vollmond',
    name: 'Vollmond',
    url: 'https://vollmond.ewolution.cloud/',
    group: 'guessing',
    modes: ['teams'],
    ground: ['#2d3893', '#1f2668'],
    ink: '#f1e8d4',
    spark: '#ff4d9d',
    text: {
      de: 'Unser eigenes Werwolf: Die App erzählt, jeder hat seine geheime Karte, das Dorf sucht die Wölfe. Im Videocall oder am Tisch, beitreten mit Code, ohne Konto.',
      en: 'Our own Werewolf: the app narrates, everyone holds a secret card, the village hunts the wolves. On a call or at one table, join with a code, no account.',
    },
  },
  {
    slug: 'geoguessr',
    name: 'GeoGuessr',
    url: 'https://www.geoguessr.com/de',
    group: 'geo',
    modes: ['ffa'],
    account: true,
    ground: ['#8b95ff', '#4a4fe0'],
    ink: '#ffffff',
    spark: '#ff5a6e',
    text: {
      de: 'Irgendwo auf der Welt in Street View abgesetzt: Wo bist du? Je näher dein Tipp auf der Karte, desto mehr Punkte.',
      en: 'Dropped somewhere in Street View: where are you? The closer your pin on the map, the more points.',
    },
  },
  {
    slug: 'curvecrash',
    name: 'CurveCrash',
    url: 'https://curvecrash.com/',
    group: 'action',
    modes: ['ffa', 'teams'],
    ground: ['#c4ef6a', '#6fb51d'],
    ink: '#14260a',
    spark: '#ff3d9a',
    text: {
      de: 'Alle steuern eine Kurve, die eine Spur hinterlässt. Wer als Letztes noch nicht gecrasht ist, gewinnt. Mit Power-ups.',
      en: 'Everyone steers a curve that leaves a trail. The last one that hasn’t crashed wins. With power-ups.',
    },
  },
  {
    slug: 'haxball',
    name: 'HaxBall',
    url: 'https://www.haxball.com/',
    group: 'action',
    modes: ['teams'],
    ground: ['#5fd68a', '#1f9a4f'],
    ink: '#ffffff',
    spark: '#0f3a20',
    text: {
      de: 'Fußball von oben, mit echter Physik: ein Kreis pro Person, ein Ball, zwei Tore.',
      en: 'Football seen from above, with real physics: one circle per player, one ball, two goals.',
    },
  },
];

/** The game's address as people say it: skribbl.io, garticphone.com. */
export const host = (game: Game) => new URL(game.url).hostname.replace(/^www\./, '');

/** WCAG contrast between two #rrggbb colours. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The "Let's go" button's colour, so its label reads (4.5:1 or more). A dark-ink game keeps its
 * ground's light end; a white-ink one takes the deep end, darkened as far as it takes.
 */
export function buttonColor(game: Game): string {
  if (contrast(game.ground[0], game.ink) >= 4.5) return game.ground[0];
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(game.ground[1].slice(i, i + 2), 16));
  for (let k = 1; k > 0.3; k -= 0.02) {
    const hex = `#${[r, g, b].map((c) => Math.round(c * k).toString(16).padStart(2, '0')).join('')}`;
    if (contrast(hex, game.ink) >= 4.6) return hex;
  }
  return '#000000';
}
