// German and English, following the browser until a language is picked in Settings. The choice
// is kept under `ewo:lang` (the landing's key; System removes it); public/boot.js applies it
// before first paint.

import { themeShift } from '../../vendor/ewo/elements/theme-shift.js';
import type { Lang } from './games';

const KEY = 'ewo:lang';

export type LangPref = 'system' | Lang;

const browser = (): Lang => (navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en');

function storedPref(): LangPref {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    // storage blocked: follow the browser
  }
  return 'system';
}

const resolve = (pref: LangPref): Lang => (pref === 'system' ? browser() : pref);

/** `pref`: the choice in Settings. `lang`: the language on screen, which follows it. */
export const i18n = $state({ pref: storedPref(), lang: resolve(storedPref()) });

function show(lang: Lang) {
  i18n.lang = lang;
  document.documentElement.lang = lang;
}

/**
 * A pick in Settings. When it changes the language on screen, the page blurs for a moment while the
 * new one comes in (Folio's themeShift, like a theme change).
 */
export function setLanguage(pref: LangPref) {
  i18n.pref = pref;
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // not kept, still applied
  }
  const next = resolve(pref);
  if (next !== i18n.lang) themeShift(() => show(next));
}

// The browser's own language changing under System applies at once.
addEventListener('languagechange', () => {
  if (i18n.pref === 'system') show(browser());
});

const STRINGS = {
  de: {
    question: 'Was spielen wir?',
    draw: 'Auslosen',
    again: 'Nochmal',
    play: 'Los geht’s',
    drawing: 'Wird ausgelost …',
    drawn: 'Ausgelost: {name}',
    kind: 'Art',
    all: 'Alle',
    creative: 'Kreativ',
    guessing: 'Raten',
    geo: 'Geo',
    action: 'Action',
    ffa: 'Jeder gegen jeden',
    teams: 'Teams',
    together: 'Zusammen',
    account: 'Konto nötig',
    games: '{n} Spiele',
    fromGames: 'aus {n} Spielen',
    newTab: 'öffnet in einem neuen Tab',
    allApps: 'Alle Apps',
    settings: 'Einstellungen',
    general: 'Allgemein',
  },
  en: {
    question: 'What are we playing?',
    draw: 'Draw one',
    again: 'Again',
    play: 'Let’s go',
    drawing: 'Drawing …',
    drawn: 'Drawn: {name}',
    kind: 'Kind',
    all: 'All',
    creative: 'Creative',
    guessing: 'Guessing',
    geo: 'Geo',
    action: 'Action',
    ffa: 'Free for all',
    teams: 'Teams',
    together: 'Together',
    account: 'Account needed',
    games: '{n} games',
    fromGames: 'from {n} games',
    newTab: 'opens in a new tab',
    allApps: 'All apps',
    settings: 'Settings',
    general: 'General',
  },
} satisfies Record<Lang, Record<string, string>>;

export type Key = keyof typeof STRINGS.en;

/** A string in the current language, with {name} placeholders filled in. */
export function t(key: Key, vars: Record<string, string | number> = {}): string {
  return STRINGS[i18n.lang][key].replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}
