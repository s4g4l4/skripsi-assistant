import React, { useState } from 'react';
import { 
  Layers, Sparkles, CheckCircle2, Copy, Download, 
  ArrowRight, BookOpen, RefreshCw, FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SmartOutlineGenerator() {
  const [researchTopic, setResearchTopic] = useState('Analisis Adopsi Kecerdasan Buatan dalam Pendidikan Tinggi');
  const [fieldOfStudy, setFieldOfStudy] = useState('Sistem Informasi / Teknologi Informasi');
  const [degreeLevel, setDegreeLevel] = useState('Skripsi (S1)');
  const [researchMethod, setResearchMethod] = useState('Kuantitatif (Survei / SEM-PLS)');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<any[] | null>([
    {
      chapterNumber: 'BAB I',
      chapterTitle: 'PENDAHULUAN',
      estimatedPages: '8 - 12 Halaman',
      subsections: [
        '1.1 Latar Belakang Masalah (Latar belakang akademis & data fenomena)',
        '1.2 Identifikasi Masalah & Grounding Realita',
        '1.3 Rumusan Masalah (3 Pertanyaan Penelitian Utama)',
        '1.4 Batasan Penelitian (Fokus & Ruang Lingkup)',
        '1.5 Tujuan Penelitian (Secara Teoritis & Praktis)',
        '1.6 Manfaat Penelitian bagi Civitas Akademika & Industri'
      ]
    },
    {
      chapterNumber: 'BAB II',
      chapterTitle: 'TINJAUAN PUSTAKA & KERANGKA TEORI',
      estimatedPages: '15 - 25 Halaman',
      subsections: [
        '2.1 Landasan Teori Utama (mis. UTAUT 2 / TAM Model)',
        '2.2 Tinjauan Penelitian Terdahulu (10 Jurnal SINTA/Scopus)',
        '2.3 Kerangka Pemikiran & Hubungan Antar Variabel',
        '2.4 Pengembangan Hipotesis Penelitian (H1 s.d. H5)'
      ]
    },
    {
      chapterNumber: 'BAB III',
      chapterTitle: 'METODOLOGI PENELITIAN',
      estimatedPages: '10 - 15 Halaman',
      subsections: [
        '3.1 Jenis & Pendekatan Penelitian',
        '3.2 Popusasi, Sampel, & Teknik Sampling (Slovin / Hair et al.)',
        '3.3 Operasionalisasi Variabel & Skala Likert',
        '3.4 Teknik Pengumpulan Data (Kuesioner Online)',
        '3.5 Uji Validitas, Reliabilitas, & Analisis SEM-PLS'
      ]
    },
    {
      chapterNumber: 'BAB IV',
      chapterTitle: 'HASIL PENELITIAN DAN PEMBAHASAN',
      estimatedPages: '20 - 30 Halaman',
      subsections: [
        '4.1 Gambaran Umum Objek Penelitian & Demografi Responden',
        '4.2 Hasil Uji Measurement Model (Outer Model)',
        '4.3 Hasil Uji Structural Model (Inner Model & R-Square)',
        '4.4 Pembahasan Akademis & Diskusi Hasil dengan Riset Terdahulu'
      ]
    },
    {
      chapterNumber: 'BAB V',
      chapterTitle: 'PENUTUP',
      estimatedPages: '5 - 8 Halaman',
      subsections: [
        '5.1 Kesimpulan (Menjawab Rumusan Masalah)',
        '5.2 Implikasi Manajerial & Kontribusi Teoritis',
        '5.3 Keterbatasan Penelitian & Saran untuk Riset Mendatang'
      ]
    }
  ]);

  const [copied, setCopied] = useState(false);

  const handleGenerateOutline = () => {
    if (!researchTopic.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedOutline([
        {
          chapterNumber: 'BAB I',
          chapterTitle: 'PENDAHULUAN',
          estimatedPages: degreeLevel.includes('S2') ? '12-18 Halaman' : '8-12 Halaman',
          subsections: [
            `1.1 Latar Belakang Masalah (${researchTopic})`,
            '1.2 Research Gap & Fenomena Kebaruan',
            '1.3 Rumusan Masalah Spesifik',
            '1.4 Tujuan & Manfaat Penelitian'
          ]
        },
        {
          chapterNumber: 'BAB II',
          chapterTitle: 'TINJAUAN PUSTAKA',
          estimatedPages: '15-25 Halaman',
          subsections: [
            `2.1 Teori Dasar (${fieldOfStudy})`,
            '2.2 Tinjauan Penelitian Terdahulu (SINTA/Scopus)',
            '2.3 Kerangka Konseptual'
          ]
        },
        {
          chapterNumber: 'BAB III',
          chapterTitle: 'METODE PENELITIAN',
          estimatedPages: '10-15 Halaman',
          subsections: [
            `3.1 Pendekatan ${researchMethod}`,
            '3.2 Popusasi & Teknik Sampling',
            '3.3 Teknik Pengumpulan & Analisis Data'
          ]
        },
        {
          chapterNumber: 'BAB IV',
          chapterTitle: 'HASIL & PEMBAHASAN',
          estimatedPages: '20-30 Halaman',
          subsections: [
            '4.1 Deskripsi Data & Responden',
            '4.2 Hasil Uji Hipotesis',
            '4.3 Pembahasan Temuan'
          ]
        },
        {
          chapterNumber: 'BAB V',
          chapterTitle: 'KESIMPULAN & SARAN',
          estimatedPages: '5-8 Halaman',
          subsections: [
            '5.1 Kesimpulan Utama',
            '5.2 Implikasi & Saran Riset Selanjutnya'
          ]
        }
      ]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopyOutline = () => {
    if (!generatedOutline) return;
    let text = `SMART OUTLINE PENELITIAN\nTopik: ${researchTopic}\nProgram: ${degreeLevel}\n\n`;
    generatedOutline.forEach(ch => {
      text += `${ch.chapterNumber}: ${ch.chapterTitle} (${ch.estimatedPages})\n`;
      ch.subsections.forEach((sub: string) => {
        text += `  - ${sub}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl border border-orange-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Smart Outline Generator</h3>
            <p className="text-xs text-slate-400">Generator Kerangka Bab & Sub-Bab Otomatis Sesuai Jenjang Studi</p>
          </div>
        </div>

        {generatedOutline && (
          <button
            onClick={handleCopyOutline}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-slate-700"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
            <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Outline'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Judul / Topik Penelitian</label>
            <textarea
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-medium"
              placeholder="Tuliskan topik atau ide judul skripsi di sini..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Bidang Ilmu</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Jenjang Studi</label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
              >
                <option value="Proposal (S1)">Proposal (S1)</option>
                <option value="Skripsi (S1)">Skripsi (S1)</option>
                <option value="Tesis (S2)">Tesis (S2)</option>
                <option value="Disertasi (S3)">Disertasi (S3)</option>
                <option value="Jurnal SINTA">Artikel Jurnal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pendekatan</label>
              <select
                value={researchMethod}
                onChange={(e) => setResearchMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
              >
                <option value="Kuantitatif (Survei / SEM-PLS)">Kuantitatif</option>
                <option value="Kualitatif (Studi Kasus)">Kualitatif</option>
                <option value="R&D / Pengembangan Software">R&D Software</option>
                <option value="Eksperimen Laboratorium">Eksperimen</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateOutline}
            disabled={isGenerating || !researchTopic.trim()}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-orange-200" />
                <span>Merancang Kerangka...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-200" />
                <span>Generate Smart Outline</span>
              </>
            )}
          </button>
        </div>

        {/* Right Generated Outline Cards */}
        <div className="lg:col-span-7 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          {generatedOutline ? (
            generatedOutline.map((ch, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-400 font-black text-xs rounded-md border border-orange-500/20">
                      {ch.chapterNumber}
                    </span>
                    <h4 className="font-bold text-sm text-white">{ch.chapterTitle}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                    {ch.estimatedPages}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {ch.subsections.map((sub: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
              <Layers className="w-10 h-10 text-slate-600" />
              <p className="text-xs">Isi topik lalu klik "Generate Smart Outline".</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
