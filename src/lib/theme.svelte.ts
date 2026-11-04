// The theme choice in Settings, on Folio's `ewo:theme` contract (setTheme sets data-theme, the
// stored key and theme-color, and fires `ewo-theme`, which the field redraws on). A pick that
// changes the colours on screen blurs the page for a moment while they change (themeShift).
// Default is Dashboard's theme (#ewo-config), else the system's (src/lib/defaults.ts); public/boot.js
// applies the same before first paint.

import { effectiveTheme } from '../../vendor/ewo/elements/base.js';
import { readConfig } from '../../vendor/ewo/elements/config-client.js';
import { setTheme, storedTheme, type ThemeChoice } from '../../vendor/ewo/elements/theme-toggle.js';
import { themeShift } from '../../vendor/ewo/elements/theme-shift.js';
import { themeFor } from './defaults';

export const look = $state({ theme: storedTheme() });

/** The pick, with Default standing for Dashboard's theme: light, dark, or `system`. */
const chosen = (choice: ThemeChoice): ThemeChoice => themeFor(choice, readConfig().theme);

const resolve = (choice: ThemeChoice) => {
  const picked = chosen(choice);
  return picked === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : picked;
};

/** Default with a theme from Dashboard shows it without keeping it as this device's choice. */
function apply(choice: ThemeChoice) {
  const picked = chosen(choice);
  setTheme(picked);
  if (picked !== choice) {
    try {
      localStorage.removeItem('ewo:theme');
    } catch {
      // storage blocked: nothing was kept
    }
  }
}

export function pickTheme(choice: ThemeChoice) {
  look.theme = choice;
  if (resolve(choice) !== effectiveTheme()) themeShift(() => apply(choice));
  else apply(choice);
}
