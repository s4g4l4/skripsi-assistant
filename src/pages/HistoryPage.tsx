import React, { useState } from 'react';
import { 
  History, Search, Filter, ArrowLeft, FileText, Wand2, 
  Layers, Database, Sparkles, BookOpen, Clock, ChevronRight, CheckCircle2, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: string;
  type: 'Proposal' | 'Editor' | 'Olah Data' | 'Auto Format' | 'Citation' | 'Chat PDF';
  title: string;
  date: string;
  status: 'Selesai' | 'Dalam Proses' | 'Revisi';
  summary: string;
  path: string;
}

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'h-1',
    type: 'Olah Data',
    title: 'Analisis Regresi Linear Berganda - Variabel X1 (Media Sosial) & X2 (Promosi) terhadap Y (Penjualan UMKM)',
    date: 'Hari ini, 10:24',
    status: 'Selesai',
    summary: 'R-Square 0.842, Uji F Sig 0.001, Uji t berpengaruh positif dan signifikan.',
    path: '/olah-data'
  },
  {
    id: 'h-2',
    type: 'Citation',
    title: 'Manajemen Daftar Pustaka Format APA 7th Edition (Sugiyono, Smith, Martin)',
    date: 'Kemarin, 16:45',
    status: 'Selesai',
    summary: 'Daftar pustaka diformat lengkap dengan in-text citation & full reference.',
    path: '/citation-manager'
  },
  {
    id: 'h-3',
    type: 'Proposal',
    title: 'Draft Bab 1-3: Implementasi Machine Learning untuk Prediksi Harga Saham UMKM',
    date: '04 Agu 2026',
    status: 'Dalam Proses',
    summary: 'Latar belakang, rumusan masalah, dan tinjauan pustaka utama telah dibuat.',
    path: '/editor'
  },
  {
    id: 'h-4',
    type: 'Chat PDF',
    title: 'Tanya Jawab Dokumen Jurnal IEEE Machine Learning 2025',
    date: '02 Agu 2026',
    status: 'Selesai',
    summary: 'Ekstraksi kutipan & kesimpulan metode kuantitatif.',
    path: '/pdf-chat'
  },
  {
    id: 'h-5',
    type: 'Auto Format',
    title: 'Penyesuaian Margin & Sub-bab Standar Pedoman Skripsi Universitas',
    date: '28 Jul 2026',
    status: 'Selesai',
    summary: 'Format margin 4-4-3-3, font Times New Roman 12pt, spasi 1.5.',
    path: '/auto-format'
  }
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredItems = HISTORY_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Olah Data': return <Database className="w-4 h-4 text-emerald-600" />;
      case 'Citation': return <Layers className="w-4 h-4 text-purple-600" />;
      case 'Proposal': case 'Editor': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'Auto Format': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Chat PDF': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default: return <Wand2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Riwayat Aktivitas & Revisi</h1>
              <p className="text-xs text-slate-500">Jejak pembuatan proposal, olah data, dan sitasi skripsi Anda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di riwayat..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {['All', 'Olah Data', 'Citation', 'Proposal', 'Chat PDF', 'Auto Format'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterType === t 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'All' ? 'Semua Kat' : t}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {item.date}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
                  </div>
                </div>

                <Link
                  to={item.path}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors w-full sm:w-auto justify-center"
                >
                  Buka Modul <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Tidak ada riwayat ditemukan</p>
              <p className="text-xs text-slate-400">Coba ubah kata kunci atau filter pencarian Anda.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
