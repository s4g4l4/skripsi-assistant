import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, ExternalLink, Download, Copy, CheckCircle2, 
  Sparkles, Filter, FileText, ChevronDown, ChevronUp, X, 
  Award, Globe, ShieldCheck, BookmarkCheck, ArrowRight, Loader2,
  Database, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  searchEuropePmc, 
  cleanAbstract, 
  convertEuropePmcToSource, 
  formatQuickCitation,
  EuropePmcArticle 
} from '../services/europePmcService';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onImportToCitationManager?: (source: any) => void;
  initialQuery?: string;
  isEmbedded?: boolean;
}

const PRESET_QUERIES = [
  'Artificial Intelligence Healthcare',
  'Machine Learning Prediction',
  'Diabetes Mellitus Prevention',
  'Stunting Children Nutrition',
  'Renewable Energy Solar',
  'Cybersecurity IoT Systems',
  'Educational Technology Higher Education'
];

export const EuropePmcSearchModal: React.FC<Props> = ({
  isOpen = true,
  onClose,
  onImportToCitationManager,
  initialQuery = '',
  isEmbedded = false
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<EuropePmcArticle[]>([]);
  const [hitCount, setHitCount] = useState<number>(0);
  const [isReranked, setIsReranked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
  const [openAccessOnly, setOpenAccessOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'cited' | 'date'>('relevance');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<'APA' | 'IEEE' | 'Harvard' | 'BibTeX'>('APA');

  // Trigger search
  const handleSearch = async (searchTerm?: string) => {
    const term = searchTerm !== undefined ? searchTerm : query;
    if (!term.trim()) return;

    setIsLoading(true);
    try {
      const result = await searchEuropePmc(term, {
        pageSize: 15,
        openAccessOnly,
        sortBy,
        synonym: true,
        unifiedMultiSource: true
      });
      setArticles(result.articles);
      setHitCount(result.hitCount);
      setIsReranked(Boolean(result.reranked));
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    } else if (articles.length === 0) {
      // Load initial curated search
      handleSearch('Artificial Intelligence in Higher Education');
    }
  }, [initialQuery]);

  const handleCopyCitation = (article: EuropePmcArticle) => {
    const citation = formatQuickCitation(article, selectedStyle);
    navigator.clipboard.writeText(citation);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleImport = (article: EuropePmcArticle) => {
    const source = convertEuropePmcToSource(article);
    
    // Save to local storage for persistent Citation Manager access
    try {
      const existingSourcesRaw = localStorage.getItem('user_saved_citations');
      let existingSources = existingSourcesRaw ? JSON.parse(existingSourcesRaw) : [];
      if (!existingSources.some((s: any) => s.id === source.id)) {
        existingSources = [source, ...existingSources];
        localStorage.setItem('user_saved_citations', JSON.stringify(existingSources));
      }
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    if (onImportToCitationManager) {
      onImportToCitationManager(source);
    }

    setImportedIds(prev => [...prev, article.id]);
  };

  const content = (
    <div className={`flex flex-col ${isEmbedded ? 'w-full' : 'max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100'}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white tracking-tight">Academic Multi-Source Explorer</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                Europe PMC • PubMed • OpenAlex • Tavily
              </span>
              {isReranked && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Cohere Rerank v3.5
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Pencarian langsung literatur ilmiah, jurnal medis NCBI, indeks sains data OpenAlex, dan grounding riset Tavily.
            </p>
          </div>
        </div>

        {!isEmbedded && onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/90 space-y-4 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kata kunci, topik penelitian, judul artikel, atau nama penulis (e.g. Deep Learning in Healthcare)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium shadow-inner"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value as any;
                setSortBy(val);
                setTimeout(() => handleSearch(), 50);
              }}
              className="bg-slate-950 border border-slate-700/80 text-xs font-bold text-slate-200 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="relevance">Urutkan: Relevansi AI</option>
              <option value="cited">Urutkan: Paling Banyak Disitasi</option>
              <option value="date">Urutkan: Terbitan Terbaru</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cari Literatur</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Filter Badges & Style Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl font-bold text-slate-300 transition-colors">
              <input 
                type="checkbox" 
                checked={openAccessOnly}
                onChange={(e) => {
                  setOpenAccessOnly(e.target.checked);
                  setTimeout(() => handleSearch(), 50);
                }}
                className="w-3.5 h-3.5 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
              />
              <span className="text-emerald-400">🔓 Hanya Open Access (Gratis Full Text)</span>
            </label>

            <span className="text-slate-500 font-semibold hidden md:inline">|</span>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-0.5">
              <span className="text-slate-400 font-bold shrink-0">Preset Topik:</span>
              {PRESET_QUERIES.slice(0, 4).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(preset);
                    handleSearch(preset);
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition-colors shrink-0"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Format Sitasi:</span>
            <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
              {(['APA', 'IEEE', 'Harvard', 'BibTeX'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${selectedStyle === style ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900">
        
        {/* Total found info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
          <span>
            Ditemukan <strong className="text-emerald-400">{hitCount.toLocaleString()}</strong> artikel terindeks multi-basis data
          </span>
          <span className="text-[11px] text-slate-400">
            Terhubung ke: Europe PMC • PubMed • OpenAlex • Tavily AI
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-bold text-slate-300">Menghubungkan ke basis data sains global...</p>
            <p className="text-xs text-slate-500 max-w-sm">Mengambil metadata artikel ilmiah, daftar penulis, abstrak, dan tautan PDF resmi.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">Tidak ada artikel yang ditemukan</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Coba gunakan kata kunci bahasa Inggris atau istilah ilmiah yang lebih umum (contoh: <em>Machine Learning, Health Informatics, Solar Energy</em>).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => {
              const isExpanded = expandedAbstractId === article.id;
              const isCopied = copiedId === article.id;
              const isImported = importedIds.includes(article.id);
              const journalTitle = article.journalTitle || article.journalInfo?.journal?.title || `${article.source || 'Europe PMC'} Archive`;
              const pdfUrl = article.fullTextUrlList?.fullTextUrl?.find(u => u.documentStyle === 'pdf')?.url || article.fullTextUrlList?.fullTextUrl?.[0]?.url;
              const doiUrl = article.doi ? `https://doi.org/${article.doi}` : (article.fullTextUrlList?.fullTextUrl?.[0]?.url || `https://europepmc.org/article/${article.source}/${article.id}`);

              return (
                <div 
                  key={article.id}
                  className="bg-slate-950 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-5 transition-all space-y-3 shadow-md"
                >
                  {/* Top Badges & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-black rounded-md uppercase">
                        {article.source === 'PubMed' ? 'PubMed NCBI' : article.source === 'OpenAlex' ? 'OpenAlex Global' : article.source === 'Tavily' ? 'Tavily Research' : article.source === 'PPR' ? 'Preprint' : 'Peer-Reviewed'}
                      </span>

                      {article.isOpenAccess === 'Y' && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold rounded-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> OPEN ACCESS
                        </span>
                      )}

                      {typeof article.citedByCount === 'number' && article.citedByCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold rounded-md flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" /> {article.citedByCount} Sitasi
                        </span>
                      )}

                      {typeof article.relevanceScore === 'number' && (
                        <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold rounded-md">
                          Skor AI: {Math.round(article.relevanceScore * 100)}%
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-mono">
                        {article.pubYear || article.journalInfo?.yearOfPublication || 'Terbaru'}
                      </span>
                    </div>

                    <a 
                      href={doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold transition-colors"
                    >
                      <span>Buka Sumber Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-base font-extrabold text-white leading-snug hover:text-emerald-300 transition-colors">
                    <a href={doiUrl} target="_blank" rel="noopener noreferrer">
                      {article.title?.replace(/\.$/, '')}
                    </a>
                  </h3>

                  {/* Authors & Publication Source */}
                  <div className="text-xs space-y-1">
                    <p className="text-slate-300 font-semibold">
                      <span className="text-slate-400">Penulis:</span> {article.authorString || 'Penulis Akademik'}
                    </p>
                    <p className="text-emerald-400/90 font-bold">
                      <span className="text-slate-400 font-normal">Jurnal / Penerbit:</span> {journalTitle} 
                      {article.journalInfo?.volume ? ` (Vol. ${article.journalInfo.volume})` : ''}
                    </p>
                  </div>

                  {/* Abstract Preview */}
                  {article.abstractText && (
                    <div className="pt-1">
                      <div className={`text-xs text-slate-400 leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {cleanAbstract(article.abstractText)}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedAbstractId(isExpanded ? null : article.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 mt-1 transition-colors"
                      >
                        {isExpanded ? (
                          <><span>Tutup Abstrak</span><ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <><span>Baca Abstrak Lengkap</span><ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Bottom Action Toolbar */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-400" />
                          <span>Unduh PDF / Fulltext</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyCitation(article)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin ({selectedStyle})!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Salin Sitasi ({selectedStyle})</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImport(article)}
                      className={`px-4 py-1.5 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
                        isImported 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                      }`}
                    >
                      {isImported ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tersimpan di Library</span>
                        </>
                      ) : (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>+ Tambah ke Citation Manager</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Footer info */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400 shrink-0 flex items-center justify-between px-6 flex-wrap gap-2">
        <span>Didukung oleh <strong>Europe PMC, PubMed NCBI, OpenAlex, & Tavily AI</strong></span>
        <span className="text-emerald-400 font-semibold">Integrasi Multi-Key Aktif • Real-time Data Sync</span>
      </div>

    </div>
  );

  if (isEmbedded) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-5xl"
      >
        {content}
      </motion.div>
    </div>
  );
};
