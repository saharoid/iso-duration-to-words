import type { DurationUnit, Locale } from '../types.js';

type Gender = 'm' | 'f';

const ONES = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
  'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

function below1000(n: number): string {
  let words = '';
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    words += `${hundreds === 1 ? '' : ONES[hundreds]}cento`;
    n %= 100;
    // 'cento' drops its 'o' before 'otto' and 'ottanta': centotto, duecentottanta.
    if (n === 8 || (n >= 80 && n < 90)) words = words.slice(0, -1);
  }
  if (n >= 20) {
    const ones = n % 10;
    let tens = TENS[Math.floor(n / 10)];
    // The tens lose their final vowel before 'uno' and 'otto': ventuno, trentotto.
    if (ones === 1 || ones === 8) tens = tens.slice(0, -1);
    words += tens + (ones ? ONES[ones] : '');
  } else if (n > 0) {
    words += ONES[n];
  }
  return words;
}

/** Everything below a million is written as one word: 'duemilatrecentoquarantacinque'. */
function belowMillion(n: number): string {
  const thousands = Math.floor(n / 1000);
  const head = thousands === 0 ? '' : thousands === 1 ? 'mille' : `${below1000(thousands)}mila`;
  return head + below1000(n % 1000);
}

/** 'uno' at the end of a tens compound shortens before a masculine noun: 'ventun giorni', but 'centouno giorni'. */
const shortenUno = (words: string) => words.replace(/([^aeiou])uno$/, '$1un');

const SCALES: [number, string, string][] = [[1e9, 'miliardo', 'miliardi'], [1e6, 'milione', 'milioni']];

/** Spells out a whole number in Italian as it is said on its own: 23 => 'ventitré'. */
export function numberToWords(n: number): string {
  if (n === 0) return ONES[0];
  const words: string[] = [];
  for (const [size, one, many] of SCALES) {
    const count = Math.floor(n / size);
    if (count === 1) words.push(`un ${one}`);
    else if (count > 1) words.push(`${shortenUno(below1000(count))} ${many}`);
    n %= size;
  }
  if (n > 0) words.push(belowMillion(n));
  // A compound ending in 'tre' takes an accent: ventitré, centotré.
  return words.join(' ').replace(/(\S)tre$/, '$1tré');
}

const UNIT_WORDS: Record<DurationUnit, { gender: Gender; one: string; many: string }> = {
  year: { gender: 'm', one: 'anno', many: 'anni' },
  month: { gender: 'm', one: 'mese', many: 'mesi' },
  week: { gender: 'f', one: 'settimana', many: 'settimane' },
  day: { gender: 'm', one: 'giorno', many: 'giorni' },
  hour: { gender: 'f', one: 'ora', many: 'ore' },
  minute: { gender: 'm', one: 'minuto', many: 'minuti' },
  second: { gender: 'm', one: 'secondo', many: 'secondi' },
};

export const it: Locale = {
  formatUnit(value, unit) {
    const { gender, one, many } = UNIT_WORDS[unit];
    if (value === 1) {
      if (gender === 'm') return `un ${one}`;
      return /^[aeiou]/.test(one) ? `un'${one}` : `una ${one}`;
    }
    let words = numberToWords(value);
    if (gender === 'm') words = shortenUno(words);
    // A round number of millions takes 'di' before the noun: 'due milioni di giorni'.
    if (value >= 1e6 && value % 1e6 === 0) words += ' di';
    return `${words} ${many}`;
  },
  conjunction: 'e',
  zero: 'zero secondi',
};
