import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Upload, Edit3, Save, Download, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="pt-32 pb-16 bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4" /> Gratis untuk memulai
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Auto Format Skripsi <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pakai AI</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Berhenti membuang waktu mengatur margin dan daftar pustaka. Fokus pada isi tulisanmu, biarkan Dukun Skripsi mengurus sisanya sesuai pedoman kampusmu.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2 text-lg">
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2 mt-4 sm:mt-0 sm:ml-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Dipercaya 40.000+ mahasiswa
          </p>
        </motion.div>
      </div>
      
      {/* Logo Kampus */}
      <div className="mt-20 border-y border-slate-800 bg-slate-950/50 py-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">Mendukung Pedoman Format Kampus Terkemuka</p>
          <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0">
             <div className="text-2xl font-black text-white flex items-center gap-2">UI</div>
             <div className="text-2xl font-black text-white flex items-center gap-2">UGM</div>
             <div className="text-2xl font-black text-white flex items-center gap-2">ITB</div>
             <div className="text-2xl font-black text-white flex items-center gap-2">UNHAS</div>
             <div className="text-2xl font-black text-white flex items-center gap-2">UNDIP</div>
             <div className="text-2xl font-black text-white flex items-center gap-2">UNBRAW</div>
          </div>
        </div>
      </div>

      {/* Cara Kerja */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Cara Kerja Dukun Skripsi</h2>
          <p className="text-slate-400">4 Langkah mudah menuju wisuda tanpa revisi format.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Upload, title: "1. Import", desc: "Upload draft kasarmu dalam format docx atau ketik langsung." },
            { icon: Edit3, title: "2. Edit & AI", desc: "Gunakan AI untuk parafrase, tambah sitasi, dan perbaiki grammar." },
            { icon: Save, title: "3. Pilih Kampus", desc: "Pilih template universitasmu. Margin & spasi otomatis menyesuaikan." },
            { icon: Download, title: "4. Download", desc: "Unduh hasil akhir PDF/DOCX yang siap diserahkan ke Dospem." }
          ].map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 relative z-10 text-emerald-400">
                <step.icon className="w-8 h-8" />
              </div>
              {i !== 3 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-slate-800 -z-10"></div>}
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
