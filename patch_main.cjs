const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const target = `const globalKeys = ['user_info', 'auth_token', 'custom_api_keys', 'user_access_info'];`;
const replacement = `const globalKeys = [
    'user_info', 
    'auth_token', 
    'custom_api_keys', 
    'user_access_info', 
    'app_users_db', 
    'user_thesis_projects_list'
  ];`;

code = code.replace(target, replacement);
fs.writeFileSync('src/main.tsx', code);
console.log('main.tsx patched');
