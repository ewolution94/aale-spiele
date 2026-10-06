# Aale Spiele

The games our afternoon meeting plays, on one page, and a button that picks one. Live at
[aale-spiele.ewolution.cloud](https://aale-spiele.ewolution.cloud).

- **"Was spielen wir?"** The draw spins a reel through the games like a slot machine and lands on
  one; a ring in that game's colours runs out through the dot field behind the page. "Let's go"
  opens the game in a new tab, "Again" draws a different one (never the same twice in a row).
- **All ten games at a glance:** skribbl.io, Gartic Phone, Codenames, Travle, Impromptu, Songlio,
  Guess the Price, GeoGuessr, CurveCrash and HaxBall, in the order the team listed them. Each card
  says in a sentence how the game plays, what kind it is, and whether it's every player for
  themselves, teams, or everyone together. GeoGuessr is marked as needing an account.
- **Filter by kind:** Creative, Guessing, Geo, Action. The draw only picks from what the filter
  shows. It starts at "All" on every visit.
- **Each game has a tile** drawn like the ewolution app icons (the Field set): the game's colour as
  the ground, one mark, and one dot. They're our drawings, not the games' logos.
- **German and English**, following the browser until you switch in the footer; light and dark
  follow the system until you use the toggle.
- **Installs to a home screen** and works offline: the games ship with the page.

## How it works

There's no API and no state. `src/lib/games.ts` is the list; `src/lib/pick.ts` draws a game and
builds the reel's strip (pure functions, tested). The server serves the built page, forwards Census's
beacon, and nothing else.

- **The reel** is one row tall. A draw fills it with a strip of about 20 games that starts at
  whatever the window shows and ends on the winner, and slides it with the Web Animations API (a
  transform only, so it runs on the compositor), overshooting a little and settling back.
- **The background** is Atrium's dot field (`src/lib/field.ts`): it draws only while the pointer
  moves or a ripple runs, never on scroll, and ignores touch moves.
- **The "Let's go" button** takes the game's colour, darkened until its label has 4.5:1 contrast
  (`buttonColor()`, checked for every game in the tests).
- **Visit counts** go to [Census](https://github.com/ewolution94/census), the self-hosted counter on
  the NAS: no cookies, nothing stored on the device. `server/census.mjs` forwards `/_e.js` and `/_e`
  to it over the shared Docker network, adding only `X-Site: aale-spiele`. Without
  `AALE_SPIELE_CENSUS` (local runs) the forwarder answers with an empty beacon and counts nothing.

## Run it

```bash
npm install
npm run dev          # http://localhost:5620 (5600 is the NAS port)
npm run check        # svelte-check / TypeScript
npm test             # unit tests: the games, the draw, the Census forwarder (Node 24+)
npm run build && npm start   # production server on :8080 (or --port 5621)
```

## Deploy (NAS)

This mirrors Cantina and Atrium:

- `ci.yml` runs the typecheck, the tests and the build, then smoke-tests the production server.
- `docker-publish.yml` gates on `ci.yml`, then pushes `ghcr.io/ewolution94/aale-spiele:latest` for
  amd64 and arm64.
- The shared Watchtower picks the image up. With this setup, a push to `release` is the whole deploy.
- The NAS runs `deploy/portainer-stack.yml`, on port **5600**.
- The stack joins the external Docker network `ewolution`, where Census listens as `census:4901`.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` / `--port` | `8080` | Listen port |
| `HOST` | `0.0.0.0` | Listen address |
| `AALE_SPIELE_CENSUS` | off | Census's ingest origin, `http://census:4901` on the NAS |

## Project layout

```
server/server.mjs         static files + security headers, no dependencies
server/census.mjs         forwards /_e.js and /_e to Census (visit counts)
src/lib/games.ts          the games: links, texts (DE/EN), kinds, tile colours
src/lib/pick.ts           the draw and the reel's strip
src/lib/glyphs.ts         each game's mark (64-unit SVG)
src/lib/field.ts          the dot field and the draw's ripple
src/components/           Picker (the draw), Games + GameCard, Tile, Bar, Footer
public/sw.js              offline shell
brand/                    the eel mark and app icons (public/icons/ is rendered from them)
vendor/ewo/               Folio's tokens, fonts and elements (npm run vendor -- aale-spiele in Folio)
```
