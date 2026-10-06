<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../lib/i18n.svelte';

  let scrolled = $state(false);
  onMount(() => {
    const check = () => (scrolled = scrollY > 8);
    check();
    addEventListener('scroll', check, { passive: true });
    return () => removeEventListener('scroll', check);
  });

  function top(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<header class="bar" class:scrolled>
  <a class="mark" href="/" onclick={top} aria-label="Aale Spiele">
    <img src="/icon.svg" alt="" width="28" height="28" />
    <span class="word"><span class="aale">Aale</span> Spiele</span>
  </a>
  <ewo-theme-toggle label-light={t('toLight')} label-dark={t('toDark')}></ewo-theme-toggle>
</header>

<style>
  .bar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    height: var(--bar-h);
    padding: 0 var(--gutter);
    background: color-mix(in oklab, var(--ewo-bg) 92%, transparent);
    border-bottom: 1px solid transparent;
  }
  .bar.scrolled {
    border-bottom-color: var(--ewo-line-2);
  }

  .mark {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    white-space: nowrap;
  }
  img {
    display: block;
    border-radius: 8px;
  }
  .word {
    font: 600 17px/1 var(--ewo-sans);
    letter-spacing: -0.01em;
  }
  .aale {
    font: italic 500 21px/1 var(--ewo-serif);
    /* Fraunces ships upright only (as on the landing); its italic is the browser's slant. */
    font-synthesis: style;
  }
  /* The eel wriggles once when you point at it. */
  @media (hover: hover) {
    .mark:hover img {
      animation: wriggle 0.6s var(--ewo-ease);
    }
  }
  @keyframes wriggle {
    25% {
      transform: rotate(-9deg);
    }
    55% {
      transform: rotate(7deg);
    }
    80% {
      transform: rotate(-3deg);
    }
  }
</style>
