<script lang="ts">
  import { tick } from 'svelte';
  import { buttonColor, host, type Game } from '../lib/games';
  import { pick, strip } from '../lib/pick';
  import { ripple } from '../lib/field';
  import { i18n, t } from '../lib/i18n.svelte';
  import Tile from './Tile.svelte';

  /** `pool`: the games the filter shows, the draw picks from these. `chosen`: the last draw. */
  let { pool, chosen = $bindable(null) }: { pool: Game[]; chosen: Game | null } = $props();

  /** The app's own tile for "nothing drawn yet": the eel's pink and the yellow ball. */
  const IDLE = { slug: 'unknown', ground: ['#ff62c2', '#d0168a'] as [string, string], ink: '#ffffff', spark: '#ffe14d' };

  /** What the reel holds: one row at rest, the whole strip while it spins. null is the idle row. */
  let rows: (Game | null)[] = $state.raw([null]);
  let spinning = $state(false);
  let track: HTMLElement;
  let windowEl: HTMLElement;

  async function draw() {
    if (spinning || !pool.length) return;
    const previous = chosen ? pool.findIndex((g) => g.slug === chosen!.slug) : -1;
    const target = pick(pool.length, previous);
    const winner = pool[target];

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows = [winner];
      chosen = winner;
      return;
    }

    spinning = true;
    // The strip starts with whatever the window shows now, so the spin doesn't jump.
    const seq = strip(pool.length, target, 16 + Math.floor(Math.random() * 5), previous).map((i) => pool[i]);
    rows = previous >= 0 ? seq : [chosen, ...seq];
    await tick();

    // A row is --row tall (smaller on a phone).
    const end = (rows.length - 1) * (track.firstElementChild as HTMLElement).offsetHeight;
    const spin = track.animate(
      [
        { transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.18, 0.62, 0.28, 1)' },
        // A slot machine's settle: just past the winner, then back onto it.
        { transform: `translate3d(0, ${-end - 14}px, 0)`, offset: 0.88, easing: 'cubic-bezier(0.45, 0, 0.4, 1)' },
        { transform: `translate3d(0, ${-end}px, 0)` },
      ],
      { duration: 2100, fill: 'forwards' },
    );
    try {
      await spin.finished;
    } catch {
      // cancelled: settle on the winner all the same
    }
    rows = [winner];
    await tick();
    spin.cancel();
    chosen = winner;
    spinning = false;

    const box = windowEl.getBoundingClientRect();
    ripple(box.left + box.width / 2, box.top + box.height / 2, [winner.ground[0], winner.spark, winner.ground[1]]);
  }
</script>

