const fs = require('fs');
let code = fs.readFileSync('src/pages/CollaborationPage.tsx', 'utf8');
const target = `<button
                    type="button"
                    onClick={handleSendWhatsApp}`;
const replacement = `<button type="button" onClick={() => window.open(\`mailto:?subject=Permohonan Review Skripsi&body=Yth. Dosen Pembimbing,%0D%0A%0D%0ABerikut adalah link akses naskah skripsi saya:%0D%0A\${getPublicReviewUrl()}%0D%0A%0D%0ATerima kasih.\`)} className="w-full py-2.5 px-3 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-500/40 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow">
                    <Mail className="w-4 h-4 text-indigo-400" /> Bagikan via Email (Aplikasi Mail)
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}`;
code = code.replace(target, replacement);
fs.writeFileSync('src/pages/CollaborationPage.tsx', code);
