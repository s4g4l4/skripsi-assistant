import { FileText, CheckCircle, TrendingDown, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export function MainFeatures() {
  return (
    <div className="py-24 bg-white" id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* 1-Click Proposal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-4">
              ✨ 1-Click Proposal
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Otomatiskan Struktur Proposal Anda</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Hanya dengan memasukkan topik skripsi, AI kami akan mengenerate struktur Latar Belakang, Rumusan Masalah, hingga Tinjauan Pustaka lengkap dengan template referensi untuk Anda kembangkan.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle className="w-6 h-6 text-emerald-500" /> Struktur standar akademis terverifikasi
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle className="w-6 h-6 text-emerald-500" /> Bahasa formal baku Indonesia
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle className="w-6 h-6 text-emerald-500" /> Draft kasaran siap dalam hitungan detik
              </li>
            </ul>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-slate-50 p-6 rounded-2xl shadow-xl border border-slate-200 relative">
             <div className="w-full h-10 bg-slate-200 rounded-t-xl flex items-center px-4 gap-2 mb-6 border-b border-slate-300">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
             </div>
             <div className="space-y-4">
               <div className="h-4 bg-slate-300 rounded w-1/3 mb-6"></div>
               <div className="h-3 bg-slate-200 rounded w-full"></div>
               <div className="h-3 bg-slate-200 rounded w-5/6"></div>
               <div className="h-3 bg-slate-200 rounded w-full"></div>
               <div className="h-3 bg-slate-200 rounded w-4/5"></div>
               <div className="mt-8 p-4 bg-emerald-100/50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-center gap-2 font-bold shadow-sm">
                 <FileText className="w-5 h-5" /> Proposal Outline Generated Successfully!
               </div>
             </div>
          </motion.div>
        </div>

        {/* Buku Panduan Kampus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-row-reverse">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1 relative">
             <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
               <div className="absolute -right-10 -bottom-10 opacity-10">
                 <BookOpen className="w-64 h-64 text-white" />
               </div>
               <h3 className="text-xl font-bold text-white mb-6">Upload Pedoman Kampusmu</h3>
               <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer group">
                 <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-emerald-400 transition-colors" />
                 <p className="text-slate-200 font-medium mb-2">Drag & drop file PDF pedoman</p>
                 <p className="text-xs text-slate-500">Maksimal 10MB (PDF)</p>
               </div>
             </div>
          </motion.div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">AI Parser Buku Panduan Kampus</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Tidak menemukan kampusmu di daftar template? Upload buku pedoman skripsi kampusmu (PDF), dan AI kami akan mempelajari aturan margin, font, letak logo, dan penomoran halamannya secara real-time.
            </p>
            <button className="px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-full hover:bg-slate-900 hover:text-white transition-colors">
              Lihat Demo Fitur
            </button>
          </div>
        </div>

        {/* Success Story / Grafik */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Lolos Cek Turnitin Tanpa Takut</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Fitur Parafrase Akademis kami tidak sekadar mengubah sinonim, melainkan menulis ulang struktur kalimat dengan gaya bahasa mahasiswa Indonesia.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 w-full md:w-64 relative backdrop-blur-sm">
                <p className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">Sebelum Parafrase</p>
                <div className="text-6xl font-black text-red-500 mb-2">60%</div>
                <p className="text-xs text-red-400/80 font-medium">Similarity Index</p>
              </div>
              
              <TrendingDown className="w-12 h-12 text-slate-600 hidden md:block" />
              
              <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 w-full md:w-64 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
                <p className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Sesudah Parafrase</p>
                <div className="text-6xl font-black text-emerald-400 mb-2">14%</div>
                <p className="text-xs text-emerald-400/80 font-medium">Aman disubmit ke Dospem!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
