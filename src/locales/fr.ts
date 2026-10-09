import type { DurationUnit, Locale } from '../types.js';

type Gender = 'm' | 'f';

const BELOW_17 = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

function below20(n: number): string {
  return n < 17 ? BELOW_17[n] : `dix-${BELOW_17[n - 10]}`;
}

/**
 * Traditional spelling: hyphens below one hundred, 'et' for 21-71.
 * `final` is false when 'mille' follows, which drops the plural 's' of 'quatre-vingts' and 'cents'.
 */
function below1000(n: number, final: boolean): string {
  const words: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 1) words.push('cent');
  else if (hundreds > 1) words.push(`${BELOW_17[hundreds]} ${rest === 0 && final ? 'cents' : 'cent'}`);

  if (rest === 0) {
    // nothing to add
  } else if (rest < 20) {
    words.push(below20(rest));
  } else if (rest < 70) {
    const ones = rest % 10;
    const tens = TENS[Math.floor(rest / 10)];
    words.push(ones === 0 ? tens : ones === 1 ? `${tens} et un` : `${tens}-${BELOW_17[ones]}`);
  } else if (rest < 80) {
    words.push(rest === 71 ? 'soixante et onze' : `soixante-${below20(rest - 60)}`);
  } else if (rest === 80) {
    words.push(final ? 'quatre-vingts' : 'quatre-vingt');
  } else {
    words.push(`quatre-vingt-${below20(rest - 80)}`);
  }
  return words.join(' ');
}

function belowMillion(n: number): string {
  const words: string[] = [];
  const thousands = Math.floor(n / 1000);
  if (thousands === 1) words.push('mille');
  else if (thousands > 1) words.push(`${below1000(thousands, false)} mille`);
  if (n % 1000) words.push(below1000(n % 1000, true));
  return words.join(' ');
}

const SCALES: [number, string, string][] = [[1e9, 'milliard', 'milliards'], [1e6, 'million', 'millions']];

/** Spells out a whole number in French, as it is said before a noun of the given gender. */
export function numberToWords(n: number, gender: Gender = 'm'): string {
  if (n === 0) return BELOW_17[0];
  const words: string[] = [];
  for (const [size, one, many] of SCALES) {
    const count = Math.floor(n / size);
    // Million and milliard are nouns, so 'quatre-vingts millions' keeps its 's'.
    if (count > 0) words.push(`${below1000(count, true)} ${count === 1 ? one : many}`);
    n %= size;
  }
  if (n > 0) words.push(belowMillion(n));
  // A round number of millions takes 'de' before the noun: 'deux millions de jours'.
  else words.push('de');
  const result = words.join(' ');
  return gender === 'f' ? result.replace(/\bun$/, 'une') : result;
}

const UNIT_WORDS: Record<DurationUnit, { gender: Gender; one: string; many: string }> = {
  year: { gender: 'm', one: 'an', many: 'ans' },
  month: { gender: 'm', one: 'mois', many: 'mois' },
  week: { gender: 'f', one: 'semaine', many: 'semaines' },
  day: { gender: 'm', one: 'jour', many: 'jours' },
  hour: { gender: 'f', one: 'heure', many: 'heures' },
  minute: { gender: 'f', one: 'minute', many: 'minutes' },
  second: { gender: 'f', one: 'seconde', many: 'secondes' },
};

export const fr: Locale = {
  formatUnit(value, unit) {
    const { gender, one, many } = UNIT_WORDS[unit];
    const words = numberToWords(value, gender);
    const noun = value === 1 ? one : many;
    // 'de' elides before a vowel or a silent h: 'deux millions d'heures'.
    if (words.endsWith(' de') && /^[aeiouh]/.test(noun)) return `${words.slice(0, -2)}d'${noun}`;
    return `${words} ${noun}`;
  },
  conjunction: 'et',
  zero: 'zéro seconde',
};
