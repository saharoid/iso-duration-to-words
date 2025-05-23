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

## 🧪 Testing

```bash
npm install
npm test
```

## 📄 License

MIT
