<script lang="ts">
  import { GROUPS, type Game, type Group } from '../lib/games';
  import { t } from '../lib/i18n.svelte';
  import GameCard from './GameCard.svelte';

  let {
    games,
    filter,
    chosen,
    onfilter,
  }: { games: Game[]; filter: Group | 'all'; chosen: Game | null; onfilter: (filter: Group | 'all') => void } = $props();

  const options = $derived([{ value: 'all', label: t('all') }, ...GROUPS.map((g) => ({ value: g, label: t(g) }))]);
</script>

<section class="games" aria-label={t('games', { n: games.length })}>
  <div class="tools">
    <ewo-segmented size="sm" label={t('kind')} value={filter} {options} onchange={(e) => onfilter(e.detail.value as Group | 'all')}></ewo-segmented>
    <span class="count">{t('games', { n: games.length })}</span>
  </div>

  <ul class="grid">
    {#each games as game (game.slug)}
      <li><GameCard {game} chosen={chosen?.slug === game.slug} /></li>
    {/each}
  </ul>
</section>

<style>
  .tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }
  .count {
    font: 500 var(--ewo-text-2xs) / 1 var(--ewo-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .grid > li {
    display: grid;
  }
  @media (max-width: 760px) {
    .grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }
  }
</style>
