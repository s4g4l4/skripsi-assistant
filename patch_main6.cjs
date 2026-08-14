const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `    const customApiKeysRaw = localStorage.getItem('custom_api_keys');
    if (customApiKeysRaw) {
      init.headers = {
        ...init.headers,
        'x-custom-api-keys': encodeURIComponent(customApiKeysRaw)
      };
      }
    }
  } catch (e) {`;
  
const replacement = `    const customApiKeysRaw = localStorage.getItem('custom_api_keys');
    if (customApiKeysRaw) {
      init.headers = {
        ...init.headers,
        'x-custom-api-keys': encodeURIComponent(customApiKeysRaw)
      };
    }
  } catch (e) {`;

code = code.replace(target, replacement);
fs.writeFileSync('src/main.tsx', code);
console.log('Fixed syntax');
