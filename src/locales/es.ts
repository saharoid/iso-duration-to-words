import type { DurationUnit, Locale } from '../types.js';

type Gender = 'm' | 'f';

const BELOW_30 = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
  'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos',
  'setecientos', 'ochocientos', 'novecientos'];

/** A number before a noun agrees with it: 'un día', 'veintiún días', 'una hora', 'doscientas horas'. */
function agree(words: string, gender: Gender): string {
  if (gender === 'f') return words.replace(/ientos/g, 'ientas').replace(/uno$/, 'una');
  return words.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
}

function below1000(n: number, gender: Gender): string {
  if (n === 100) return 'cien';
  const words: string[] = [];
  if (n >= 100) {
    words.push(HUNDREDS[Math.floor(n / 100)]);
    n %= 100;
  }
  if (n >= 30) words.push(TENS[Math.floor(n / 10)] + (n % 10 ? ` y ${BELOW_30[n % 10]}` : ''));
  else if (n > 0) words.push(BELOW_30[n]);
  return agree(words.join(' '), gender);
}

function belowMillion(n: number, gender: Gender): string {
  const words: string[] = [];
  const thousands = Math.floor(n / 1000);
  if (thousands === 1) words.push('mil');
  else if (thousands > 1) words.push(`${below1000(thousands, gender)} mil`);
  if (n % 1000) words.push(below1000(n % 1000, gender));
  return words.join(' ');
}

/** Spells out a whole number in Spanish, as it is said before a noun of the given gender. */
export function numberToWords(n: number, gender: Gender = 'm'): string {
  if (n === 0) return BELOW_30[0];
  if (n < 1e6) return belowMillion(n, gender);

  // Millón is a masculine noun; Spanish counts in millions up to a billion ('mil millones').
  const millions = Math.floor(n / 1e6);
  const rest = n % 1e6;
  const head = millions === 1 ? 'un millón' : `${belowMillion(millions, 'm')} millones`;
  // A round number of millions takes 'de' before the noun: 'dos millones de días'.
  return rest ? `${head} ${belowMillion(rest, gender)}` : `${head} de`;
}

const UNIT_WORDS: Record<DurationUnit, { gender: Gender; one: string; many: string }> = {
  year: { gender: 'm', one: 'año', many: 'años' },
  month: { gender: 'm', one: 'mes', many: 'meses' },
  week: { gender: 'f', one: 'semana', many: 'semanas' },
  day: { gender: 'm', one: 'día', many: 'días' },
  hour: { gender: 'f', one: 'hora', many: 'horas' },
  minute: { gender: 'm', one: 'minuto', many: 'minutos' },
  second: { gender: 'm', one: 'segundo', many: 'segundos' },
};

export const es: Locale = {
  formatUnit(value, unit) {
    const { gender, one, many } = UNIT_WORDS[unit];
    return `${numberToWords(value, gender)} ${value === 1 ? one : many}`;
  },
  conjunction: 'y',
  zero: 'cero segundos',
};
