import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Upload, Edit3, Save, Download, Sparkles, Search, Layers, FileCheck, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="pt-28 pb-16 bg-slate-950 overflow-hidden relative border-b border-slate-800/80">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-emerald-950/20 to-slate-950"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Top Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-wider shadow-inner">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200">Asisten Skripsi & Riset AI Indonesia #1</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto">
          Cepat Selesai Skripsi & Jurnal <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 via-orange-400 via-red-400 to-amber-400">
            Dukun Skripsi AI
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Otomatiskan pengerjaan skripsi dari pencarian jurnal terpercaya, kelayakan naskah AI, perancangan outline bab, penataan format kampus, hingga sitasi otomatis.
        </motion.p>

        {/* 5-Color Quick Action Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-4xl mx-auto">
          {/* Hijau */}
          <a href="#fitur" className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>🟢 Auto Format (Hijau)</span>
          </a>

          {/* Biru */}
          <a href="#cari-jurnal" className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>🔵 Cari Jurnal & AI Document Checker (Biru)</span>
          </a>

          {/* Orange */}
          <a href="#outline-generator" className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>🟠 Smart Outline Generator (Orange)</span>
          </a>

          {/* Merah */}
          <Link to="/editor" className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span>🔴 Turnitin Plagiarism Fixer (Merah)</span>
          </Link>

          {/* Kuning */}
          <a href="#citation-helper" className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>🟡 Citation Helper (Kuning)</span>
          </a>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-base">
            <span>Mulai Sekarang Gratis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link to="/ai-tools" className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-base border border-indigo-400/30">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span>Pusat 44 Tools AI Studio</span>
          </Link>

          <a href="#cari-jurnal" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-base">
            <Search className="w-5 h-5 text-blue-200" />
            <span>Cari Jurnal SINTA / Scopus</span>
          </a>
        </motion.div>

        <p className="text-xs text-slate-400 flex items-center justify-center gap-2 pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dipercaya 40.000+ mahasiswa & dosen seluruh Indonesia
        </p>

      </div>
      
      {/* Kampus Marquee / Logos */}
      <div className="mt-16 border-y border-slate-800 bg-slate-900/60 py-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-4">Mendukung Pedoman Format PTN/PTS Indonesia</p>
          <div className="flex justify-center gap-8 md:gap-14 flex-wrap text-slate-300 font-black text-xl tracking-wider opacity-80">
             <span>UI</span>
             <span>UGM</span>
             <span>ITB</span>
             <span>UNAIR</span>
             <span>UNDIP</span>
             <span>UNHAS</span>
             <span>UB</span>
             <span>UNS</span>
             <span>ITS</span>
             <span>TELKOM</span>
          </div>
        </div>
      </div>

    </div>
  );
}
