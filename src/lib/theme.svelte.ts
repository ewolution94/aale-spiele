// The theme choice in Settings, on Folio's `ewo:theme` contract (setTheme sets data-theme, the
// stored key and theme-color, and fires `ewo-theme`, which the field redraws on). A pick that
// changes the colours on screen blurs the page for a moment while they change (themeShift).

import { effectiveTheme } from '../../vendor/ewo/elements/base.js';
import { setTheme, storedTheme, type ThemeChoice } from '../../vendor/ewo/elements/theme-toggle.js';
import { themeShift } from '../../vendor/ewo/elements/theme-shift.js';

export const look = $state({ theme: storedTheme() });

const resolve = (choice: ThemeChoice) =>
  choice === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : choice;

export function pickTheme(choice: ThemeChoice) {
  look.theme = choice;
  if (resolve(choice) !== effectiveTheme()) themeShift(() => setTheme(choice));
  else setTheme(choice);
}
