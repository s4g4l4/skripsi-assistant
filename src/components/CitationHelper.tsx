import React, { useState } from 'react';
import { 
  Book, Search, Plus, Copy, CheckCircle2, Wand2, Download, ExternalLink, Sparkles
} from 'lucide-react';

export default function CitationHelper() {
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState('APA 7th Edition');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [citations, setCitations] = useState([
    {
      authors: 'Sugiyono',
      year: '2019',
      title: 'Metode Penelitian Kuantitatif, Kualitatif, dan R&D',
      publisher: 'Alfabeta',
      city: 'Bandung',
      inText: '(Sugiyono, 2019, hlm. 85)',
      fullRef: 'Sugiyono. (2019). Metode Penelitian Kuantitatif, Kualitatif, dan R&D. Bandung: Alfabeta.'
    },
    {
      authors: 'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E.',
      year: '2019',
      title: 'Multivariate Data Analysis (8th ed.)',
      publisher: 'Cengage Learning',
      city: 'London',
      inText: '(Hair et al., 2019)',
      fullRef: 'Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2019). Multivariate Data Analysis (8th ed.). London: Cengage Learning.'
    },
    {
      authors: 'Venkatesh, V., Thong, J. Y., & Xu, X.',
      year: '2012',
      title: 'Consumer acceptance and use of information technology: extending the unified theory of acceptance and use of technology',
      publisher: 'MIS Quarterly',
      vol: '36(1)',
      pages: '157-178',
      inText: '(Venkatesh et al., 2012)',
      fullRef: 'Venkatesh, V., Thong, J. Y., & Xu, X. (2012). Consumer acceptance and use of information technology: extending the unified theory of acceptance and use of technology. MIS Quarterly, 36(1), 157-178.'
    }
  ]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Citation Helper</h3>
            <p className="text-xs text-slate-400">Pembuat Sitasi & Daftar Pustaka Otomatis (APA 7th, IEEE, Harvard)</p>
          </div>
        </div>

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="APA 7th Edition">Gaya Sitasi: APA 7th Edition</option>
          <option value="IEEE">Gaya Sitasi: IEEE</option>
          <option value="Harvard">Gaya Sitasi: Harvard</option>
          <option value="MLA 9th Edition">Gaya Sitasi: MLA 9th</option>
          <option value="Chicago">Gaya Sitasi: Chicago</option>
        </select>
      </div>

      {/* Citation Cards List */}
      <div className="space-y-3">
        {citations.map((item, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Gaya: {style}</span>
                <p className="text-sm font-semibold text-slate-200 leading-snug">{item.fullRef}</p>
              </div>

              <button
                onClick={() => handleCopy(item.fullRef, idx)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-800 transition-colors shrink-0 flex items-center gap-1"
              >
                {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedIndex === idx ? 'Tersalin' : 'Kutip'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 font-medium">Kutipan Dalam Teks (In-text Citation):</span>
              <code className="text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.inText}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
