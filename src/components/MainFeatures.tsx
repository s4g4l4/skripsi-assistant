import React from 'react';
import { 
  FileText, CheckCircle, TrendingDown, BookOpen, ArrowRight, 
  Search, ShieldCheck, Layers, Book, Sparkles, AlertTriangle, Wand2, FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import JournalFinderSection from './JournalFinderSection';
import AIDocumentChecker from './AIDocumentChecker';
import SmartOutlineGenerator from './SmartOutlineGenerator';
import CitationHelper from './CitationHelper';

export function MainFeatures() {
  return (
    <div className="py-20 bg-slate-950 text-white" id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* 5-COLOR VIBRANT TOOL SHOWCASE GRID */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 via-orange-400 via-red-400 to-amber-400">
                Workspace AI 5 Warna Lengkap
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Alat Tempur Akademis Terlengkap
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Semua fitur dirancang khusus sesuai pedoman kampus Indonesia dan aturan publikasi jurnal SINTA / Scopus.
            </p>
          </div>

          {/* 5 Distinct Color Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. HIJAU (Green) - Auto Format & Turnitin Safe */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all shadow-xl shadow-emerald-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div>
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px] rounded-md uppercase tracking-wider border border-emerald-500/30 mb-2 inline-block">
                  🟢 Hijau • Auto Format
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Auto Format & Turnitin Safe</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Margin 4-4-3-3, font TNR 12pt, spasi 1.5, dan letak penomoran halaman disesuaikan otomatis dengan sekali klik. Lolos Turnitin hingga 14%.
                </p>
              </div>
              <Link 
                to="/auto-format" 
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <span>Coba Auto Format</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2. BIRU (Blue) - Cari Jurnal & AI Document Checker */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-blue-500/40 hover:border-blue-400 transition-all shadow-xl shadow-blue-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div>
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
                  <FileCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 font-extrabold text-[11px] rounded-md uppercase tracking-wider border border-blue-500/30 mb-2 inline-block">
                  🔵 Biru • AI Document Checker
                </span>
                <h3 className="text-xl font-bold text-white mb-2">AI Document Checker & Jurnal</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cari jurnal mudah dan terpercaya (SINTA/Scopus) serta periksa kelayakan draf skripsi, PUEBI, dan kelengkapan struktur akademis secara real-time.
                </p>
              </div>
              <a 
                href="#cari-jurnal" 
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>Cari Jurnal & Cek Dokumen</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* 3. ORANGE (Orange) - 1-Click Proposal & Smart Outline Generator */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-orange-500/40 hover:border-orange-400 transition-all shadow-xl shadow-orange-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
              <div>
                <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-4 border border-orange-500/30">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 font-extrabold text-[11px] rounded-md uppercase tracking-wider border border-orange-500/30 mb-2 inline-block">
                  🟠 Orange • Smart Outline
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Smart Outline Generator</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Susun struktur bab I s.d. V otomatis berdasarkan topik, rumpun ilmu, dan estimasi halaman yang proporsional untuk S1, S2, maupun S3.
                </p>
              </div>
              <a 
                href="#outline-generator" 
                className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                <span>Generate Outline Skripsi</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* 4. MERAH (Red) - Turnitin Risk Detector & Plagiarism Alert */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-red-500/40 hover:border-red-400 transition-all shadow-xl shadow-red-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
              <div>
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-4 border border-red-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-red-500/10 text-red-400 font-extrabold text-[11px] rounded-md uppercase tracking-wider border border-red-500/30 mb-2 inline-block">
                  🔴 Merah • Deteksi Turnitin
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Plagiarism Risk Detector</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Peringatan dini kalimat yang terindikasi plagiasi atau mirip dengan naskah lain, dilengkapi fitur Smart Paraphrase akademis instan.
                </p>
              </div>
              <Link 
                to="/editor" 
                className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
              >
                <span>Buka Editor & Parafrase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 5. KUNING (Yellow) - Citation Helper & Reference Manager */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-amber-500/40 hover:border-amber-400 transition-all shadow-xl shadow-amber-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden group md:col-span-2 lg:col-span-1">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
              <div>
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/30">
                  <Book className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 font-extrabold text-[11px] rounded-md uppercase tracking-wider border border-amber-500/30 mb-2 inline-block">
                  🟡 Kuning • Citation Helper
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Citation Helper & Bibliography</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kelola daftar pustaka & buat sitasi dalam teks otomatis (APA 7th, IEEE, Harvard, MLA) tanpa perlu aplikasi Mendeley atau EndNote.
                </p>
              </div>
              <Link 
                to="/citation-manager" 
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                <span>Buka Citation Helper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

        {/* EMBEDDED JOURNAL FINDER SECTION */}
        <JournalFinderSection />

        {/* EMBEDDED AI DOCUMENT CHECKER */}
        <div id="document-checker" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Uji Kelayakan Draft Skripsi</h2>
            <p className="text-slate-400 text-sm">Gunakan AI Document Checker di bawah untuk mengecek kepatuhan format & PUEBI</p>
          </div>
          <AIDocumentChecker />
        </div>

        {/* EMBEDDED SMART OUTLINE GENERATOR */}
        <div id="outline-generator" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Rancang Outline Bab Skripsi</h2>
            <p className="text-slate-400 text-sm">Rancang kerangka penulisan proposal dan bab skripsi secara efisien</p>
          </div>
          <SmartOutlineGenerator />
        </div>

        {/* EMBEDDED CITATION HELPER */}
        <div id="citation-helper" className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Penolong Sitasi Akademis</h2>
            <p className="text-slate-400 text-sm">Format kutipan dan daftar pustaka instan untuk jurnal & skripsi</p>
          </div>
          <CitationHelper />
        </div>

      </div>
    </div>
  );
}
