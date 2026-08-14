const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `// Setup __dirname for both ESM and CJS
let __dirname_poly;
if (typeof __dirname !== 'undefined') {
  __dirname_poly = __dirname;
} else {
  const __filename_poly = fileURLToPath(import.meta.url);
  __dirname_poly = path.dirname(__filename_poly);
}`;

code = code.replace(target, '');
fs.writeFileSync('server.ts', code);
console.log('Removed unused polyfill');
