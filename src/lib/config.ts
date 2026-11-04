// The games as Dashboard set them (manifest.ts), from the values the server put into the page
// (Folio's config-client): in their order, the ones turned off left out. No values (the dev server,
// or Dashboard never reached): every game, in games.ts's order.

import { configValue } from '../../vendor/ewo/elements/config-client.js';
import type { Game } from './games';

type Items = { id: string; on: boolean }[];

const isItems = (value: unknown): value is Items =>
  Array.isArray(value) && value.every((item) => typeof item?.id === 'string' && typeof item.on === 'boolean');

/**
 * The games to show. A game the values don't name keeps its place after the named ones (one added
 * since, before the server knew it), and with every game turned off the page shows them all: a
 * page with nothing to draw from helps nobody.
 */
export function shownGames(all: readonly Game[], items: Items | undefined = configValue('games', isItems)): Game[] {
  if (!items) return [...all];
  const bySlug = new Map(all.map((game) => [game.slug, game]));
  const named = new Set(items.map((item) => item.id));
  const shown = [...items.filter((item) => item.on && bySlug.has(item.id)).map((item) => bySlug.get(item.id)!), ...all.filter((game) => !named.has(game.slug))];
  return shown.length ? shown : [...all];
}
