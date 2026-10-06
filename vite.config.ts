import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-expect-error plain ESM module shared with the production server
import { createCensus } from './server/census.mjs';

// The same Census forwarder the production server uses (with no target it counts nothing), so
// dev and prod answer /_e.js and /_e alike.
function census(): Plugin {
  const handle = createCensus({ site: 'aale-spiele' });
  const middleware = async (req: any, res: any, next: (error?: unknown) => void) => {
    try {
      if (await handle(req, res)) return;
      next();
    } catch (error) {
      next(error);
    }
  };
  return {
    name: 'aale-spiele-census',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}

export default defineConfig({
  plugins: [svelte(), census()],
  // 5600 is the NAS port; locally Libretto's dev server holds it (its Spotify redirect URI).
  server: { port: 5620, strictPort: true },
  preview: { port: 5621, strictPort: true },
  build: {
    target: 'es2022',
    // Browsers with native light-dark(): the default target makes Lightning CSS resolve the
    // tokens once at :root (Folio's finding), and the page relies on them following the theme.
    cssTarget: ['chrome123', 'safari17.5', 'firefox120'],
  },
});
