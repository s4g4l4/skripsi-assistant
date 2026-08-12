import React, { useState } from 'react';
import { 
  BookOpen, FileText, CheckCircle2, AlertTriangle, Info, 
  HelpCircle, Scale, GraduationCap, Award, Search, Sparkles, Check, ArrowRight
} from 'lucide-react';

export interface PageStandardItem {
  id: string;
  category: 'proposal' | 'semhas' | 'skripsi' | 'tesis' | 'disertasi' | 'jurnal';
  title: string;
  level: string;
  minPages: number;
  maxPages: number;
  idealPages: string;
  wordCountEstimate: string;
  lineSpacing: string;
  marginStandard: string;
  structure: string[];
  regulationsNote: string;
  commonErrors: string[];
  tips: string;
}

export const INDONESIAN_PAGE_STANDARDS: PageStandardItem[] = [
  {
    id: 'prop-s1',
    category: 'proposal',
    title: 'Proposal Skripsi (Sarjana / S1)',
    level: 'S1 (Sarjana)',
    minPages: 10,
    maxPages: 15,
    idealPages: '10 - 15 Halaman',
    wordCountEstimate: '3.000 - 5.000 kata',
    lineSpacing: '1.5 Spasi (Times New Roman 12pt)',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm',
    structure: [
      'BAB I: Pendahuluan (Latar Belakang, Rumusan Masalah, Tujuan, Manfaat) (~3-4 hal)',
      'BAB II: Tinjauan Pustaka / Landasan Teori & Kerangka Berpikir (~4-6 hal)',
      'BAB III: Metodologi Penelitian (~3-5 hal)',
      'Daftar Pustaka & Lampiran Awal (Instrumen)'
    ],
    regulationsNote: 'Berdasarkan pengalaman umum. Tidak ada patokan tunggal untuk proposal penelitian.',
    commonErrors: [
      'Bab II terlalu tebal melebihi 10 halaman padahal baru tahap proposal',
      'Metode penelitian terlalu ringkas (kurang dari 2 halaman)',
      'Latar belakang tidak mencantumkan fenomena atau data lapangan'
    ],
    tips: 'Sajikan latar belakang yang lugas dan fokus pada urgensi serta kesiapan metode.'
  },
  {
    id: 'prop-s2',
    category: 'proposal',
    title: 'Proposal Tesis (Magister / S2)',
    level: 'S2 (Magister)',
    minPages: 15,
    maxPages: 25,
    idealPages: '15 - 25 Halaman',
    wordCountEstimate: '5.000 - 8.000 kata',
    lineSpacing: '1.5 Spasi (Times New Roman 12pt)',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm',
    structure: [
      'BAB I: Pendahuluan & State of the Art (~4-6 hal)',
      'BAB II: Tinjauan Pustaka & Kerangka Konseptual (~6-10 hal)',
      'BAB III: Metode Penelitian & Analisis Data (~5-9 hal)',
      'Daftar Pustaka (Minimal 30 referensi jurnal terakreditasi)'
    ],
    regulationsNote: 'Biasanya lebih panjang dari proposal skripsi, menuntut pendalaman State of the Art.',
    commonErrors: [
      'State of the Art kurang memeta jurnal terbitan 5 tahun terakhir',
      'Definisi operasional variabel kurang mendalam'
    ],
    tips: 'Gunakan referensi dari jurnal terakreditasi SINTA 1-2 atau Scopus.'
  },
  {
    id: 'prop-s3',
    category: 'proposal',
    title: 'Proposal Disertasi (Doktor / S3)',
    level: 'S3 (Doktor)',
    minPages: 25,
    maxPages: 40,
    idealPages: '25 - 40 Halaman',
    wordCountEstimate: '8.000 - 14.000 kata',
    lineSpacing: '1.5 Spasi / 2.0 Spasi',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm',
    structure: [
      'BAB I: Pendahuluan & Kebaruan Ilmiah (Novelty) (~6-10 hal)',
      'BAB II: Kajian Teori Kritis & Sintesis Literatur (~10-16 hal)',
      'BAB III: Metodologi Penelitian Multidisiplin (~9-14 hal)',
      'Roadmap Penelitian & Rencana Publikasi Scopus'
    ],
    regulationsNote: 'Proposal untuk jenjang doktoral yang paling komprehensif dan berfokus pada pembuktian Novelty.',
    commonErrors: [
      'Gagal merumuskan kebaruan (novelty) yang membedakan dengan riset terdahulu',
      'Tinjauan pustaka bersifat narasi umum tanpa sintesis kritis'
    ],
    tips: 'Sajikan tabel matriks komparasi jurnal terdahulu untuk menegaskan posisi kebaruan riset.'
  },
  {
    id: 'semhas-s1',
    category: 'semhas',
    title: 'Seminar Hasil (Semhas)',
    level: 'S1, S2, & S3 (Makalah Semhas)',
    minPages: 10,
    maxPages: 12,
    idealPages: 'Maksimal 10 - 12 Halaman',
    wordCountEstimate: '3.500 - 5.000 kata',
    lineSpacing: '1.5 Spasi / 1.0 Spasi (sesuai aturan kampus)',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm (atau template makalah)',
    structure: [
      'Ringkasan Bab I-III Pendahuluan & Metode (~3-4 hal)',
      'Hasil Penelitian & Analisis Data Utama (~5-6 hal)',
      'Pembahasan & Kesimpulan (~2 hal)'
    ],
    regulationsNote: 'Fokus pada substansi penelitian. Di beberapa universitas, batasan ini berlaku khusus untuk makalah yang dipresentasikan.',
    commonErrors: [
      'Memuat seluruh isi bab skripsi tanpa dipadatkan menjadi bentuk makalah ringkas',
      'Pembahasan hasil tidak memadai karena terlalu banyak tabel polos'
    ],
    tips: 'Fokuskan presentasi pada temuan utama (Bab IV) dan jawaban atas pertanyaan penelitian.'
  },
  {
    id: 'skripsi-full',
    category: 'skripsi',
    title: 'Skripsi (S1)',
    level: 'S1 (Sarjana)',
    minPages: 40,
    maxPages: 100,
    idealPages: '40 - 100 Halaman (isi Bab I-V)',
    wordCountEstimate: '12.000 - 25.000 kata',
    lineSpacing: '1.5 Spasi (Times New Roman 12pt / Arial 11pt)',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm (Aturan 4-4-3-3)',
    structure: [
      'Bagian Awal: Halaman Cover, Pengesahan, Abstrak, Kata Pengantar, Daftar Isi',
      'BAB I: Pendahuluan (~6-10 hal)',
      'BAB II: Tinjauan Pustaka (~15-25 hal)',
      'BAB III: Metode Penelitian (~8-12 hal)',
      'BAB IV: Hasil Penelitian & Pembahasan (~20-40 hal)',
      'BAB V: Kesimpulan & Saran (~4-6 hal)',
      'Bagian Akhir: Daftar Pustaka & Lampiran'
    ],
    regulationsNote: 'Batas ini tidak termasuk lampiran. Jumlah halaman minimal 45 halaman di beberapa perguruan tinggi.',
    commonErrors: [
      'Jumlah halaman kurang dari 40-45 halaman sehingga dianggap kurang mendalam',
      'Memasukkan data mentah kuesioner ke dalam bab utama (harusnya di lampiran)',
      'Format penomoran halaman tidak sesuai (posisi romawi vs angka arab)'
    ],
    tips: 'Sertakan data mentah dan output statistik di bagian Lampiran, bukan di Bab IV isi utama.'
  },
  {
    id: 'tesis-full',
    category: 'tesis',
    title: 'Tesis (S2)',
    level: 'S2 (Magister)',
    minPages: 100,
    maxPages: 150,
    idealPages: '100 - 150 Halaman',
    wordCountEstimate: '25.000 - 40.000 kata',
    lineSpacing: '1.5 Spasi / 2.0 Spasi',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm',
    structure: [
      'BAB I: Pendahuluan (~10-15 hal)',
      'BAB II: Tinjauan Pustaka & Sintesis Teori (~30-45 hal)',
      'BAB III: Metode Penelitian (~15-20 hal)',
      'BAB IV: Hasil Analisis & Pembahasan Mendalam (~35-55 hal)',
      'BAB V: Kesimpulan, Implikasi & Saran (~8-12 hal)',
      'Daftar Pustaka & Draft Publikasi Jurnal'
    ],
    regulationsNote: 'Merupakan karya yang lebih mendalam dari skripsi.',
    commonErrors: [
      'Analisis terlalu dangkal setara S1 tanpa kontribusi konseptual yang jelas',
      'Literatur kurang memperbarui jurnal 5 tahun terakhir'
    ],
    tips: 'Pastikan Bab IV memadukan temuan data dengan teori di Bab II secara analitis.'
  },
  {
    id: 'disertasi-full',
    category: 'disertasi',
    title: 'Disertasi (S3)',
    level: 'S3 (Doktor)',
    minPages: 150,
    maxPages: 300,
    idealPages: '150 - 300 Halaman',
    wordCountEstimate: '40.000 - 75.000 kata',
    lineSpacing: '1.5 Spasi / 2.0 Spasi',
    marginStandard: 'Kiri: 4 cm, Atas: 4 cm, Kanan: 3 cm, Bawah: 3 cm',
    structure: [
      'BAB I: Pendahuluan & Kebaruan Ilmiah (~15-25 hal)',
      'BAB II: Tinjauan Teori Kritis & Pemetaan Literatur (~40-75 hal)',
      'BAB III: Metodologi Penelitian Mendalam (~20-35 hal)',
      'BAB IV: Temuan Kebaruan (Novelty) & Pembahasan Sintesis (~60-120 hal)',
      'BAB V: Model/Teori Baru & Implikasi Kebijakan (~15-25 hal)',
      'Daftar Pustaka & Bukti Luaran Jurnal Scopus'
    ],
    regulationsNote: 'Karya terpanjang dan paling mendalam untuk jenjang doktoral.',
    commonErrors: [
      'Gagal menghasilkan model atau kebaruan teori yang diakui promotor/penguji'
    ],
    tips: 'Fokus pada penyusunan Bab IV dan kesimpulan model baru yang teruji.'
  },
  {
    id: 'jurnal-ilmiah',
    category: 'jurnal',
    title: 'Jurnal Ilmiah (Nasional / Internasional)',
    level: 'SINTA / Scopus / DOAJ',
    minPages: 10,
    maxPages: 22,
    idealPages: 'Bervariasi per jurnal (Contoh: 10-15 / 10-22 hal)',
    wordCountEstimate: '4.000 - 8.000 kata',
    lineSpacing: '1.0 Spasi (Tunggal) - Format 1 atau 2 Kolom',
    marginStandard: 'Sesuai Template OJS / Author Guidelines Jurnal Target',
    structure: [
      'Judul, Penulis & Afiliasi, Email Korespondensi',
      'Abstrak (150-250 kata) & Keywords',
      '1. PENDAHULUAN (Introduction)',
      '2. METODE PENELITIAN (Methods)',
      '3. HASIL DAN PEMBAHASAN (Results & Discussion)',
      '4. KESIMPULAN (Conclusion)',
      'DAFTAR PUSTAKA (References)'
    ],
    regulationsNote: 'Sangat spesifik per jurnal. Contoh: 10-15 halaman, 10-22 halaman, atau 10-15 halaman.',
    commonErrors: [
      'Tidak mengikuti template OJS jurnal target',
      'Pendahuluan terlalu panjang seperti bab skripsi'
    ],
    tips: 'Gunakan Reference Manager (Mendeley/Zotero) dan sesuaikan gaya selingkung jurnal target.'
  }
];

