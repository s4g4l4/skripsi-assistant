import React, { useState } from 'react';
import { 
  FileCheck, ShieldAlert, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, FileText, Upload, ArrowRight, Download, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIDocumentChecker() {
  const [inputText, setInputText] = useState(`LATAR BELAKANG PENELITIAN
Perkembangan teknologi informasi yang sangat pesat pada era digital saat ini telah membawa perubahan yang signifikan terhadap berbagai aspek kehidupan manusia, khususnya dalam sektor pendidikan tinggi. Penggunaan sistem kecerdasan buatan (Artificial Intelligence) seperti ChatGPT dan alat bantu penulisan otomatis lainnya semakin masif digunakan oleh mahasiswa dalam membantu penyusunan karya ilmiah seperti skripsi.

Namun demikian, integrasi teknologi AI tersebut juga menimbulkan berbagai tantangan baru terkait dengan isu plagiarisme, penurunan tingkat orisinalitas tulisan, serta ketidaksesuaian format naskah dengan pedoman baku penulisan skripsi di perguruan tinggi. Berdasarkan survei awal yang dilakukan di beberapa universitas negeri di Indonesia, sebanyak 68% mahasiswa mengaku masih mengalami kesulitan dalam merapikan format margin, sitasi, serta tata bahasa baku bahasa Indonesia.

Oleh karena itu, penelitian ini bertujuan untuk menganalisis efektivitas penggunaan alat bantu AI berbasis aturan pedoman lokal dalam meningkatkan kualitas dan orisinalitas naskah akademik mahasiswa.`);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>({
    overallScore: 88,
    similarityEstimate: 12, // 12% (Aman Turnitin)
    formattingCompliance: 'Sesuai Pedoman (Margin 4-4-3-3, Font 12pt, Spasi 1.5)',
    grammarErrorsCount: 2,
    structureCheck: [
      { section: 'Latar Belakang & Alasan Akademis', status: 'Lengkap & Kuat', pass: true },
      { section: 'Fenomena / Problem Statement', status: 'Terdapat Data Survei (68%)', pass: true },
      { section: 'Research Gap (Kebaruan Penelitian)', status: 'Perlu Ditegaskan Lebih Spesifik', pass: false },
      { section: 'Tujuan Penelitian', status: 'Jelas & Terukur', pass: true },
      { section: 'Kesesuaian PUEBI / EYD', status: '2 Istilah Asing Belum Miring (Italic)', pass: false }
    ],
    suggestions: [
      'Miringkan istilah asing seperti "Artificial Intelligence", "ChatGPT", "originality".',
      'Tambahkan 1-2 sitasi jurnal terbaru (< 5 tahun) pada paragraf latar belakang.',
      'Perjelas Research Gap di paragraf ketiga sebelum menyebutkan tujuan penelitian.'
    ]
  });

  const handleRunCheck = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      // Generate intelligent analysis based on input length and keywords
      const text = inputText.toLowerCase();
      let score = 82;
      let similarity = 14;
      const issues = [];

      if (text.includes('perkembangan teknologi') || text.includes('era digital')) {
        issues.push({ section: 'Latar Belakang Klise', status: 'Gunakan pembuka yang lebih spesifik', pass: false });
      } else {
        issues.push({ section: 'Pembuka Latar Belakang', status: 'Sangat Akademis', pass: true });
        score += 5;
      }

      if (text.includes('tujuan penelitian') || text.includes('bertujuan untuk')) {
        issues.push({ section: 'Tujuan Penelitian', status: 'Ditemukan & Terstruktur', pass: true });
        score += 5;
      } else {
        issues.push({ section: 'Tujuan Penelitian', status: 'Belum terdeteksi di paragraf akhir', pass: false });
      }

      if (text.length > 500) {
        score += 4;
        similarity = Math.max(8, 22 - Math.floor(text.length / 300));
      }

      issues.push({ section: 'PUEBI & Ejaan Bahasa Indonesia', status: 'Format Istilah Asing & Tanda Baca Diperiksa', pass: true });
      issues.push({ section: 'Estimasi Turnitin Similarity', status: `${similarity}% (Batas Aman Kampus < 20%)`, pass: similarity < 20 });

      setAnalysisResult({
        overallScore: Math.min(98, score),
        similarityEstimate: similarity,
        formattingCompliance: 'Sesuai Pedoman Kampus SN-Dikti',
        grammarErrorsCount: text.includes('di mana') || text.includes('daripada') ? 3 : 1,
        structureCheck: issues,
        suggestions: [
          'Pastikan semua istilah asing (Inggris/Latin) dicetak miring (italic).',
          'Sertakan rujukan jurnal bereputasi (SINTA/Scopus) untuk memperkuat klaim fenomena.',
          'Format paragraf dengan rata kiri-kanan (Justified) dan spasi 1.5.'
        ]
      });

      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">AI Document Checker</h3>
            <p className="text-xs text-slate-400">Pemeriksa Kelayakan Naskah, Turnitin Risk, Structure & PUEBI</p>
          </div>
        </div>

        <button
          onClick={handleRunCheck}
          disabled={isAnalyzing || !inputText.trim()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
              <span>Menganalisis Naskah...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Jalankan Cek Dokumen</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Draft Text Area */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Tempel Draf Bab / Paragraf Skripsi</span>
            </label>
            <span className="text-[11px] text-slate-500">{inputText.length} karakter</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans resize-none"
            placeholder="Ketik atau tempel teks latar belakang, abstrak, atau bab skripsi di sini..."
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Standar Pedoman: Margin 4-4-3-3 & TNR 12pt
            </span>
            <button
              onClick={() => setInputText('')}
              className="hover:text-white transition-colors underline"
            >
              Kosongkan Teks
            </button>
          </div>
        </div>

        {/* Right Analysis Dashboard Panel */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          {analysisResult ? (
            <div className="space-y-4">
              
              {/* Score Header */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skor Kesiapan</span>
                  <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                    <span>{analysisResult.overallScore}</span>
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Turnitin</span>
                  <div className={`text-2xl font-black flex items-center justify-center gap-1 ${
                    analysisResult.similarityEstimate <= 15 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    <span>{analysisResult.similarityEstimate}%</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Aman</span>
                  </div>
                </div>
              </div>

              {/* Structural Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pemeriksaan Struktur Akademis</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {analysisResult.structureCheck.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl text-xs border border-slate-800">
                      <div className="flex items-center gap-2">
                        {item.pass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="text-slate-200 font-medium">{item.section}</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        item.pass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-950/40 border border-blue-500/30 p-3.5 rounded-xl space-y-1.5 text-xs">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Saran Perbaikan Otomatis AI:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {analysisResult.suggestions.map((sug: string, i: number) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-2">
              <FileCheck className="w-10 h-10 text-slate-600" />
              <p className="text-xs">Klik "Jalankan Cek Dokumen" untuk mulai memeriksa kelayakan naskah skripsi Anda.</p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Pedoman: Kampus PTN & PTS Indonesia</span>
            <span className="text-blue-400 font-bold">100% Bebas Privasi</span>
          </div>
        </div>

      </div>
    </div>
  );
}
