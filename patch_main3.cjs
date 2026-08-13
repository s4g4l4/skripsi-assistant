const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `  return originalFetch(input, init);
};

// 2. LocalStorage`;
const replacement = `  return originalFetch(input, init);
  }
});

// 2. LocalStorage`;

if(code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/main.tsx', code);
  console.log('fixed syntax');
} else {
  console.log('target not found');
}