<section class="picker" style:--glow={chosen ? chosen.ground[0] : null} aria-labelledby="question">
  <div class="glow" aria-hidden="true"></div>
  <h1 id="question" class="sr-only">{t('question')}</h1>

  <div class="window" class:spinning bind:this={windowEl}>
    <div class="track" bind:this={track}>
      {#each rows as game, i (i)}
        <div class="row">
          {#if game}
            <Tile slug={game.slug} ground={game.ground} ink={game.ink} spark={game.spark} size={60} />
            <span class="name">
              <span class="title">{game.name}</span>
              <span class="host">{host(game)}</span>
            </span>
          {:else}
            <Tile {...IDLE} size={60} />
            <span class="name"><span class="title ask">{t('question')}</span></span>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <p class="text" class:hidden={spinning || !chosen}>{chosen ? chosen.text[i18n.lang] : ''}</p>

  <div class="actions">
    {#if chosen}
      <a
        class="play"
        class:hidden={spinning}
        href={chosen.url}
        target="_blank"
        rel="noopener"
        style:--button={buttonColor(chosen)}
        style:--ink={chosen.ink}
        aria-label="{t('play')}: {chosen.name}, {t('newTab')}"
      >
        {t('play')} <span aria-hidden="true">↗</span>
      </a>
      <button class="again" onclick={draw} disabled={spinning}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.6-3.7" /><path d="M11.8 1.8v2.7H9.1" /></svg>
        {t('again')}
      </button>
    {:else}
      <button class="go" onclick={draw} disabled={spinning}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.8" y="1.8" width="12.4" height="12.4" rx="3.2" /><circle cx="5.3" cy="5.3" r="1.15" /><circle cx="8" cy="8" r="1.15" /><circle cx="10.7" cy="10.7" r="1.15" /></svg>
        {t('draw')}
      </button>
    {/if}
  </div>

  <p class="from">{t('fromGames', { n: pool.length })}</p>
  <p class="sr-only" aria-live="polite">{spinning ? t('drawing') : chosen ? t('drawn', { name: chosen.name }) : ''}</p>
</section>

<style>
  .picker {
    --row: 84px;
    --glow: var(--ewo-accent);
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0 28px;
    padding: 34px 20px 22px;
    border-radius: var(--ewo-r-xl);
    background: var(--surface);
    border: 1px solid var(--ewo-line-2);
    box-shadow: var(--ewo-highlight);
    text-align: center;
  }
  .glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    /* Half as strong on a light page (light-dark() takes colours, not percentages). */
    background:
      radial-gradient(
        70% 90% at 50% 0%,
        light-dark(color-mix(in oklab, var(--glow) 11%, transparent), color-mix(in oklab, var(--glow) 22%, transparent)),
        transparent 70%
      ),
      radial-gradient(
        40% 60% at 50% 100%,
        light-dark(color-mix(in oklab, var(--glow) 5%, transparent), color-mix(in oklab, var(--glow) 10%, transparent)),
        transparent 70%
      );
    transition: background 0.6s;
  }

  .window {
    width: min(100%, 460px);
    height: var(--row);
    overflow: hidden;
  }
  .window.spinning {
    mask-image: linear-gradient(transparent, #000 22%, #000 78%, transparent);
  }
  .track {
    will-change: transform;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    height: var(--row);
  }
  .name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
    text-align: left;
  }
  .title {
    font: 650 clamp(24px, 6.4vw, 32px) / 1.05 var(--ewo-sans);
    letter-spacing: -0.025em;
    white-space: nowrap;
  }
  .title.ask {
    font: italic 500 clamp(24px, 6.6vw, 36px) / 1.08 var(--ewo-serif);
    font-synthesis: style;
    letter-spacing: -0.01em;
    white-space: normal;
    text-wrap: balance;
  }
  .host {
    font: 500 var(--ewo-text-xs) / 1 var(--ewo-mono);
    color: var(--ewo-fg-3);
  }

  .text {
    max-width: 46ch;
    min-height: 3em;
    margin: 14px 0 0;
    color: var(--ewo-fg-2);
    font-size: var(--ewo-text-md);
    line-height: 1.5;
    text-wrap: pretty;
    transition: opacity 0.3s;
  }
  .text:empty {
    min-height: 0;
  }
  .hidden {
    opacity: 0;
    transition: none;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
  }
  .actions > * {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 46px;
    padding: 0 22px;
    border-radius: var(--ewo-r-pill);
    font: 600 15px/1 var(--ewo-sans);
    text-decoration: none;
    border: 0;
  }
  .go {
    background: var(--ewo-accent);
    color: var(--ewo-accent-ink);
    box-shadow: 0 6px 22px -8px light-dark(color-mix(in oklab, var(--ewo-accent) 50%, transparent), color-mix(in oklab, var(--ewo-accent) 80%, transparent));
  }
  .play {
    background: var(--button);
    color: var(--ink);
    box-shadow: 0 6px 22px -8px light-dark(color-mix(in oklab, var(--button) 50%, transparent), color-mix(in oklab, var(--button) 80%, transparent));
    transition: opacity 0.3s;
  }
  .again {
    background: var(--ewo-fill);
    color: var(--ewo-fg);
    box-shadow: inset 0 0 0 1px var(--ewo-line);
  }
  /* Hover grows and shrinks, nothing else (learnings: restrained hover). */
  @media (hover: hover) {
    .actions > :hover:not(:disabled) {
      transform: scale(1.04);
      transition: transform 0.25s var(--ewo-ease);
    }
  }
  .actions > :active:not(:disabled) {
    transform: scale(0.97);
  }
  button:disabled {
    cursor: default;
  }
  svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .go circle {
    fill: currentColor;
    stroke: none;
  }

  .from {
    margin: 14px 0 0;
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }

  @media (max-width: 520px) {
    .picker {
      --row: 76px;
      margin-top: 12px;
      padding: 26px 16px 18px;
    }
    .row {
      gap: 13px;
    }
  }
</style>
