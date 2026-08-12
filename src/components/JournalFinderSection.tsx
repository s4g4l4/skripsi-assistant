import React, { useState } from 'react';
import { 
  Search, BookOpen, Filter, ExternalLink, CheckCircle2, 
  Sparkles, Award, Clock, DollarSign, Bookmark, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface JournalRecommendation {
  id: string;
  journalTitle: string;
  publisher: string;
  indexing: 'SINTA 1' | 'SINTA 2' | 'SINTA 3' | 'SINTA 4' | 'Scopus Q1' | 'Scopus Q2' | 'Garuda / DOAJ';
  acceptanceRate: string;
  reviewSpeed: string;
  apcCost: string;
  scopeMatchScore: number;
  sampleArticle: string;
  description: string;
  url: string;
}

const MOCK_JOURNALS: JournalRecommendation[] = [
  {
    id: 'j1',
    journalTitle: 'Jurnal Sistem Informasi (JSI) - Universitas Indonesia',
    publisher: 'Fakultas Ilmu Komputer UI',
    indexing: 'SINTA 1',
    acceptanceRate: '35% (Sangat Ketat)',
    reviewSpeed: '3 - 6 Minggu',
    apcCost: 'Gratis / Open Access',
    scopeMatchScore: 98,
    sampleArticle: 'Implementasi Machine Learning untuk Prediksi Kinerja Akademik Mahasiswa',
    description: 'Fokus pada sistem informasi, e-government, data science, dan adopsi teknologi di Indonesia.',
    url: 'https://jsi.cs.ui.ac.id'
  },
  {
    id: 'j2',
    journalTitle: 'Jurnal Manajemen dan Kewirausahaan (JMK)',
    publisher: 'Universitas Kristen Petra',
    indexing: 'SINTA 2',
    acceptanceRate: '45% (Sedang)',
    reviewSpeed: '2 - 4 Minggu',
    apcCost: 'Rp 750.000',
    scopeMatchScore: 94,
    sampleArticle: 'Pengaruh Consumer Engagement dan Influencer Marketing pada Generasi Z',
    description: 'Menerima artikel bidang manajemen pemasaran, keuangan, SDM, dan perilaku organisasi.',
    url: 'https://jurnalmanajemen.petra.ac.id'
  },
  {
    id: 'j3',
    journalTitle: 'IEEE Access (Multidisciplinary Open Access)',
    publisher: 'IEEE',
    indexing: 'Scopus Q1',
    acceptanceRate: '30% (High Impact)',
    reviewSpeed: '4 - 6 Minggu',
    apcCost: '$1,950 (Scopus International)',
    scopeMatchScore: 92,
    sampleArticle: 'Deep Learning Approaches for Natural Language Processing in Academic Research',
    description: 'Jurnal internasional bereputasi tinggi dengan proses review transparan dan publikasi cepat.',
    url: 'https://ieeeaccess.ieee.org'
  },
  {
    id: 'j4',
    journalTitle: 'Jurnal Teknologi Informasi dan Ilmu Komputer (JTIIK)',
    publisher: 'Universitas Brawijaya',
    indexing: 'SINTA 2',
    acceptanceRate: '40%',
    reviewSpeed: '3 - 5 Minggu',
    apcCost: 'Rp 1.000.000',
    scopeMatchScore: 90,
    sampleArticle: 'Rancang Bangun Aplikasi Mobile Education Berbasis User Experience',
    description: 'Terakreditasi Kemenristekdikti, menerbitkan artikel rekayasa perangkat lunak dan AI.',
    url: 'https://jtiik.ub.ac.id'
  },
  {
    id: 'j5',
    journalTitle: 'Jurnal Ilmiah Komputasi dan Pendidikan',
    publisher: 'Asosiasi Dosen Indonesia',
    indexing: 'SINTA 3',
    acceptanceRate: '65% (Ramah Mahasiswa S1)',
    reviewSpeed: '1 - 2 Minggu (Fast Track)',
    apcCost: 'Rp 350.000',
    scopeMatchScore: 88,
    sampleArticle: 'Efektivitas Media Pembelajaran Interaktif pada Siswa Sekolah Menengah',
    description: 'Sangat cocok untuk mahasiswa S1 yang membutuhkan publikasi cepat sebagai syarat kelulusan.',
    url: 'https://garuda.kemdikbud.go.id'
  },
  {
    id: 'j6',
    journalTitle: 'Computers & Education (Elsevier)',
    publisher: 'Elsevier',
    indexing: 'Scopus Q1',
    acceptanceRate: '15% (Sangat Selektif)',
    reviewSpeed: '6 - 8 Minggu',
    apcCost: 'Free / Hybrid Open Access',
    scopeMatchScore: 85,
    sampleArticle: 'Artificial Intelligence in Higher Education: A Systematic Literature Review',
    description: 'Jurnal papan atas internasional bidang EdTech dan integrasi komputer dalam sains.',
    url: 'https://www.sciencedirect.com/journal/computers-and-education'
  }
];

export default function JournalFinderSection() {
  const [topicInput, setTopicInput] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState('Semua Tahun');
  const [selectedIndexing, setSelectedIndexing] = useState('Semua Indexing');
  const [isSearching, setIsSearching] = useState(false);
  const [journals, setJournals] = useState<JournalRecommendation[]>(MOCK_JOURNALS);
  const [savedJournals, setSavedJournals] = useState<string[]>([]);
  const [searchedKeyword, setSearchedKeyword] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSearching(true);
    setSearchedKeyword(topicInput || 'Semua Topik Penelitian');

    setTimeout(() => {
      let filtered = [...MOCK_JOURNALS];

      if (topicInput.trim()) {
        const query = topicInput.toLowerCase();
        filtered = filtered.map(j => {
          let score = 75;
          if (query.includes('sistem') || query.includes('ai') || query.includes('komputer') || query.includes('software')) {
            if (j.indexing.includes('SINTA 1') || j.indexing.includes('SINTA 2') || j.indexing.includes('Scopus')) score += 15;
          }
          if (query.includes('pemasaran') || query.includes('manajemen') || query.includes('bisnis')) {
            if (j.journalTitle.includes('Manajemen')) score += 20;
          }
          return { ...j, scopeMatchScore: Math.min(99, score + Math.floor(Math.random() * 10)) };
        });
      }

      if (selectedIndexing !== 'Semua Indexing') {
        filtered = filtered.filter(j => j.indexing.includes(selectedIndexing.replace('SINTA ', 'SINTA').replace('Scopus ', 'Scopus')));
      }

      setJournals(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const toggleSaveJournal = (id: string) => {
    if (savedJournals.includes(id)) {
      setSavedJournals(savedJournals.filter(item => item !== id));
    } else {
      setSavedJournals([...savedJournals, id]);
    }
  };

  return (
    <section className="py-12 bg-slate-900 border-y border-slate-800 text-white relative overflow-hidden" id="cari-jurnal">
      {/* Background Lighting Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Pencari Jurnal SINTA & Scopus Terintegrasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cari Jurnal Mudah dan Terpercaya
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Dapatkan rekomendasi jurnal yang sesuai dengan penelitian lo.
          </p>
        </div>

        {/* Search & Filter Bar Widget */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Tulis judul/topik penelitian lo di sini..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Year Filter */}
            <div className="w-full md:w-48 shrink-0">
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Semua Tahun">Semua Tahun</option>
                <option value="5 Tahun Terakhir">5 Tahun Terakhir (2021-2026)</option>
                <option value="2025">2025 - Terbaru</option>
                <option value="2024">Terbitan 2024</option>
                <option value="2023">Terbitan 2023</option>
                <option value="2022">Terbitan 2022</option>
              </select>
            </div>

            {/* Indexing Filter */}
            <div className="w-full md:w-48 shrink-0">
              <select
                value={selectedIndexing}
                onChange={(e) => setSelectedIndexing(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Semua Indexing">Semua Indexing</option>
                <option value="SINTA 1">SINTA 1 & 2</option>
                <option value="SINTA 3">SINTA 3 & 4</option>
                <option value="Scopus Q1">Scopus Q1 / Q2</option>
                <option value="Garuda / DOAJ">Garuda / DOAJ</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSearching}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Cari Jurnal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Filter Tag Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 font-bold">Rekomendasi Cepat:</span>
            {[
              'Sistem Informasi & AI',
              'Manajemen Pemasaran',
              'Psikologi & Pendidikan',
              'SINTA 1-2 (Gratis)',
              'Scopus Cepat ACC'
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopicInput(tag);
                  handleSearch();
                }}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 px-2">
          <p>
            Menampilkan <strong className="text-emerald-400 font-bold">{journals.length} Jurnal Terpercaya</strong> 
            {searchedKeyword && <span> untuk topik: <em className="text-blue-300 font-semibold">"{searchedKeyword}"</em></span>}
          </p>
          <span className="text-slate-400">Filter Tahun: <strong className="text-white">{selectedYearFilter}</strong></span>
        </div>

        {/* Recommended Journals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {journals.map((journal) => {
              const isSaved = savedJournals.includes(journal.id);
              const isSinta = journal.indexing.startsWith('SINTA');
              const isScopus = journal.indexing.startsWith('Scopus');

              return (
                <motion.div
                  key={journal.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl relative group"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isSinta ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isScopus ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {journal.indexing}
                      </span>

                      <div className="flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 text-xs font-bold text-blue-300">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span>{journal.scopeMatchScore}% Relevan</span>
                      </div>
                    </div>

                    {/* Journal Title & Publisher */}
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {journal.journalTitle}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">{journal.publisher}</p>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 text-[10px] block">Lama Review:</span>
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {journal.reviewSpeed}
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                        <span className="text-slate-400 text-[10px] block">Biaya (APC):</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          {journal.apcCost}
                        </span>
                      </div>
                    </div>

                    {/* Sample Article */}
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Contoh Artikel Terbit:</span>
                      <p className="text-slate-300 italic font-medium leading-relaxed">"{journal.sampleArticle}"</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{journal.description}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <a
                      href={journal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Kunjungi Website Jurnal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleSaveJournal(journal.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title={isSaved ? 'Tersimpan di Favorit' : 'Simpan Jurnal'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Callout */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 p-5 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">Butuh bantuan menyusun draf agar sesuai dengan template jurnal di atas?</p>
              <p className="text-slate-300">Gunakan fitur <strong className="text-emerald-400">AI Document Checker</strong> dan <strong className="text-orange-400">Smart Outline Generator</strong> untuk menyiapkan naskah siap submit.</p>
            </div>
          </div>
          <a
            href="/citation-manager"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl whitespace-nowrap shadow-md transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Buka Citation Manager</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
