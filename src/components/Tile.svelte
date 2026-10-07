<script lang="ts">
  import { GLYPHS } from '../lib/glyphs';

  /** A game's tile: its colour as the ground, its mark on top (the app icons' Field style). */
  let {
    slug,
    ground,
    ink,
    spark,
    size = 52,
  }: { slug: string; ground: [string, string]; ink: string; spark: string; size?: number } = $props();

  // Fixed strings from glyphs.ts, never anything a visitor typed.
  const markup = $derived(`<svg viewBox="0 0 64 64" aria-hidden="true">${GLYPHS[slug] ?? GLYPHS.unknown}</svg>`);
</script>

<span class="tile" style:--g1={ground[0]} style:--g2={ground[1]} style:--ink={ink} style:--spark={spark} style:--size="{size}px">
  {@html markup}
</span>

<style>
  .tile {
    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: var(--size);
    height: var(--size);
    overflow: hidden;
    border-radius: calc(var(--size) * 0.24);
    background: linear-gradient(162deg, var(--g1), var(--g2));
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.28),
      0 1px 2px rgb(0 0 0 / 0.18);
  }
  /* The Field set's soft sheen from the top. */
  .tile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(90% 70% at 50% -10%, rgb(255 255 255 / 0.22), transparent 70%);
  }
  .tile :global(svg) {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .tile :global(.i) {
    fill: none;
    stroke: var(--ink);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  /* A solid shape in the ink, for a mark drawn as a silhouette (Vollmond's wolf). */
  .tile :global(.s) {
    fill: var(--ink);
    stroke: var(--ink);
    stroke-width: 1;
    stroke-linejoin: round;
  }
  .tile :global(.k) {
    fill: var(--spark);
  }
</style>
