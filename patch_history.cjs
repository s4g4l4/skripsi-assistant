const fs = require('fs');
let code = fs.readFileSync('src/pages/HistoryPage.tsx', 'utf8');

// 1. Clear DEFAULT_HISTORY_ITEMS
code = code.replace(/const DEFAULT_HISTORY_ITEMS: HistoryItem\[\] = \[[\s\S]*?\];/, 'const DEFAULT_HISTORY_ITEMS: HistoryItem[] = [];');

// 2. Add isAdmin to getUserProjects
code = code.replace(/const userProjects = getUserProjects\(\);/, 
`const userInfoRaw = localStorage.getItem('user_info');
  const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
  const isAdmin = userInfo?.role === 'admin';
  const userProjects = getUserProjects(userInfo?.email, isAdmin);`);

fs.writeFileSync('src/pages/HistoryPage.tsx', code);
console.log('History patched');
