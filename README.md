# iso-duration-to-words

Convert ISO 8601 duration strings (e.g., `P3Y6M4DT12H30M5S`) into human-readable sentences (e.g., `Three years, six months, four days, twelve hours, thirty minutes and five seconds`) in English, Serbian, German, Spanish, Italian or French.

No dependencies. Works with both `import` and `require`, and ships TypeScript types.

## 📦 Installation

```bash
npm install iso-duration-to-words
```

## 🚀 Usage

```ts
import { isoDurationToWords } from 'iso-duration-to-words';

isoDurationToWords('P3Y6D');
// Three years and six days

isoDurationToWords('P3Y6D', { locale: 'sr' });
// Tri godine i šest dana
```

CommonJS works too:

```js
const { isoDurationToWords } = require('iso-duration-to-words');
```

## 🌍 Languages

Pass a language code as `locale`. English is the default. Full tags such as `en-US` or `sr-Latn-RS` fall back to their language.

| Code | Language | `P1Y2M21DT1H` |
| --- | --- | --- |
| `en` | English | One year, two months, twenty-one days and one hour |
| `sr` | Serbian (Latin) | Jedna godina, dva meseca, dvadeset jedan dan i jedan sat |
| `de` | German | Ein Jahr, zwei Monate, einundzwanzig Tage und eine Stunde |
| `es` | Spanish | Un año, dos meses, veintiún días y una hora |
| `it` | Italian | Un anno, due mesi, ventun giorni e un'ora |
| `fr` | French | Un an, deux mois, vingt et un jours et une heure |

Each language spells numbers its own way, with the right grammatical gender and plural form for every unit (`dva dana`, `dve godine`, `pet godina`).

### Custom locales

To support another language, or a different style, pass your own locale object:

```ts
import { isoDurationToWords, Locale } from 'iso-duration-to-words';

const short: Locale = {
  formatUnit: (value, unit) => `${value}${unit[0]}`, // unit is 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
  conjunction: '+',
  zero: '0s',
};

isoDurationToWords('P3DT4H', { locale: short });
// 3d + 4h
```

The built-in locales are exported as `en`, `sr`, `de`, `es`, `it` and `fr`, and all of them as `locales`.

## 📏 Behavior

- Units with a value of zero are left out: `P1Y0M2D` gives `One year and two days`.
- A duration where every unit is zero gives `Zero duration` (or the locale's equivalent, such as `Nula sekundi`).
- Values up to 999,999,999,999 (`MAX_VALUE`) are spelled out. Larger values throw a `RangeError`.
- Input that is not a valid ISO 8601 duration throws `Invalid ISO 8601 duration format`. This includes `P` and `PT` with no units, and a trailing `T` such as `P1DT`. Fractions (`PT1.5S`) and negative durations are not supported.
- An unknown locale code throws `Unsupported locale "xx"`.

## ⬆️ Upgrading from 1.x

- `P` and `PT` now throw instead of returning `Zero duration`.
- Zero units are left out instead of written as `zero month`.
- English numbers are hyphenated and use the international scale: `twenty-one`, `one hundred twenty`, `one hundred thousand` (1.x gave `twenty one`, `one hundred and twenty`, `one lakh`).
- The `num-words` dependency is gone.

## 🧪 Testing

```bash
npm install
npm test
```

## 📄 License

MIT
