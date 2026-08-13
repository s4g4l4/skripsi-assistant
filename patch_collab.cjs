const fs = require('fs');
let code = fs.readFileSync('src/pages/CollaborationPage.tsx', 'utf8');

const target = `const [projectId] = useState('proj-demo-1');`;
const replacement = `const [projectId] = useState(() => {
    const userInfoRaw = localStorage.getItem('user_info');
    let emailStr = 'guest';
    if (userInfoRaw) {
      try {
        const parsed = JSON.parse(userInfoRaw);
        if (parsed.role === 'admin') return 'proj-demo-1_admin';
        emailStr = parsed.email || 'guest';
      } catch (e) {}
    }
    return 'proj-demo-1_' + emailStr;
  });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/CollaborationPage.tsx', code);
console.log('Collaboration patched');
