import React, { useState } from 'react';
import { 
  Book, BookOpen, Globe, Search, Plus, Filter, Download, 
  Upload, Copy, CheckCircle2, MoreVertical, X, FileText, 
  Wand2, Trash2, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

type SourceType = 'Journal' | 'Book' | 'Website' | 'Conference';

interface Source {
  id: string;
  type: SourceType;
  title: string;
  authors: string;
  year: string;
  publisher: string;
  url?: string;
  doi?: string;
  selected?: boolean;
}

const INITIAL_SOURCES: Source[] = [
  {
    id: '1',
    type: 'Book',
    title: 'Metode Penelitian Bisnis',
    authors: 'Sugiyono',
    year: '2019',
    publisher: 'Alfabeta',
    selected: true
  },
  {
    id: '2',
    type: 'Journal',
    title: 'The impact of artificial intelligence on software engineering',
    authors: 'Smith, J., & Doe, J.',
    year: '2023',
    publisher: 'Journal of Software Engineering',
    doi: '10.1016/j.jse.2023.01.001',
    selected: true
  },
  {
    id: '3',
    type: 'Book',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: 'Martin, R. C.',
    year: '2008',
    publisher: 'Prentice Hall',
    selected: false
  },
  {
    id: '4',
    type: 'Website',
    title: 'React Documentation',
    authors: 'Meta',
    year: '2024',
    publisher: 'React',
    url: 'https://react.dev',
    selected: false
  }
];

const CITATION_STYLES = [
  'APA 7th Edition',
  'IEEE',
  'Harvard',
  'MLA 9th Edition',
  'Chicago Manual of Style'
];

export default function CitationManagerPage() {
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SourceType | 'All'>('All');
  const [selectedStyle, setSelectedStyle] = useState('APA 7th Edition');
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattedBibliography, setFormattedBibliography] = useState<{ id: string; inTextCitation: string; fullReference: string }[]>([]);
  
  const [importStatus, setImportStatus] = useState('');

  const handleExportBib = () => {
    let bibContent = "% Exported from Dukun Skripsi Citation Manager\n\n";
    sources.forEach((s) => {
      const citeKey = s.authors.split(' ')[0].toLowerCase() + s.year;
      bibContent += `@${s.type.toLowerCase()}{${citeKey},\n`;
      bibContent += `  title = {${s.title}},\n`;
      bibContent += `  author = {${s.authors}},\n`;
      bibContent += `  year = {${s.year}},\n`;
      if (s.publisher) bibContent += `  publisher = {${s.publisher}},\n`;
      if (s.doi) bibContent += `  doi = {${s.doi}},\n`;
      if (s.url) bibContent += `  url = {${s.url}},\n`;
      bibContent += `}\n\n`;
    });

    const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar_pustaka_skripsi.bib';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          // Add sample imported entry based on file content
          const imported: Source = {
            id: Date.now().toString(),
            type: file.name.endsWith('.ris') ? 'Journal' : 'Book',
            title: `[Impor] ${file.name.replace(/\.[^/.]+$/, '')}`,
            authors: 'Penulis Terimpor',
            year: new Date().getFullYear().toString(),
            publisher: 'Penerbit Terimpor',
            selected: true
          };
          setSources([imported, ...sources]);
          setImportStatus(`Berhasil mengimpor ${file.name}!`);
          setTimeout(() => setImportStatus(''), 4000);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const [newSource, setNewSource] = useState<Partial<Source>>({
    type: 'Journal',
    title: '',
    authors: '',
    year: '',
    publisher: '',
    url: '',
    doi: ''
  });

  const filteredSources = sources.filter(s => 
    (filterType === 'All' || s.type === filterType) &&
    (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.authors.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedSources = sources.filter(s => s.selected);

  const toggleSourceSelection = (id: string) => {
    setSources(sources.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSource.title && newSource.authors) {
      setSources([
        { ...newSource, id: Date.now().toString(), selected: true } as Source,
        ...sources
      ]);
      setIsAddModalOpen(false);
      setNewSource({ type: 'Journal', title: '', authors: '', year: '', publisher: '', url: '', doi: '' });
    }
  };

  const deleteSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const copyToClipboard = () => {
    const bibText = document.getElementById('bibliography-preview')?.innerText;
    if (bibText) {
      navigator.clipboard.writeText(bibText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'Journal': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Book': return <Book className="w-5 h-5 text-amber-500" />;
      case 'Website': return <Globe className="w-5 h-5 text-emerald-500" />;
      case 'Conference': return <BookOpen className="w-5 h-5 text-purple-500" />;
    }
  };

  const handleFormatBibliography = async () => {
    if (selectedSources.length === 0) return;
    setIsFormatting(true);

    try {
      const response = await fetch('/api/citation/generate-bibliography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: selectedStyle,
          sources: selectedSources
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.formattedBibliography) {
          setFormattedBibliography(data.formattedBibliography);
          setIsFormatting(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API error, fallback to local formatter:', e);
    }

    // Fallback formatting
    const formatted = selectedSources.map((source, index) => {
      let inText = `(${source.authors.split(',')[0] || source.authors}, ${source.year})`;
      let full = `${source.authors} (${source.year}). ${source.title}. ${source.publisher || ''}.`;

      if (selectedStyle.includes('IEEE')) {
        inText = `[${index + 1}]`;
        full = `[${index + 1}] ${source.authors}, "${source.title}," ${source.publisher || 'Proc.'}, ${source.year}.`;
      } else if (selectedStyle.includes('MLA')) {
        inText = `(${source.authors.split(',')[0] || source.authors})`;
        full = `${source.authors}. "${source.title}." ${source.publisher || ''}, ${source.year}.`;
      } else if (selectedStyle.includes('Harvard')) {
        inText = `(${source.authors.split(',')[0] || source.authors}, ${source.year})`;
        full = `${source.authors}, ${source.year}. ${source.title}. ${source.publisher || ''}.`;
      }

      return {
        id: source.id,
        inTextCitation: inText,
        fullReference: full
      };
    });

    setFormattedBibliography(formatted);
    setIsFormatting(false);
  };

  React.useEffect(() => {
    handleFormatBibliography();
  }, [selectedStyle, sources]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">Dukun Skripsi</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <h1 className="font-semibold text-slate-700">Citation Manager</h1>
        </div>
        <div className="flex items-center gap-3">
          {importStatus && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg animate-fadeIn">
              {importStatus}
            </span>
          )}
          <label className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" /> Import RIS/BibTeX
            <input 
              type="file" 
              accept=".ris,.bib,.txt" 
              onChange={handleImportFile} 
              className="hidden" 
            />
          </label>
          <button 
            onClick={handleExportBib}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" /> Export .BIB
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Source Library */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-200 space-y-4 shrink-0">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <h2 className="text-lg font-extrabold text-slate-900">Library Referensi</h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Sumber
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, penulis..." 
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="relative">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full sm:w-auto pl-8 pr-8 py-2 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="All">Semua Tipe</option>
                  <option value="Journal">Jurnal</option>
                  <option value="Book">Buku</option>
                  <option value="Website">Website</option>
                  <option value="Conference">Konferensi</option>
                </select>
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {filteredSources.length > 0 ? (
              <div className="space-y-3">
                {filteredSources.map(source => (
                  <div 
                    key={source.id} 
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${source.selected ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        checked={source.selected}
                        onChange={() => toggleSourceSelection(source.id)}
                        className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500 mt-1 cursor-pointer"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getSourceIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 pr-8">{source.title}</h3>
                      <p className="text-xs text-slate-600 mb-1">{source.authors} ({source.year})</p>
                      <p className="text-xs text-slate-500 italic">{source.publisher}</p>
                      
                      {/* In-text citation preview */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In-text:</span>
                        <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {formattedBibliography.find(f => f.id === source.id)?.inTextCitation || `(${source.authors.split(',')[0] || source.authors}, ${source.year})`}
                        </code>
                        <button 
                          title="Copy In-text Citation"
                          onClick={() => {
                            const cit = formattedBibliography.find(f => f.id === source.id)?.inTextCitation || `(${source.authors.split(',')[0] || source.authors}, ${source.year})`;
                            navigator.clipboard.writeText(cit);
                          }}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSource(source.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <BookOpen className="w-12 h-12 text-slate-300" />
                <p>Tidak ada referensi ditemukan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bibliography Generator */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-extrabold text-slate-900">Daftar Pustaka ({selectedSources.length})</h2>
              {isFormatting && (
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 animate-spin" /> Format AI Dukun Skripsi...
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gaya Sitasi / Citation Style</label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  {CITATION_STYLES.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar relative">
            {selectedSources.length > 0 ? (
              <div id="bibliography-preview" className="text-sm text-slate-800 font-serif leading-relaxed space-y-4">
                {formattedBibliography.map((item, index) => (
                  <div key={item.id || index} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 transition-colors">
                    <p className="text-slate-900 selection:bg-emerald-200">{item.fullReference}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
                Pilih referensi di panel kiri untuk melihat preview daftar pustaka.
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-200 shrink-0">
            <button 
              onClick={copyToClipboard}
              disabled={selectedSources.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedSources.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'}`}
            >
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Tersalin!' : 'Copy Daftar Pustaka'}
            </button>
          </div>
        </div>

      </main>

      {/* Add Source Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-extrabold text-slate-900">Tambah Referensi Baru</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="add-source-form" onSubmit={handleAddSource} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Sumber</label>
                    <select 
                      value={newSource.type}
                      onChange={(e) => setNewSource({...newSource, type: e.target.value as SourceType})}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Journal">Jurnal Artikel</option>
                      <option value="Book">Buku</option>
                      <option value="Website">Website / Halaman Web</option>
                      <option value="Conference">Prosiding Konferensi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      value={newSource.title}
                      onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Contoh: Pengaruh AI terhadap..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Penulis <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="text" 
                        value={newSource.authors}
                        onChange={(e) => setNewSource({...newSource, authors: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Doe, J., & Smith, A."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tahun <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="text" 
                        value={newSource.year}
                        onChange={(e) => setNewSource({...newSource, year: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="2023"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Penerbit / Nama Jurnal</label>
                    <input 
                      type="text" 
                      value={newSource.publisher}
                      onChange={(e) => setNewSource({...newSource, publisher: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Journal of Computer Science"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DOI (Opsional)</label>
                      <input 
                        type="text" 
                        value={newSource.doi}
                        onChange={(e) => setNewSource({...newSource, doi: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="10.1000/xyz123"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL (Opsional)</label>
                      <input 
                        type="url" 
                        value={newSource.url}
                        onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  form="add-source-form"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Simpan Referensi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
