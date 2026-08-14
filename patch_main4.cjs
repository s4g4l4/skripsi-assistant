const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `'x-user-role': userInfo.role || 'user'
        };`;
const replacement = `'x-user-role': userInfo.role || 'user'
        };
      }
    }
    const customApiKeysRaw = localStorage.getItem('custom_api_keys');
    if (customApiKeysRaw) {
      init.headers = {
        ...init.headers,
        'x-custom-api-keys': encodeURIComponent(customApiKeysRaw)
      };`;
      
code = code.replace(target, replacement);
fs.writeFileSync('src/main.tsx', code);
console.log('main.tsx patched again');
