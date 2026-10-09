# iso-duration-to-words

Convert ISO 8601 duration strings (e.g., `P3Y6M4DT12H30M5S`) into human-readable sentences (e.g., `Three years, six months, four days, twelve hours, thirty minutes and five seconds`).

## 📦 Installation

```bash
npm install iso-duration-to-words
```

## 🚀 Usage

```ts
import { isoDurationToWords } from 'iso-duration-to-words';

console.log(isoDurationToWords('P3Y6D')); 
// Output: Three years and six days
```

CommonJS works too:

```js
const { isoDurationToWords } = require('iso-duration-to-words');
```

### Behavior

- Units with a value of zero are left out: `P1Y0M2D` gives `One year and two days`.
- A duration where every unit is zero gives `Zero duration`.
- Input that is not a valid ISO 8601 duration throws `Invalid ISO 8601 duration format`. This includes `P` and `PT` with no units, and a trailing `T` such as `P1DT`.

## 🧪 Testing

```bash
npm install
npm test
```

## 📄 License

MIT