export default function IndonesianPageStandards() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Validator State
  const [calcDocType, setCalcDocType] = useState<string>('skripsi-full');
  const [calcPageInput, setCalcPageInput] = useState<number>(60);

  const filteredStandards = INDONESIAN_PAGE_STANDARDS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.regulationsNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCalcItem = INDONESIAN_PAGE_STANDARDS.find(i => i.id === calcDocType) || INDONESIAN_PAGE_STANDARDS[4];

  const getComplianceStatus = (pages: number, min: number, max: number) => {
    if (pages < min) {
      return {
        status: 'too_short',
        label: 'Terlalu Pendek (Di Bawah Standar Minimal)',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        badge: 'Kurang ' + (min - pages) + ' Halaman',
        icon: AlertTriangle,
        advice: `Halaman Anda (${pages} hal) masih di bawah batas minimal (${min} hal). Pertimbangkan memperdalam Bab IV (Pembahasan) atau memperkuat Tinjauan Pustaka di Bab II.`
      };
    } else if (pages > max) {
      return {
        status: 'too_long',
        label: 'Terlalu Tebal (Melebihi Batas Maksimal)',
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        badge: 'Kelebihan ' + (pages - max) + ' Halaman',
        icon: AlertTriangle,
        advice: `Halaman Anda (${pages} hal) melebihi batas maksimal (${max} hal). Ringkas kalimat berulang dan pindahkan data mentah/lampiran besar dari Bab Utama ke bagian Lampiran.`
      };
    } else {
      return {
        status: 'ideal',
        label: 'Sesuai Standar Ideal Akademik Indonesia',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        badge: 'Sesuai Standar PTN/PTS RI',
        icon: CheckCircle2,
        advice: `Selamat! Jumlah halaman Anda (${pages} hal) berada pada kisaran ideal (${min} - ${max} hal). Fokus pada kualitas substansi, argumen, dan format sitasi.`
      };
    }
  };

  const calcResult = getComplianceStatus(calcPageInput, activeCalcItem.minPages, activeCalcItem.maxPages);

  return (
    <div className="space-y-8 text-slate-200 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>Standar Ketentuan Panjang Karya Tulis Ilmiah Indonesia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ketentuan Panjang Halaman Karya Ilmiah RI
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Acuan resmi jumlah halaman untuk <span className="text-emerald-400 font-semibold">Proposal, Seminar Hasil, Skripsi (S1), Tesis (S2), Disertasi (S3)</span>, dan <span className="text-indigo-300 font-semibold">Jurnal Ilmiah</span> sesuai standar perguruan tinggi di Indonesia.
          </p>
        </div>
      </div>

      {/* OFFICIAL SUMMARY TABLE ACCORDING TO USER SPECIFICATION */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Tabel Standar Ketentuan Panjang Halaman</h3>
              <p className="text-xs text-slate-400">Ringkasan acuan minimal - maksimal halaman & catatan penting akademik</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
            Resmi RI
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="py-3 px-4 font-bold text-indigo-300 w-1/4">Jenis Karya Ilmiah</th>
                <th className="py-3 px-4 font-bold text-emerald-300 w-1/3">Ketentuan Panjang (Minimal - Maksimal)</th>
                <th className="py-3 px-4 font-bold text-amber-300">Sumber / Catatan Penting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-medium">
              
              {/* Proposal Parent Row */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Proposal</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-emerald-400">
                  10 - 40 halaman
                </td>
                <td className="py-3 px-4 text-slate-300 italic">
                  Tidak ada patokan tunggal.
                </td>
              </tr>

              {/* Sub-rows for Proposal */}
              <tr className="bg-slate-950/60 hover:bg-slate-900/60 transition-colors">
                <td className="py-2.5 px-4 pl-8 text-slate-300 font-medium">
                  • Proposal Skripsi
                </td>
                <td className="py-2.5 px-4 text-emerald-300 font-bold">
                  10 - 15 halaman
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  Berdasarkan pengalaman umum.
                </td>
              </tr>

              <tr className="bg-slate-950/60 hover:bg-slate-900/60 transition-colors">
                <td className="py-2.5 px-4 pl-8 text-slate-300 font-medium">
                  • Proposal Tesis
                </td>
                <td className="py-2.5 px-4 text-emerald-300 font-bold">
                  15 - 25 halaman
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  Biasanya lebih panjang dari proposal skripsi.
                </td>
              </tr>

              <tr className="bg-slate-950/60 hover:bg-slate-900/60 transition-colors">
                <td className="py-2.5 px-4 pl-8 text-slate-300 font-medium">
                  • Proposal Disertasi
                </td>
                <td className="py-2.5 px-4 text-emerald-300 font-bold">
                  25 - 40 halaman
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  Proposal untuk jenjang doktoral yang paling komprehensif.
                </td>
              </tr>

              {/* Seminar Hasil */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Seminar Hasil</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-blue-400">
                  Maksimal 10 - 12 halaman (makalah)
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Fokus pada substansi penelitian. Di beberapa universitas, batasan ini berlaku khusus untuk makalah yang dipresentasikan.
                </td>
              </tr>

              {/* Skripsi (S1) */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Skripsi (S1)</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-emerald-400">
                  40 - 100 halaman (isi Bab I-V)
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Batas ini tidak termasuk lampiran. Jumlah halaman minimal 45 halaman.
                </td>
              </tr>

              {/* Tesis (S2) */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Tesis (S2)</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-purple-400">
                  100 - 150 halaman
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Merupakan karya yang lebih mendalam dari skripsi.
                </td>
              </tr>

              {/* Disertasi (S3) */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-400" />
                  <span>Disertasi (S3)</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-rose-400">
                  150 - 300 halaman
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Karya terpanjang dan paling mendalam.
                </td>
              </tr>

              {/* Jurnal Ilmiah */}
              <tr className="bg-slate-900/90 hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Jurnal Ilmiah</span>
                </td>
                <td className="py-3 px-4 font-extrabold text-amber-400">
                  Bervariasi per jurnal.
                </td>
                <td className="py-3 px-4 text-slate-300">
                  Sangat spesifik. Contoh: 10-15 halaman, 10-22 halaman, atau 10-15 halaman.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* CALCULATOR & VALIDATOR TOOL */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Kalkulator & Validator Kepatuhan Halaman</h3>
            <p className="text-xs text-slate-400">Cek apakah naskah Anda memenuhi batas minimal & maksimal halaman akademik RI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Doc Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pilih Jenis Dokumen Akademik:</label>
            <select
              value={calcDocType}
              onChange={(e) => setCalcDocType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <optgroup label="1. Proposal Penelitian (10 - 40 Halaman)">
                <option value="prop-s1">Proposal Skripsi (S1) [10 - 15 Halaman]</option>
                <option value="prop-s2">Proposal Tesis (S2) [15 - 25 Halaman]</option>
                <option value="prop-s3">Proposal Disertasi (S3) [25 - 40 Halaman]</option>
              </optgroup>
              <optgroup label="2. Seminar Hasil">
                <option value="semhas-s1">Seminar Hasil (Makalah) [Maksimal 10 - 12 Halaman]</option>
              </optgroup>
              <optgroup label="3. Laporan Akhir Utama">
                <option value="skripsi-full">Skripsi (S1) [40 - 100 Halaman, Min 45 Hal]</option>
                <option value="tesis-full">Tesis (S2) [100 - 150 Halaman]</option>
                <option value="disertasi-full">Disertasi (S3) [150 - 300 Halaman]</option>
              </optgroup>
              <optgroup label="4. Publikasi Jurnal">
                <option value="jurnal-ilmiah">Jurnal Ilmiah [Bervariasi: 10-15 hal / 10-22 hal]</option>
              </optgroup>
            </select>
          </div>

          {/* Page Number Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Masukkan Jumlah Halaman Naskah Kamu:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={1000}
                value={calcPageInput}
                onChange={(e) => setCalcPageInput(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">Halaman</span>
            </div>
          </div>

          {/* Standards Summary Card */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Batas Minimal:</span>
              <span className="font-bold text-white">{activeCalcItem.minPages} Hal</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Batas Maksimal:</span>
              <span className="font-bold text-white">{activeCalcItem.maxPages} Hal</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Kisaran Ideal:</span>
              <span className="font-bold text-emerald-400">{activeCalcItem.idealPages}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Estimasi Kata:</span>
              <span className="font-medium text-slate-300">{activeCalcItem.wordCountEstimate}</span>
            </div>
          </div>
        </div>

        {/* Validation Result Box */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${calcResult.color}`}>
          <div className="flex items-start gap-3">
            <calcResult.icon className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white">{calcResult.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-900/60 text-slate-200 border border-slate-700">
                  {calcResult.badge}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200 opacity-90">{calcResult.advice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TABS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'proposal', label: 'Proposal' },
            { id: 'semhas', label: 'Seminar Hasil' },
            { id: 'skripsi', label: 'Skripsi (S1)' },
            { id: 'tesis', label: 'Tesis (S2)' },
            { id: 'disertasi', label: 'Disertasi (S3)' },
            { id: 'jurnal', label: 'Jurnal / Publikasi' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari jenis dokumen / aturan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* DETAILED CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStandards.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-md hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header Title & Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{item.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-xl text-right shrink-0">
                  <span className="block text-xs text-indigo-300 font-semibold">Ideal:</span>
                  <span className="text-sm font-extrabold text-white">{item.idealPages}</span>
                </div>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Batas Minimal:</span>
                  <span className="font-bold text-amber-400">{item.minPages} Halaman</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Batas Maksimal:</span>
                  <span className="font-bold text-rose-400">{item.maxPages} Halaman</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Estimasi Kata:</span>
                  <span className="font-medium text-emerald-300">{item.wordCountEstimate}</span>
                </div>
              </div>

              {/* Format Rules */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-xs space-y-1">
                <p className="text-slate-300"><strong className="text-indigo-300">Spasi & Font:</strong> {item.lineSpacing}</p>
                <p className="text-slate-300"><strong className="text-indigo-300">Margin Standard:</strong> {item.marginStandard}</p>
              </div>

              {/* Structure Breakdown */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Struktur & Distribusi Halaman Per-Bab:</span>
                </p>
                <ul className="space-y-1 text-slate-300 pl-2">
                  {item.structure.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regulations Note */}
              <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
                <p className="font-semibold text-indigo-300 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Catatan Aturan Akademik:</span>
                </p>
                <p className="leading-relaxed opacity-90">{item.regulationsNote}</p>
              </div>

              {/* Common Errors */}
              <div className="space-y-1 text-xs">
                <p className="font-bold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kesalahan Umum Terkait Jumlah Halaman:</span>
                </p>
                <ul className="list-disc pl-5 text-slate-300 space-y-0.5">
                  {item.commonErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="pt-3 border-t border-slate-700/60 text-xs text-emerald-300 flex items-start gap-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span><strong>Tips Dukun Skripsi AI:</strong> {item.tips}</span>
            </div>
          </div>
        ))}
      </div>

      {/* General Rules FAQ / Ringkasan SN-Dikti */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Aturan Penomoran & Hitungan Halaman Menurut Pedoman Akademik Indonesia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm">1. Bagian Awal (Romawi Kecil)</h4>
            <p className="leading-relaxed">
              Halaman Judul, Lembar Pengesahan, Pernyataan Keaslian, Abstrak, Kata Pengantar, Daftar Isi, Daftar Tabel, dan Daftar Gambar menggunakan angka <strong className="text-white">Romawi Kecil (i, ii, iii, iv, dst)</strong> yang diletakkan di <strong className="text-white">Bawah Tengah</strong>. Halaman Sampul/Judul dianggap halaman i tetapi nomornya tidak dicetak.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-indigo-400 text-sm">2. Bagian Utama (Angka Arab)</h4>
            <p className="leading-relaxed">
              Mulai dari <strong className="text-white">BAB I (Pendahuluan)</strong> sampai <strong className="text-white">BAB V (Penutup)</strong> & <strong className="text-white">Daftar Pustaka</strong> menggunakan <strong className="text-white">Angka Arab (1, 2, 3, dst)</strong>.
              Khusus halaman pertama tiap Bab diletakkan di <strong className="text-white">Bawah Tengah</strong>, sedangkan halaman selanjutnya di <strong className="text-white">Kanan Atas</strong>.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
            <h4 className="font-bold text-amber-400 text-sm">3. Status Lampiran & Data Mentah</h4>
            <p className="leading-relaxed">
              Halaman Lampiran diawali dengan angka lanjutan atau format tersendiri (Lampiran 1, Lampiran 2). <strong className="text-white">PENTING:</strong> Lampiran <strong className="text-amber-300">TIDAK DIHITUNG</strong> dalam batas minimal/maksimal halaman naskah utama skripsi/tesis/disertasi.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
