import type { DurationUnit, Locale } from '../types.js';

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES: [number, string][] = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];

function below1000(n: number): string {
  const words: string[] = [];
  if (n >= 100) {
    words.push(`${ONES[Math.floor(n / 100)]} hundred`);
    n %= 100;
  }
  if (n >= 20) {
    words.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  } else if (n > 0) {
    words.push(ONES[n]);
  }
  return words.join(' ');
}

/** Spells out a whole number in US English: 121 => 'one hundred twenty-one'. */
export function numberToWords(n: number): string {
  if (n === 0) return ONES[0];
  const words: string[] = [];
  for (const [size, name] of SCALES) {
    if (n >= size) {
      words.push(`${below1000(Math.floor(n / size))} ${name}`);
      n %= size;
    }
  }
  if (n > 0) words.push(below1000(n));
  return words.join(' ');
}

const UNIT_WORDS: Record<DurationUnit, [string, string]> = {
  year: ['year', 'years'],
  month: ['month', 'months'],
  week: ['week', 'weeks'],
  day: ['day', 'days'],
  hour: ['hour', 'hours'],
  minute: ['minute', 'minutes'],
  second: ['second', 'seconds'],
};

export const en: Locale = {
  formatUnit(value, unit) {
    const [one, many] = UNIT_WORDS[unit];
    return `${numberToWords(value)} ${value === 1 ? one : many}`;
  },
  conjunction: 'and',
  zero: 'zero duration',
};
