import { locales } from './locales/index.js';
import type { DurationUnit, Locale, Options } from './types.js';

export type { DurationUnit, Locale, Options } from './types.js';
export { locales, en, sr, de, es, it, fr } from './locales/index.js';

/** Largest count any built-in locale can spell out. */
export const MAX_VALUE = 999_999_999_999;

const UNITS: DurationUnit[] = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

/**
 * Converts an ISO-8601 duration string to a human-readable sentence.
 * Example: 'P3Y6D' => 'Three years and six days'
 * Example: isoDurationToWords('P3Y6D', { locale: 'sr' }) => 'Tri godine i šest dana'
 */
export function isoDurationToWords(duration: string, options: Options = {}): string {
  const regex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const match = duration.match(regex);

  // ISO 8601 requires at least one component, and a 'T' must be followed by one.
  if (!match || duration === 'P' || duration.endsWith('T')) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const locale = resolveLocale(options.locale);

  const parts = UNITS
    .map((unit, i) => ({ unit, value: match[i + 1] }))
    .filter(({ value }) => value !== undefined && Number(value) !== 0)
    .map(({ unit, value }) => {
      const n = Number(value);
      if (n > MAX_VALUE) throw new RangeError(`Value ${value} is too large to spell out`);
      return locale.formatUnit(n, unit);
    });

  if (parts.length === 0) return capitalize(locale.zero);
  if (parts.length === 1) return capitalize(parts[0]);

  const last = parts.pop();
  return capitalize(`${parts.join(', ')} ${locale.conjunction} ${last}`);
}

function resolveLocale(locale: string | Locale = 'en'): Locale {
  if (typeof locale !== 'string') return locale;

  // Accept full tags such as 'en-US' or 'sr-Latn-RS' by falling back to the language.
  const code = locale.toLowerCase();
  const found = locales[code] ?? locales[code.split('-')[0]];
  if (!found) throw new Error(`Unsupported locale "${locale}"`);
  return found;
}

// Helper to capitalize only the first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
