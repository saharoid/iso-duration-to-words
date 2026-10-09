import { isoDurationToWords, Locale, MAX_VALUE } from '../src';

const cases: Record<string, [string, string][]> = {
  en: [
    ['P1Y2M3DT4H5M6S', 'One year, two months, three days, four hours, five minutes and six seconds'],
    ['P21D', 'Twenty-one days'],
    ['PT103H', 'One hundred three hours'],
    ['PT1234567S', 'One million two hundred thirty-four thousand five hundred sixty-seven seconds'],
    ['P100000D', 'One hundred thousand days'],
    ['P0D', 'Zero duration'],
  ],
  sr: [
    ['P1Y2M3DT4H5M6S', 'Jedna godina, dva meseca, tri dana, četiri sata, pet minuta i šest sekundi'],
    ['P21D', 'Dvadeset jedan dan'],
    ['P22Y', 'Dvadeset dve godine'],
    ['P12Y', 'Dvanaest godina'],
    ['P5M', 'Pet meseci'],
    ['P1000D', 'Hiljadu dana'],
    ['P2000W', 'Dve hiljade nedelja'],
    ['P21000D', 'Dvadeset jedna hiljada dana'],
    ['PT2000000H', 'Dva miliona sati'],
    ['P0D', 'Nula sekundi'],
  ],
  de: [
    ['P1Y2M3DT4H5M6S', 'Ein Jahr, zwei Monate, drei Tage, vier Stunden, fünf Minuten und sechs Sekunden'],
    ['P1W', 'Eine Woche'],
    ['P21D', 'Einundzwanzig Tage'],
    ['P21000D', 'Einundzwanzigtausend Tage'],
    ['PT1234567S', 'Eine Million zweihundertvierunddreißigtausendfünfhundertsiebenundsechzig Sekunden'],
    ['PT2000000H', 'Zwei Millionen Stunden'],
    ['P0D', 'Null Sekunden'],
  ],
  es: [
    ['P1Y2M3DT4H5M6S', 'Un año, dos meses, tres días, cuatro horas, cinco minutos y seis segundos'],
    ['P1W', 'Una semana'],
    ['P21D', 'Veintiún días'],
    ['PT21H', 'Veintiuna horas'],
    ['P100Y', 'Cien años'],
    ['P101D', 'Ciento un días'],
    ['PT200000H', 'Doscientas mil horas'],
    ['P1000000D', 'Un millón de días'],
    ['PT1000500S', 'Un millón quinientos segundos'],
    ['P0D', 'Cero segundos'],
  ],
  it: [
    ['P1Y2M3DT4H5M6S', 'Un anno, due mesi, tre giorni, quattro ore, cinque minuti e sei secondi'],
    ['PT1H', "Un'ora"],
    ['P1W', 'Una settimana'],
    ['P21D', 'Ventun giorni'],
    ['P23D', 'Ventitré giorni'],
    ['P38Y', 'Trentotto anni'],
    ['P101D', 'Centouno giorni'],
    ['P280Y', 'Duecentottanta anni'],
    ['P2000W', 'Duemila settimane'],
    ['PT2000000H', 'Due milioni di ore'],
    ['P0D', 'Zero secondi'],
  ],
  fr: [
    ['P1Y2M3DT4H5M6S', 'Un an, deux mois, trois jours, quatre heures, cinq minutes et six secondes'],
    ['PT1H', 'Une heure'],
    ['P21D', 'Vingt et un jours'],
    ['PT21H', 'Vingt et une heures'],
    ['P71D', 'Soixante et onze jours'],
    ['P80D', 'Quatre-vingts jours'],
    ['P81Y', 'Quatre-vingt-un ans'],
    ['P200D', 'Deux cents jours'],
    ['P80000D', 'Quatre-vingt mille jours'],
    ['PT2000000H', "Deux millions d'heures"],
    ['P0D', 'Zéro seconde'],
  ],
};

describe.each(Object.entries(cases))('locale %s', (locale, table) => {
  it.each(table)('%s', (input, expected) => {
    expect(isoDurationToWords(input, { locale })).toBe(expected);
  });
});

describe('locale option', () => {
  it('defaults to English', () => {
    expect(isoDurationToWords('P3Y6D')).toBe('Three years and six days');
  });

  it('accepts full language tags', () => {
    expect(isoDurationToWords('P2D', { locale: 'sr-Latn-RS' })).toBe('Dva dana');
    expect(isoDurationToWords('P2D', { locale: 'en-US' })).toBe('Two days');
    expect(isoDurationToWords('P2D', { locale: 'FR' })).toBe('Deux jours');
  });

  it('throws on an unsupported locale', () => {
    expect(() => isoDurationToWords('P2D', { locale: 'xx' })).toThrow('Unsupported locale "xx"');
  });

  it('accepts a custom locale', () => {
    const shorthand: Locale = {
      formatUnit: (value, unit) => `${value}${unit[0]}`,
      conjunction: '+',
      zero: '0s',
    };
    expect(isoDurationToWords('P3DT4H', { locale: shorthand })).toBe('3d + 4h');
    expect(isoDurationToWords('PT0S', { locale: shorthand })).toBe('0s');
  });
});

describe('large values', () => {
  it('spells out the largest supported value', () => {
    expect(isoDurationToWords(`P${MAX_VALUE}D`)).toBe(
      'Nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine days'
    );
  });

  it('throws a RangeError above it', () => {
    expect(() => isoDurationToWords(`P${MAX_VALUE + 1}D`)).toThrow(RangeError);
  });
});
