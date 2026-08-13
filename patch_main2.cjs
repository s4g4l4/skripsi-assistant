const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `const originalFetch = window.fetch;
window.fetch = async (input, init = {}) => {`;
const replacement = `const originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: async (input: RequestInfo | URL, init: RequestInit = {}) => {`;

if(code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/main.tsx', code);
  console.log('fetch interceptor patched');
} else {
  console.log('target not found');
}
