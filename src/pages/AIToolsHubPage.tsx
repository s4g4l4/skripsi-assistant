import React, { useState } from 'react';
import { 
  Sparkles, Search, ChevronLeft, ArrowRight, CheckCircle2, 
  Lightbulb, BookOpen, FileText, Layers, Share2, HelpCircle, 
  BarChart2, Code, FileCheck, RefreshCw, Wand2, Calculator, 
  MessageSquare, Sliders, Globe, ShieldCheck, Download, Copy,
  Bot, Eye, PieChart, Users, FileSpreadsheet, Presentation, Layout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export interface AIToolItem {
  id: string;
  name: string;
  category: 'Perencanaan & Judul' | 'Bab & Struktur Naskah' | 'Pengolah Teks & Bahasa' | 'Analisis Data & Metodologi' | 'Riset & Referensi' | 'Sidang & Presentasi';
  description: string;
  icon: any;
  badge?: string;
  color: string; // bg-emerald-500, bg-blue-500, etc.
}

export const ALL_44_AI_TOOLS: AIToolItem[] = [
  // 1. Perencanaan & Judul
  {
    id: 'kerangka-berpikir',
    name: 'Diagram Kerangka Berpikir',
    category: 'Perencanaan & Judul',
    description: 'Buat diagram khusus untuk menggambarkan kerangka berpikir pada penelitian.',
    icon: Layers,
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'generator-judul',
    name: 'Generator Judul Penelitian',
    category: 'Perencanaan & Judul',
    description: 'Hasilkan judul yang relevan dan menarik sesuai preferensi.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'generator-proposal',
    name: 'Generator Proposal Penelitian',
    category: 'Perencanaan & Judul',
    description: 'Buat draft proposal penelitian lengkap secara otomatis.',
    icon: FileText,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'pemilihan-metode',
    name: 'Pemilihan Metode Penelitian',
    category: 'Perencanaan & Judul',
    description: 'Dapatkan metode penelitian sesuai dengan pendekatan dan tujuan studi.',
    icon: Sliders,
    color: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'generator-batasan',
    name: 'Generator Batasan Penelitian',
    category: 'Perencanaan & Judul',
    description: 'Susun fokus riset agar tidak terlalu luas dan berikan justifikasi kuat mengapa aspek tertentu tidak diteliti.',
    icon: ShieldCheck,
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'generator-hipotesis',
    name: 'Generator Hipotesis',
    category: 'Perencanaan & Judul',
    description: 'Rumuskan hipotesis penelitian sesuai variabel dan asumsi awal.',
    icon: HelpCircle,
    color: 'from-violet-600 to-indigo-600'
  },
  {
    id: 'generator-outline',
    name: 'Generator Outline Penelitian',
    category: 'Perencanaan & Judul',
    description: 'Buat gambaran rencana penelitian secara menyeluruh beserta referensi pendukung.',
    icon: Layout,
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'target-riset',
    name: 'Generator Target Riset',
    category: 'Perencanaan & Judul',
    description: 'Definisikan subjek dan objek penelitian dengan presisi sesuai akademik.',
    icon: Users,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'variabel-bebas',
    name: 'Generator Variabel Bebas',
    category: 'Perencanaan & Judul',
    description: 'Membantu menemukan variabel bebas berdasarkan variabel terikat atau variabel dependen.',
    icon: Sliders,
    color: 'from-emerald-600 to-green-500'
  },

  // 2. Bab & Struktur Naskah
  {
    id: 'latar-belakang',
    name: 'Generator Latar Belakang',
    category: 'Bab & Struktur Naskah',
    description: 'Rumuskan konteks dan urgensi topik penelitian secara ringkas dan sistematis.',
    icon: FileText,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'identifikasi-masalah',
    name: 'Generator Identifikasi & Rumusan Masalah',
    category: 'Bab & Struktur Naskah',
    description: 'Buat identifikasi dan rumusan masalah berdasarkan teks latar belakang yang telah disusun.',
    icon: HelpCircle,
    color: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'tujuan-manfaat',
    name: 'Generator Tujuan & Manfaat',
    category: 'Bab & Struktur Naskah',
    description: 'Susun tujuan dan manfaat penelitian sesuai standar penulisan akademik.',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'landasan-teori',
    name: 'Generator Landasan Teori',
    category: 'Bab & Struktur Naskah',
    description: 'Temukan relevansi teori dengan topik yang dipilih.',
    icon: BookOpen,
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'research-gap',
    name: 'Generator Research Gap & Novelty',
    category: 'Bab & Struktur Naskah',
    description: 'Temukan celah penelitian (research gap) dan kebaruan (novelty) dari artikel-artikel penelitian terdahulu.',
    icon: Sparkles,
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'tinjauan-pustaka',
    name: 'Generator Tinjauan Pustaka',
    category: 'Bab & Struktur Naskah',
    description: 'Menyusun narasi tinjauan pustaka berdasarkan topik dan referensi yang dimasukkan dalam format ilmiah.',
    icon: BookOpen,
    color: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'kesimpulan-saran',
    name: 'Generator Kesimpulan & Saran',
    category: 'Bab & Struktur Naskah',
    description: 'Rangkum hasil dan temuan penelitian ke dalam bentuk kesimpulan dan saran akademik.',
    icon: CheckCircle2,
    color: 'from-green-600 to-emerald-500'
  },
  {
    id: 'generator-abstrak',
    name: 'Generator Abstrak Penelitian',
    category: 'Bab & Struktur Naskah',
    description: 'Membantu membuat abstrak secara otomatis dari teks draft penelitian.',
    icon: FileCheck,
    color: 'from-blue-600 to-teal-500'
  },
  {
    id: 'kata-pengantar',
    name: 'Generator Kata Pengantar',
    category: 'Bab & Struktur Naskah',
    description: 'Sajikan kata pengantar dengan sentuhan personal dan kaidah penulisan karya tulis secara umum.',
    icon: FileText,
    color: 'from-indigo-500 to-purple-500'
  },

  // 3. Pengolah Teks & Bahasa
  {
    id: 'parafrase-paragraf',
    name: 'Parafrase Paragraf',
    category: 'Pengolah Teks & Bahasa',
    description: 'Ubah kalimat menjadi versi berbeda untuk menghindari plagiarisme.',
    icon: RefreshCw,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'penerjemah-akademik',
    name: 'Penerjemah Akademik',
    category: 'Pengolah Teks & Bahasa',
    description: 'Terjemahkan teks ilmiah dengan mempertahankan konteks dan terminologi bidang studi.',
    icon: Globe,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'pengembang-teks',
    name: 'Asisten Pengembang Teks',
    category: 'Pengolah Teks & Bahasa',
    description: 'Perluas penjelasan risetmu secara otomatis dengan tambahan teks dan sitasi yang relevan.',
    icon: Wand2,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'ringkasan-teks',
    name: 'Ringkasan Teks Otomatis',
    category: 'Pengolah Teks & Bahasa',
    description: 'Buat ringkasan dari teks artikel ilmiah, berita, dokumen, dan media lainnya dalam hitungan detik.',
    icon: FileText,
    color: 'from-amber-600 to-orange-500'
  },
  {
    id: 'ringkasan-artikel-web',
    name: 'Ringkasan Artikel Web',
    category: 'Pengolah Teks & Bahasa',
    description: 'Copy-paste link artikel web dan aplikasi AI akan buat ringkasan dalam hitungan detik!',
    icon: Globe,
    color: 'from-indigo-600 to-blue-500'
  },
  {
    id: 'ai-to-human',
    name: 'AI to Human Text Optimizer',
    category: 'Pengolah Teks & Bahasa',
    description: 'Optimasi teks hasil AI agar terasa lebih alami, ekspresif, dan sesuai gaya bahasa manusia.',
    icon: Bot,
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'pemeriksa-plagiarisme',
    name: 'Pemeriksa Plagiarisme',
    category: 'Pengolah Teks & Bahasa',
    description: 'Mendeteksi kesamaan isi untuk menghindari plagiarisme dalam teks paragraf.',
    icon: ShieldCheck,
    color: 'from-red-600 to-rose-600'
  },
  {
    id: 'pemeriksa-tata-bahasa',
    name: 'Pemeriksa Tata Bahasa',
    category: 'Pengolah Teks & Bahasa',
    description: 'Meninjau dan memperbaiki tata bahasa dan diksi akademik.',
    icon: FileCheck,
    color: 'from-teal-600 to-green-600'
  },

  // 4. Analisis Data & Metodologi
  {
    id: 'asisten-visualisasi',
    name: 'Asisten Visualisasi Data',
    category: 'Analisis Data & Metodologi',
    description: 'Temukan rekomendasi visualisasi data (seperti diagram batang, garis, pie, scatter, dsb) berdasarkan kebutuhan.',
    icon: PieChart,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'analisis-statistik',
    name: 'Asisten Analisis Statistik',
    category: 'Analisis Data & Metodologi',
    description: 'Memberikan saran metode analisis dan membantu interpretasi hasil statistik.',
    icon: BarChart2,
    color: 'from-purple-600 to-violet-600'
  },
  {
    id: 'interpretasi-olah-data',
    name: 'Interpretasi Hasil Olah Data',
    category: 'Analisis Data & Metodologi',
    description: 'Upload gambar atau screenshot hasil olah data, lalu AI akan membantu membuat interpretasi hasil olah data.',
    icon: FileSpreadsheet,
    color: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'kalkulator-sampel',
    name: 'Kalkulator Sampel Penelitian',
    category: 'Analisis Data & Metodologi',
    description: 'Hitung jumlah sampel dengan rumus yang umum digunakan sesuai dengan populasi dan jenis penelitian (Slovin/Hair).',
    icon: Calculator,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'kuesioner-penelitian',
    name: 'Generator Kuesioner Penelitian',
    category: 'Analisis Data & Metodologi',
    description: 'Rancang pertanyaan survei berdasarkan tujuan dan variabel penelitian.',
    icon: FileCheck,
    color: 'from-indigo-600 to-blue-500'
  },
  {
    id: 'pedoman-wawancara',
    name: 'Generator Pedoman Wawancara',
    category: 'Analisis Data & Metodologi',
    description: 'Buat pedoman wawancara yang lengkap dan terstruktur dalam waktu singkat, cocok untuk penelitian kualitatif.',
    icon: MessageSquare,
    color: 'from-cyan-600 to-teal-600'
  },
  {
    id: 'analisis-transkrip',
    name: 'Analisis Teks Transkrip',
    category: 'Analisis Data & Metodologi',
    description: 'Membantu menganalisis data transkrip hingga menjadi wawasan untuk penelitian kualitatif.',
    icon: FileText,
    color: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'kode-riset',
    name: 'Generator Kode Riset',
    category: 'Analisis Data & Metodologi',
    description: 'Buat kode otomatis untuk kebutuhan riset dan analisis data (Python/R/SPSS) hanya dengan sekali klik.',
    icon: Code,
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'deskripsi-gambar',
    name: 'Generator Deskripsi Gambar',
    category: 'Analisis Data & Metodologi',
    description: 'Dapatkan penjelasan lengkap mengenai gambar atau foto yang ingin diteliti atau dicari tahu.',
    icon: Eye,
    color: 'from-rose-500 to-red-500'
  },

  // 5. Riset & Referensi
  {
    id: 'pencari-artikel',
    name: 'Pencari Artikel Ilmiah',
    category: 'Riset & Referensi',
    description: 'Dapatkan referensi dan rangkuman otomatis artikel ilmiah sesuai topik penelitian.',
    icon: BookOpen,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'pencari-buku',
    name: 'Pencari Buku',
    category: 'Riset & Referensi',
    description: 'Temukan daftar buku yang sesuai dengan preferensi genre, topik, dan tingkat membaca.',
    icon: BookOpen,
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'pembuatan-daftar-pustaka',
    name: 'Pembuatan Daftar Pustaka',
    category: 'Riset & Referensi',
    description: 'Menghasilkan daftar pustaka otomatis dalam berbagai format (APA, MLA, Chicago, IEEE, dll).',
    icon: FileText,
    color: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'asisten-riset',
    name: 'Asisten Riset',
    category: 'Riset & Referensi',
    description: 'Cari informasi dari berbagai topik dalam waktu singkat.',
    icon: Search,
    color: 'from-purple-600 to-indigo-600'
  },

  // 6. Sidang & Presentasi
  {
    id: 'pertanyaan-sidang',
    name: 'Generator Pertanyaan Sidang',
    category: 'Sidang & Presentasi',
    description: 'Ubah draft penulisan riset menjadi daftar pertanyaan penguji beserta rekomendasi jawaban yang mendukung.',
    icon: HelpCircle,
    color: 'from-rose-600 to-red-600'
  },
  {
    id: 'konversi-artikel',
    name: 'Konversi ke Artikel Ilmiah',
    category: 'Sidang & Presentasi',
    description: 'Susun ulang teks penulisan skripsi, tesis, ataupun disertasi ke format artikel ilmiah secara instan.',
    icon: FileText,
    color: 'from-blue-600 to-teal-600'
  },
  {
    id: 'penyusun-slide',
    name: 'Penyusun Konten Slide',
    category: 'Sidang & Presentasi',
    description: 'Membantu menyusun isi presentasi dalam format poin-poin untuk setiap slide.',
    icon: Presentation,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'review-draft',
    name: 'Review Draft Penelitian',
    category: 'Sidang & Presentasi',
    description: 'Uji kelayakan penelitian secara mendalam dan otomatis untuk perbaikan penulisan.',
    icon: FileCheck,
    color: 'from-emerald-600 to-green-600'
  },
  {
    id: 'thesis-to-slide',
    name: 'Thesis to Slide',
    category: 'Sidang & Presentasi',
    description: 'Ubah draft penelitian menjadi konten slide untuk presentasi dalam hitungan detik.',
    icon: Presentation,
    color: 'from-indigo-600 to-purple-600'
  }
];

export default function AIToolsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Category');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<AIToolItem | null>(null);
  
  // Modal generator state
  const [inputVal, setInputVal] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    'Semua Category',
    'Perencanaan & Judul',
    'Bab & Struktur Naskah',
    'Pengolah Teks & Bahasa',
    'Analisis Data & Metodologi',
    'Riset & Referensi',
    'Sidang & Presentasi'
  ];

  const filteredTools = ALL_44_AI_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'Semua Category' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenTool = (tool: AIToolItem) => {
    setActiveTool(tool);
    setInputVal('');
    setSecondaryInput('');
    setAiResult(null);
  };

  const handleRunTool = () => {
    if (!inputVal.trim() && !activeTool?.id.includes('kalkulator')) {
      setInputVal('Analisis Dampak Kecerdasan Buatan terhadap Pendidikan Tinggi');
    }
    
    setIsProcessing(true);
    setAiResult(null);

    setTimeout(() => {
      let mockRes = '';
      const toolId = activeTool?.id || '';
      const topic = inputVal || 'Analisis Dampak Artificial Intelligence pada Pendidikan Tinggi';

      if (toolId === 'kerangka-berpikir') {
        mockRes = `DIAGRAM KERANGKA BERPIKIR (RESEARCH CONCEPTUAL FRAMEWORK)\n\n` +
          `[ VARIABEL INDEPENDEN (X) ]\n` +
          `  ├── X1: Persepsi Kemudahan Penggunaan AI\n` +
          `  └── X2: Dukungan Infrastruktur Kampus\n` +
          `           │\n` +
          `           ▼  (Dianalisis melalui Uji SEM-PLS)\n` +
          `[ VARIABEL MEDIASI (M) ]\n` +
          `  └── M: Motivasi Belajar Mandiri Mahasiswa\n` +
          `           │\n` +
          `           ▼\n` +
          `[ VARIABEL DEPENDEN (Y) ]\n` +
          `  └── Y: Efektivitas Penyusunan Karya Tulis Ilmiah\n\n` +
          `*Diagram di atas menggambarkan alur hubungan antar variabel sesuai hipotesis H1 s.d. H4.`;
      } else if (toolId.includes('judul')) {
        mockRes = `3 REKOMENDASI JUDUL SKRIPSI RELEVAN:\n\n` +
          `1. Analisis Pengaruh ${topic} terhadap Peningkatan Efisiensi Akademis Mahasiswa S1\n` +
          `2. Implementasi Model SEM-PLS dalam Mengukur Adopsi ${topic} pada PTN & PTS di Indonesia\n` +
          `3. Evaluasi Kritis dan Strategi Mitigasi Risiko Implementasi ${topic} di Sektor Pendidikan`;
      } else if (toolId === 'kalkulator-sampel') {
        mockRes = `HASIL PERHITUNGAN KEBUTUHAN SAMPEL PENELITIAN (RUMUS SLOVIN):\n\n` +
          `• Populasi Total (N): ${inputVal || '1000'} Responden\n` +
          `• Tingkat Toleransi Error (e): 5% (0.05)\n` +
          `• Formula: n = N / (1 + N(e)²)\n` +
          `• Jumlah Sampel Minimal (n): 286 Responden\n\n` +
          `Saran Akademis: Tambahkan margin aman 10% (315 sampel) untuk mengantisipasi kuesioner yang gugur/tidak lengkap.`;
      } else if (toolId === 'ai-to-human') {
        mockRes = `HASIL OPTIMASI TEKS AI TO HUMAN (NATURAL ACADEMIC VOICE):\n\n` +
          `"Penelitian ini secara mendalam mengkaji bagaimana integrasi teknologi kecerdasan buatan mampu mentransformasi pola interaksi akademis mahasiswa. Berdasarkan hasil pengamatan di lapangan, fleksibilitas akses informasi menjadi faktor paling dominan yang mendorong percepatan penyelesaian tugas akhir."`;
      } else {
        mockRes = `HASIL GENERATOR AI UNTUK "${activeTool?.name.toUpperCase()}":\n\n` +
          `Berdasarkan masukan "${topic}", sistem AI Dukun Skripsi telah merumuskan draf akademis terstruktur:\n\n` +
          `1. Konteks Akademis: ${topic} memiliki urgensi tinggi untuk diteliti dalam konteks dinamika saat ini.\n` +
          `2. Implikasi & Kebaruan: Mengisi kesenjangan riset terdahulu dengan menyajikan bukti empiris terbaru.\n` +
          `3. Rekomendasi Lanjutan: Draf siap diterapkan ke dalam bab naskah utama atau disesuaikan dengan template perguruan tinggi Anda.`;
      }

      setAiResult(mockRes);
      setIsProcessing(false);
    }, 1200);
  };

  const handleCopyResult = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all border border-slate-800 mb-2"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-400" />
          <span>Kembali ke Dashboard Utama</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider block mx-auto w-fit">
          <Wand2 className="w-4 h-4 text-emerald-400" />
          <span>44 Generator AI Skripsi & Riset Lengkap</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pusat Tools AI & Generator Penelitian
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Semua 44 generator AI di bawah ini siap membantu setiap tahap riset Anda mulai dari kerangka berpikir, latar belakang, hipotesis, hingga konversi ke slide sidang.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-4 max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari fitur AI (misal: Diagram Kerangka Berpikir, Hipotesis, Abstrak)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-slate-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => handleOpenTool(tool)}
              className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 cursor-pointer shadow-xl group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-md`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  {tool.badge && (
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-black rounded uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1 line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Gunakan Tool AI Ini</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${activeTool.color} text-white`}>
                    <activeTool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{activeTool.name}</h3>
                    <p className="text-xs text-slate-400">{activeTool.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTool(null)}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {activeTool.description}
              </p>

              {/* Tool Input Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    {activeTool.id === 'kalkulator-sampel' ? 'Jumlah Populasi Total (N)' : 'Topik / Draf Penelitian'}
                  </label>
                  <textarea
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    rows={3}
                    placeholder={
                      activeTool.id === 'kalkulator-sampel' ? 'Contoh: 1000' : 
                      'Ketik atau tempel topik, judul, atau paragraf di sini...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <button
                  onClick={handleRunTool}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Jalankan {activeTool.name}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Result */}
              {aiResult && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Hasil AI Generated:
                    </span>
                    <button
                      onClick={handleCopyResult}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-800 flex items-center gap-1 transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Hasil'}</span>
                    </button>
                  </div>

                  <pre className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 max-h-60 overflow-y-auto custom-scrollbar">
                    {aiResult}
                  </pre>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Tutup Tool
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
