import { FileSearch, Layers, Sparkles, MessageSquareText, PenTool, LayoutTemplate, PlayCircle } from 'lucide-react';
import { useState } from 'react';

export function FeaturesGrid() {
  const features = [
    { icon: FileSearch, title: "Pencarian Jurnal Terpadu", desc: "Terhubung langsung dengan database SINTA & Garuda untuk literatur review yang relevan dengan topikmu." },
    { icon: Sparkles, title: "Brainstorming AI", desc: "Buntu ide judul? Diskusikan dengan AI untuk menemukan celah kebaruan (novelty) penelitian yang belum banyak dibahas." },
    { icon: Layers, title: "Manajer Daftar Pustaka", desc: "Otomatis merapikan kutipan sesuai gaya selingkung (APA, IEEE, Harvard) tanpa perlu software eksternal." },
    { icon: MessageSquareText, title: "Konsultasi Dosen AI", desc: "Chatbot yang disimulasikan sebagai dosen penguji galak untuk melatih mental dan argumen persiapan sidangmu." },
    { icon: PenTool, title: "Smart Paraphrase", desc: "Tulis ulang kalimat yang terlalu mirip dengan sumber asal dengan sekali klik, tetap mempertahankan makna akademis." },
    { icon: LayoutTemplate, title: "Auto-Slide Generator", desc: "Ubah dokumen laporan akhir DOCX-mu menjadi presentasi PowerPoint secara instan, lengkap dengan ringkasan poin." }
  ];

  return (
    <div className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Fitur Lengkap Dukun Skripsi</h2>
          <p className="text-lg text-slate-600">Semua alat tempur yang kamu butuhkan dalam satu workspace pintar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
                <f.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-slate-900 text-xl mb-3">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  const [inputText, setInputText] = useState("Berdasarkan hasil penelitian yang telah dilakukan oleh peneliti, dapat ditarik kesimpulan bahwa terdapat pengaruh yang sangat signifikan antara variabel X dan variabel Y terhadap peningkatan performa Z pada objek penelitian di lokasi tersebut.");
  const [outputText, setOutputText] = useState("");
  const [isParaphrasing, setIsParaphrasing] = useState(false);

  const handleParaphrase = () => {
    setIsParaphrasing(true);
    setTimeout(() => {
      setOutputText("Temuan riset ini mengindikasikan adanya dampak substansial dari variabel X dan Y secara bersama-sama dalam meningkatkan performa Z pada subjek amatan.");
      setIsParaphrasing(false);
    }, 1500);
  };

  return (
    <div className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Coba Sendiri Keajaibannya</h2>
          <p className="text-lg text-slate-400">Demo fitur Smart Paraphrase Akademis secara langsung.</p>
        </div>
        
        <div className="bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Teks Asli (Terindikasi Plagiat)</label>
              <textarea 
                className="w-full h-40 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hasil Parafrase (Aman Turnitin)</label>
              <div className={`w-full h-40 bg-slate-900 border ${outputText ? 'border-emerald-500/50' : 'border-slate-800'} rounded-2xl p-5 text-sm text-slate-300 relative leading-relaxed overflow-y-auto`}>
                {isParaphrasing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 rounded-2xl backdrop-blur-sm z-10">
                    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="text-xs text-emerald-400 font-medium animate-pulse">Menyusun ulang kalimat...</span>
                  </div>
                ) : (
                  outputText || <span className="text-slate-600 italic">Klik tombol di bawah untuk melihat keajaiban...</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button 
              onClick={handleParaphrase}
              disabled={isParaphrasing}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              <PlayCircle className="w-5 h-5" /> {isParaphrasing ? 'Memproses...' : 'Mulai Parafrase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
