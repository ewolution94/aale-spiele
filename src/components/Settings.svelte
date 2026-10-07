<script lang="ts">
  // Settings, the same way as in every ewolution app (development/plans/settings-alignment.md):
  // Folio's sheet and a General section starting with Language and Theme (Folio's shared rows,
  // which bring their own words).
  import { i18n, setLanguage, t } from '../lib/i18n.svelte';
  import { look, pickTheme } from '../lib/theme.svelte';

  let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<ewo-sheet {open} label={t('settings')} oncancel={() => (open = false)} onclose={() => (open = false)}>
  <span slot="heading">{t('settings')}</span>
  <section>
    <h3 class="label">{t('general')}</h3>
    <ewo-settings-basics
      language={i18n.pref}
      theme={look.theme}
      onlanguage-change={(event) => setLanguage(event.detail.value)}
      ontheme-change={(event) => pickTheme(event.detail.value)}
    ></ewo-settings-basics>
  </section>
</ewo-sheet>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0 8px;
  }
  .label {
    margin: 0;
    font: 500 11px/1.2 var(--ewo-mono);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ewo-fg-3);
  }
</style>
