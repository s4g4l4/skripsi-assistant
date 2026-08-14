const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `'x-user-role': userInfo.role || 'user'
        };
      }
    }
    const customApiKeysRaw = localStorage.getItem('custom_api_keys');
    if (customApiKeysRaw) {
      init.headers = {
        ...init.headers,
        'x-custom-api-keys': encodeURIComponent(customApiKeysRaw)
      };
  } catch (e) {
    console.error('Error parsing user_info for fetch interceptor', e);
  }`;
const replacement = `'x-user-role': userInfo.role || 'user'
        };
      }
    }
    const customApiKeysRaw = localStorage.getItem('custom_api_keys');
    if (customApiKeysRaw) {
      init.headers = {
        ...init.headers,
        'x-custom-api-keys': encodeURIComponent(customApiKeysRaw)
      };
    }
  } catch (e) {
    console.error('Error parsing user_info for fetch interceptor', e);
  }`;
code = code.replace(target, replacement);
fs.writeFileSync('src/main.tsx', code);
