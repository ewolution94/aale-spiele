<script lang="ts">
  import { host, type Game } from '../lib/games';
  import { tintField } from '../lib/field';
  import { i18n, t } from '../lib/i18n.svelte';
  import Tile from './Tile.svelte';

  let { game, chosen = false }: { game: Game; chosen?: boolean } = $props();
</script>

<a
  class="card"
  class:chosen
  href={game.url}
  target="_blank"
  rel="noopener"
  style:--g1={game.ground[0]}
  style:--g2={game.ground[1]}
  onpointerenter={() => tintField(game.ground[0])}
  onpointerleave={() => tintField(null)}
>
  <span class="glow" aria-hidden="true"></span>
  <span class="tile"><Tile slug={game.slug} ground={game.ground} ink={game.ink} spark={game.spark} size={52} /></span>
  <span class="body">
    <span class="head">
      <span class="name">{game.name}</span>
      <span class="host">{host(game)}</span>
      <span class="arrow" aria-hidden="true">↗</span>
      <span class="sr-only">({t('newTab')})</span>
    </span>
    <span class="text">{game.text[i18n.lang]}</span>
    <span class="chips">
      <span class="chip">{t(game.group)}</span>
      {#each game.modes as mode (mode)}
        <span class="chip">{t(mode)}</span>
      {/each}
      {#if game.account}
        <span class="chip note">{t('account')}</span>
      {/if}
    </span>
  </span>
</a>

<style>
  .card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
    padding: 18px 18px 16px;
    border-radius: var(--ewo-r-lg);
    background: var(--surface);
    border: 1px solid var(--ewo-line-2);
    box-shadow: var(--ewo-highlight);
    text-decoration: none;
  }
  .glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    /* Half as strong on a light page (light-dark() takes colours, not percentages). */
    background: radial-gradient(
      90% 120% at 0% 0%,
      light-dark(color-mix(in oklab, var(--g1) 10%, transparent), color-mix(in oklab, var(--g1) 20%, transparent)),
      transparent 65%
    );
  }
  /* Transitions live in :hover only, so leaving is instant (nothing animates as cards scroll by). */
  @media (hover: hover) {
    .card:hover {
      transform: translateY(-3px);
      transition: transform 0.35s var(--ewo-ease);
    }
    .card:hover .glow {
      opacity: 1;
      transition: opacity 0.35s;
    }
    .card:hover .tile {
      transform: scale(1.06) rotate(-3deg);
      transition: transform 0.35s var(--ewo-ease-spring);
    }
    .card:hover .arrow {
      opacity: 1;
      transform: translate(2px, -2px);
      transition:
        opacity 0.25s,
        transform 0.25s var(--ewo-ease);
    }
  }
  .card:focus-visible {
    outline: var(--ewo-focus);
    outline-offset: 3px;
  }
  /* The game the draw landed on. */
  .card.chosen {
    border-color: color-mix(in oklab, var(--g1) 70%, transparent);
    box-shadow:
      0 0 0 1px color-mix(in oklab, var(--g1) 70%, transparent),
      var(--ewo-highlight);
  }
  .card.chosen .glow {
    opacity: 1;
  }

  .tile {
    display: block;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    min-width: 0;
  }
  .name {
    font-weight: 650;
    font-size: 17px;
    letter-spacing: -0.015em;
    white-space: nowrap;
  }
  .host {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    color: var(--ewo-fg-3);
  }
  .arrow {
    color: var(--ewo-fg-3);
    opacity: 0.7;
  }
  .text {
    color: var(--ewo-fg-2);
    font-size: var(--ewo-text-md);
    line-height: 1.5;
    text-wrap: pretty;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .chip {
    padding: 4px 8px;
    border-radius: var(--ewo-r-pill);
    border: 1px solid var(--ewo-line);
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.04em;
    color: var(--ewo-fg-2);
  }
  .chip.note {
    border-style: dashed;
  }

  @media (max-width: 520px) {
    .card {
      gap: 14px;
      padding: 16px 16px 14px;
    }
    .tile :global(.tile) {
      --size: 44px !important;
    }
  }
</style>
