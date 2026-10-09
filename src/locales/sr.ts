import type { DurationUnit, Locale } from '../types.js';

// Serbian, Latin script, ekavian.

type Gender = 'm' | 'f';
/** Noun forms for counts like 1 (and 21), 2-4 (and 22-24), and everything else. */
type Forms = [one: string, few: string, many: string];

const ONES = ['nula', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet', 'deset',
  'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];
const TENS = ['', '', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
const HUNDREDS = ['', 'sto', 'dvesta', 'trista', 'četiristo', 'petsto', 'šeststo', 'sedamsto', 'osamsto', 'devetsto'];

function pluralForm(n: number, [one, few, many]: Forms): string {
  const lastTwo = n % 100;
  const last = n % 10;
  if (last === 1 && lastTwo !== 11) return one;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}

function digit(n: number, gender: Gender): string {
  if (gender === 'f' && n === 1) return 'jedna';
  if (gender === 'f' && n === 2) return 'dve';
  return ONES[n];
}

function below1000(n: number, gender: Gender): string {
  const words: string[] = [];
  if (n >= 100) {
    words.push(HUNDREDS[Math.floor(n / 100)]);
    n %= 100;
  }
  if (n >= 20) {
    words.push(TENS[Math.floor(n / 10)]);
    n %= 10;
  }
  if (n > 0) words.push(n < 10 ? digit(n, gender) : ONES[n]);
  return words.join(' ');
}

// Each scale word has its own gender, and a single one is said without "one" ('hiljadu dana', not 'jedna hiljada dana').
const SCALES: { size: number; gender: Gender; single: string; forms: Forms }[] = [
  { size: 1e9, gender: 'f', single: 'milijarda', forms: ['milijarda', 'milijarde', 'milijardi'] },
  { size: 1e6, gender: 'm', single: 'milion', forms: ['milion', 'miliona', 'miliona'] },
  { size: 1e3, gender: 'f', single: 'hiljadu', forms: ['hiljada', 'hiljade', 'hiljada'] },
];

/** Spells out a whole number in Serbian, agreeing with the gender of the noun that follows. */
export function numberToWords(n: number, gender: Gender = 'm'): string {
  if (n === 0) return ONES[0];
  const words: string[] = [];
  for (const scale of SCALES) {
    const count = Math.floor(n / scale.size);
    if (count === 1) words.push(scale.single);
    else if (count > 1) words.push(`${below1000(count, scale.gender)} ${pluralForm(count, scale.forms)}`);
    n %= scale.size;
  }
  if (n > 0) words.push(below1000(n, gender));
  return words.join(' ');
}

const UNIT_WORDS: Record<DurationUnit, { gender: Gender; forms: Forms }> = {
  year: { gender: 'f', forms: ['godina', 'godine', 'godina'] },
  month: { gender: 'm', forms: ['mesec', 'meseca', 'meseci'] },
  week: { gender: 'f', forms: ['nedelja', 'nedelje', 'nedelja'] },
  day: { gender: 'm', forms: ['dan', 'dana', 'dana'] },
  hour: { gender: 'm', forms: ['sat', 'sata', 'sati'] },
  minute: { gender: 'm', forms: ['minut', 'minuta', 'minuta'] },
  second: { gender: 'f', forms: ['sekunda', 'sekunde', 'sekundi'] },
};

export const sr: Locale = {
  formatUnit(value, unit) {
    const { gender, forms } = UNIT_WORDS[unit];
    return `${numberToWords(value, gender)} ${pluralForm(value, forms)}`;
  },
  conjunction: 'i',
  zero: 'nula sekundi',
};
