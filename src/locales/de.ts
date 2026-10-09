import type { DurationUnit, Locale } from '../types.js';

type Gender = 'm' | 'f' | 'n';

const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
  'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

/** 'eins' loses its 's' when something follows it: 'einundzwanzig', 'eintausend', 'hundertein Tage'. */
const dropS = (words: string) => words.replace(/eins$/, 'ein');

function below1000(n: number): string {
  let words = '';
  if (n >= 100) {
    words += `${dropS(ONES[Math.floor(n / 100)])}hundert`;
    n %= 100;
  }
  if (n >= 20) {
    const ones = n % 10;
    words += (ones ? `${dropS(ONES[ones])}und` : '') + TENS[Math.floor(n / 10)];
  } else if (n > 0) {
    words += ONES[n];
  }
  return words;
}

const SCALES: [number, string, string][] = [[1e9, 'Milliarde', 'Milliarden'], [1e6, 'Million', 'Millionen']];

/** Spells out a whole number in German as it is said on its own: 21 => 'einundzwanzig', 1 => 'eins'. */
export function numberToWords(n: number): string {
  if (n === 0) return ONES[0];
  const words: string[] = [];
  for (const [size, one, many] of SCALES) {
    const count = Math.floor(n / size);
    // Million and Milliarde are feminine nouns: 'eine Million', 'einundzwanzig Millionen'.
    if (count > 0) words.push(`${below1000(count).replace(/eins$/, 'eine')} ${count === 1 ? one : many}`);
    n %= size;
  }
  // Everything below a million is written as one word.
  let rest = '';
  if (n >= 1000) {
    rest += `${dropS(below1000(Math.floor(n / 1000)))}tausend`;
    n %= 1000;
  }
  rest += below1000(n);
  if (rest) words.push(rest);
  return words.join(' ');
}

const UNIT_WORDS: Record<DurationUnit, { gender: Gender; one: string; many: string }> = {
  year: { gender: 'n', one: 'Jahr', many: 'Jahre' },
  month: { gender: 'm', one: 'Monat', many: 'Monate' },
  week: { gender: 'f', one: 'Woche', many: 'Wochen' },
  day: { gender: 'm', one: 'Tag', many: 'Tage' },
  hour: { gender: 'f', one: 'Stunde', many: 'Stunden' },
  minute: { gender: 'f', one: 'Minute', many: 'Minuten' },
  second: { gender: 'f', one: 'Sekunde', many: 'Sekunden' },
};

export const de: Locale = {
  formatUnit(value, unit) {
    const { gender, one, many } = UNIT_WORDS[unit];
    if (value === 1) return `${gender === 'f' ? 'eine' : 'ein'} ${one}`;
    return `${dropS(numberToWords(value))} ${many}`;
  },
  conjunction: 'und',
  zero: 'null Sekunden',
};
