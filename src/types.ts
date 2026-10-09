export type DurationUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

/**
 * Everything a language needs to turn a duration into words.
 * Built-in locales live in `src/locales`; pass your own object to support another language.
 */
export interface Locale {
  /** Spells out a count together with its unit, e.g. (3, 'day') => 'three days'. */
  formatUnit(value: number, unit: DurationUnit): string;
  /** Joins the last two parts, e.g. 'and'. */
  conjunction: string;
  /** Returned when every unit in the duration is zero. */
  zero: string;
}

export interface Options {
  /** A built-in locale code ('en', 'sr', 'de', 'es', 'it', 'fr') or a custom Locale. Defaults to 'en'. */
  locale?: string | Locale;
}
