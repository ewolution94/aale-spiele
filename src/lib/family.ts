// What Aale Spiele hands the rest of the family, built from the list itself at build time
// (vite.config.ts writes both into dist/), so a new game in games.ts reaches them with its next
// deploy:
//
// - `manifest`: what it takes from Dashboard (dashboard.ewolution.cloud, plans/dashboard.md in the
//   workspace), the games on and off and in order, and the family's language and theme for a
//   device that hasn't picked (src/lib/defaults.ts). The server announces dist/ewo.config.json.
//   Every value starts empty: until something is set there, the page shows every game in
//   games.ts's order and follows the browser's language and the system's theme, exactly as it ships.
// - `tiles`: every game as Atrium's tile draws it. The server answers /games.json with the ones
//   Dashboard leaves on, in its order.
//
// Type imports only: Node runs this file in the tests without a bundler.

import type { Game, Group } from './games';

/** The kinds as the filter names them (i18n.svelte.ts), shown beside each game in Dashboard. */
const KIND: Record<Group, { en: string; de: string }> = {
  creative: { en: 'Creative', de: 'Kreativ' },
  guessing: { en: 'Guessing', de: 'Raten' },
  geo: { en: 'Geo', de: 'Geo' },
  action: { en: 'Action', de: 'Action' },
};

export function manifest(games: readonly Game[]) {
  return {
    app: 'aale-spiele',
    version: 1,
    settings: {
      games: {
        type: 'items',
        group: { en: 'Games', de: 'Spiele' },
        label: { en: 'Games', de: 'Spiele' },
        help: {
          en: 'On and off for the list and the draw, in the page’s order. Atrium’s tile shows the same list.',
          de: 'An und aus für die Liste und die Ziehung, in der Reihenfolge der Seite. Die Kachel in Atrium zeigt dieselbe Liste.',
        },
        ids: games.map((game) => ({ id: game.slug, label: game.name, hint: KIND[game.group] })),
        fields: {
          on: { type: 'bool', default: true, label: { en: 'In the list and the draw', de: 'In der Liste und der Ziehung' } },
        },
      },
      lang: { family: true },
      theme: { family: true },
    },
  };
}

export interface Tile {
  slug: string;
  name: string;
  host: string;
  ground: [string, string];
  ink: string;
  spark: string;
  /** The mark's SVG elements on the 64-unit canvas (glyphs.ts): `.i` in ink, `.k` in spark, `.s` solid ink. */
  mark: string;
}

/** Every game with its drawing, in games.ts's order. `host` as games.ts's `host()` says it. */
export function tiles(games: readonly Game[], glyphs: Record<string, string>): Tile[] {
  return games.map((game) => ({
    slug: game.slug,
    name: game.name,
    host: new URL(game.url).hostname.replace(/^www\./, ''),
    ground: game.ground,
    ink: game.ink,
    spark: game.spark,
    mark: glyphs[game.slug],
  }));
}
