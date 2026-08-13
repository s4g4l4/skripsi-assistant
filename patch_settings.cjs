const fs = require('fs');
let code = fs.readFileSync('src/pages/SettingsPage.tsx', 'utf8');

// Replace tab button
const btnTarget = `<button
              onClick={() => setActiveTab('apikeys')}
              className={\`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors \${
                activeTab === 'apikeys' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }\`}
            >
              <Key className="w-4 h-4 text-emerald-600" /> API Keys Custom (Groq / DeepSeek)
            </button>`;
const btnReplacement = `{userInfo?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('apikeys')}
              className={\`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors \${
                activeTab === 'apikeys' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }\`}
            >
              <Key className="w-4 h-4 text-emerald-600" /> API Keys
            </button>
            )}`;
code = code.replace(btnTarget, btnReplacement);

// Replace content block condition
const contentTarget = `{activeTab === 'apikeys' && (`;
const contentReplacement = `{(activeTab === 'apikeys' && userInfo?.role === 'admin') && (`;
code = code.replace(contentTarget, contentReplacement);

// Replace content block header
const headerTarget = `<Key className="w-4 h-4 text-emerald-600" /> Multi-Engine AI Integration & Custom API Keys`;
const headerReplacement = `<Key className="w-4 h-4 text-emerald-600" /> API Keys`;
code = code.replace(headerTarget, headerReplacement);

fs.writeFileSync('src/pages/SettingsPage.tsx', code);
console.log('Settings patched');
