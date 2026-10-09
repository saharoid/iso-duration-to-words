// Marks each build folder with its module format, so Node treats
// dist/esm as ES modules and dist/cjs as CommonJS regardless of the root package.json.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
fs.writeFileSync(path.join(dist, 'esm', 'package.json'), JSON.stringify({ type: 'module' }) + '\n');
fs.writeFileSync(path.join(dist, 'cjs', 'package.json'), JSON.stringify({ type: 'commonjs' }) + '\n');
