<script lang="ts">
  import { onMount } from 'svelte';
  import { GAMES, type Game, type Group } from './lib/games';
  import { loadCensus } from './lib/census';
  import Field from './components/Field.svelte';
  import Bar from './components/Bar.svelte';
  import Picker from './components/Picker.svelte';
  import Games from './components/Games.svelte';
  import Footer from './components/Footer.svelte';

  // The filter starts at "all" on every visit: the page is the overview, and a filter left on
  // from yesterday would hide most of it.
  let filter: Group | 'all' = $state('all');
  // Raw: the games are plain constants, and a deep proxy would break comparing them.
  let chosen: Game | null = $state.raw(null);
  const pool = $derived(filter === 'all' ? GAMES : GAMES.filter((g) => g.group === filter));

  onMount(loadCensus);
</script>

<Field />
<Bar />

<main>
  <Picker {pool} bind:chosen />
  <Games games={pool} {filter} {chosen} onfilter={(next) => (filter = next)} />
</main>

<Footer />
