// German and English, following the browser until the switch in the footer is used. The choice
// is kept under `ewo:lang` (the landing's key); public/boot.js applies it before first paint.

import type { Lang } from './games';

const KEY = 'ewo:lang';

function initial(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    // storage blocked: follow the browser
  }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export const i18n = $state({ lang: initial() });

export function setLang(lang: Lang) {
  i18n.lang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // not kept, still applied
  }
}

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
    language: 'Sprache',
    toLight: 'Helles Design',
    toDark: 'Dunkles Design',
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
    language: 'Language',
    toLight: 'Light theme',
    toDark: 'Dark theme',
  },
} satisfies Record<Lang, Record<string, string>>;

export type Key = keyof typeof STRINGS.en;

/** A string in the current language, with {name} placeholders filled in. */
export function t(key: Key, vars: Record<string, string | number> = {}): string {
  return STRINGS[i18n.lang][key].replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}
