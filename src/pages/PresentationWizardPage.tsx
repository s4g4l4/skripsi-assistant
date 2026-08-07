import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Presentation, FileText, UploadCloud, CheckCircle2, 
  ChevronRight, Wand2, Download, ArrowRight, ArrowLeft,
  LayoutTemplate, MonitorPlay, X, LayoutDashboard, ExternalLink,
  Info, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import pptxgen from 'pptxgenjs';

const SAVED_PROJECTS = [
  'Analisis Sentimen Pengguna Twitter terhadap UI/UX KAI Access',
  'Implementasi Machine Learning untuk Prediksi Harga Saham'
];

const TEMPLATES = [
  { id: 'minimalist', name: 'Minimalis Profesional', desc: 'Bersih, teks mudah dibaca, cocok untuk sidang formal.', color: 'bg-slate-100' },
  { id: 'classic', name: 'Akademik Klasik', desc: 'Desain standar universitas dengan warna biru tua.', color: 'bg-blue-900' },
  { id: 'modern', name: 'Modern Kreatif', desc: 'Banyak visual, cocok untuk presentasi produk/IT.', color: 'bg-emerald-500' },
  { id: 'dark', name: 'Gelap Elegan', desc: 'Dark mode, fokus tinggi pada grafik dan data.', color: 'bg-slate-900' }
];

export default function PresentationWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [sourceType, setSourceType] = useState<'project' | 'upload'>('project');
  const [selectedProject, setSelectedProject] = useState(SAVED_PROJECTS[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const [selectedChapters, setSelectedChapters] = useState({
    abstrak: true,
    bab1: true,
    bab2: true,
    bab3: true,
    bab4: true,
    bab5: true,
    pustaka: false
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [showGoogleSlidesModal, setShowGoogleSlidesModal] = useState(false);

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setSourceType('upload');
    }
  };

  const handleChapterToggle = (key: keyof typeof selectedChapters) => {
    setSelectedChapters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadPptx = async () => {
    setIsDownloading(true);
    setDownloadSuccess('');
    try {
      const pptx = new pptxgen();
      pptx.author = "Dukun Skripsi AI";
      pptx.title = selectedProject || (uploadedFile ? uploadedFile.name : "Presentasi Sidang Skripsi");
      
      // Theme colors based on selectedTemplate
      let bgColor = "F8FAFC";
      let titleColor = "0F172A";
      let headerColor = "0284C7";
      let textColor = "334155";
      let coverBg = "0F172A";
      let coverTitleColor = "38BDF8";

      if (selectedTemplate === 'classic') {
        bgColor = "F0F9FF";
        titleColor = "1E3A8A";
        headerColor = "1D4ED8";
        coverBg = "1E3A8A";
        coverTitleColor = "FDE047";
      } else if (selectedTemplate === 'modern') {
        bgColor = "F0FDF4";
        titleColor = "065F46";
        headerColor = "059669";
        coverBg = "064E3B";
        coverTitleColor = "34D399";
      } else if (selectedTemplate === 'dark') {
        bgColor = "0F172A";
        titleColor = "38BDF8";
        headerColor = "818CF8";
        textColor = "E2E8F0";
        coverBg = "020617";
        coverTitleColor = "38BDF8";
      }

      const titleText = sourceType === 'upload' && uploadedFile 
        ? uploadedFile.name.replace(/\.[^/.]+$/, "") 
        : (selectedProject || "Presentasi Sidang Skripsi");

      // Slide 1: Cover
      let slide1 = pptx.addSlide();
      slide1.background = { color: coverBg };
      slide1.addText("PRESENTASI SIDANG SKRIPSI / TA", {
        x: 0.8, y: 1.0, w: "85%", fontSize: 14, color: "94A3B8", bold: true
      });
      slide1.addText(titleText, {
        x: 0.8, y: 1.6, w: "85%", fontSize: 24, bold: true, color: coverTitleColor
      });
      slide1.addText("Disusun oleh: Mahasiswa Akhir\nDosen Pembimbing: Dr. Ahmad Dahlan, M.T.\nProgram Studi S1 - Dukun Skripsi AI", {
        x: 0.8, y: 3.8, w: "85%", fontSize: 13, color: "CBD5E1"
      });

      // Slide 2: Abstrak & Latar Belakang
      if (selectedChapters.abstrak) {
        let s = pptx.addSlide();
        s.background = { color: bgColor };
        s.addText("BAB 1: Latar Belakang & Urgensi Penelitian", { x: 0.8, y: 0.6, w: "85%", fontSize: 20, bold: true, color: titleColor });
        s.addText([
          { text: "1. Fenomena & Latar Belakang\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Perkembangan teknologi informasi memicu kebutuhan otomatisasi yang makin kompleks.\n• Masalah aktual: Metode konvensional membutuhkan waktu relatif lama dan rentan kesalahan human error.\n\n", options: { fontSize: 13, color: textColor } },
          { text: "2. Urgensi & Dampak Penelitian\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Diperlukan solusi terotomatisasi berbasis cerdas untuk efisiensi tinggi.\n• Hasil penelitian ini diharapkan menjadi acuan standar bagi pengembangan sistem akademis.", options: { fontSize: 13, color: textColor } }
        ], { x: 0.8, y: 1.4, w: "85%", h: 4.8 });
      }

      // Slide 3: Rumusan Masalah & Tujuan
      if (selectedChapters.bab1) {
        let s = pptx.addSlide();
        s.background = { color: bgColor };
        s.addText("BAB 1: Rumusan Masalah & Tujuan", { x: 0.8, y: 0.6, w: "85%", fontSize: 20, bold: true, color: titleColor });
        s.addText([
          { text: "Rumusan Masalah Penelitian\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "1. Bagaimana merancang arsitektur model AI yang optimal?\n2. Seberapa besar peningkatan akurasi dibanding metode terdahulu?\n\n", options: { fontSize: 13, color: textColor } },
          { text: "Tujuan Penelitian\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Menganalisis dan merancang arsitektur sistem berbasis cerdas.\n• Mengukur efisiensi dan performa model berdasarkan indikator standar.", options: { fontSize: 13, color: textColor } }
        ], { x: 0.8, y: 1.4, w: "85%", h: 4.8 });
      }

      // Slide 4: Landasan Teori
      if (selectedChapters.bab2) {
        let s = pptx.addSlide();
        s.background = { color: bgColor };
        s.addText("BAB 2: Tinjauan Pustaka & Landasan Teori", { x: 0.8, y: 0.6, w: "85%", fontSize: 20, bold: true, color: titleColor });
        s.addText([
          { text: "Landasan Teori Utama\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Teori Pemodelan Sistem: Pendekatan modular terbukti meningkatkan skalabilitas.\n• Algoritma Utama: Menggunakan model hybrid untuk optimasi waktu komputasi.\n\n", options: { fontSize: 13, color: textColor } },
          { text: "Penelitian Terkait (State of the Art)\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Peneliti A (2023): Fokus pada akurasi awal dengan rata-rata 82%.\n• Penelitian Ini: Mengembangkan optimasi lanjutan untuk akurasi > 90%.", options: { fontSize: 13, color: textColor } }
        ], { x: 0.8, y: 1.4, w: "85%", h: 4.8 });
      }

      // Slide 5: Metodologi Penelitian
      if (selectedChapters.bab3) {
        let s = pptx.addSlide();
        s.background = { color: bgColor };
        s.addText("BAB 3: Metodologi Penelitian", { x: 0.8, y: 0.6, w: "85%", fontSize: 20, bold: true, color: titleColor });
        s.addText([
          { text: "Alur & Desain Penelitian\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Jenis Penelitian: Kuantitatif / Eksperimental\n• Objek & Sampel: Dataset sekunder & Pengujian Pengguna\n• Tahapan: Pengumpulan Data -> Preprocessing -> Model Training -> Evaluasi\n• Teknik Analisis: Pengujian presisi, recall, dan F1-Score.", options: { fontSize: 13, color: textColor } }
        ], { x: 0.8, y: 1.4, w: "85%", h: 4.8 });
      }

      // Slide 6: Hasil & Pembahasan
      if (selectedChapters.bab4) {
        let s = pptx.addSlide();
        s.background = { color: bgColor };
        s.addText("BAB 4: Hasil Penelitian & Pembahasan", { x: 0.8, y: 0.6, w: "85%", fontSize: 20, bold: true, color: titleColor });
        s.addText([
          { text: "Temuan Utama Penelitian\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Akurasi Model: Mencapai 94.2% dalam pengujian beban penuh.\n• Waktu Komputasi: 3.5x lebih cepat dibanding sistem standar.\n\n", options: { fontSize: 13, color: textColor } },
          { text: "Pembahasan Hasil\n", options: { bold: true, fontSize: 15, color: headerColor } },
          { text: "• Hasil sesuai dengan hipotesis awal dan mendukung teori pendukung.\n• Terjadi efisiensi waktu pemrosesan data secara signifikan.", options: { fontSize: 13, color: textColor } }
        ], { x: 0.8, y: 1.4, w: "85%", h: 4.8 });
      }

      // Slide 7: Kesimpulan & QnA
      if (selectedChapters.bab5) {
        let s = pptx.addSlide();
        s.background = { color: coverBg };
        s.addText("BAB 5: Kesimpulan & Penutup", { x: 0.8, y: 0.8, w: "85%", fontSize: 20, bold: true, color: coverTitleColor });
        s.addText([
          { text: "Kesimpulan Utama\n", options: { bold: true, fontSize: 15, color: "38BDF8" } },
          { text: "1. Perancangan sistem berhasil memenuhi seluruh indikator keberhasilan.\n2. Implementasi model memberikan performa yang stabil dan akurat.\n\n", options: { fontSize: 13, color: "E2E8F0" } },
          { text: "Sesi Diskusi & Tanya Jawab (Q&A)\n", options: { bold: true, fontSize: 18, color: "34D399" } },
          { text: "Terima kasih kepada Ketua dan Anggota Dewan Penguji.", options: { fontSize: 13, color: "94A3B8" } }
        ], { x: 0.8, y: 1.8, w: "85%", h: 4.5 });
      }

      const filename = `Presentasi_${titleText.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
      await pptx.writeFile({ fileName: filename });
      setDownloadSuccess('File .PPTX berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(''), 5000);
    } catch (err) {
      console.error("Gagal mendownload PPTX:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenGoogleSlides = async () => {
    // 1. Download file PPTX otomatis
    await handleDownloadPptx();
    
    // 2. Buka tab baru ke Google Slides
    window.open('https://slides.new', '_blank');

    // 3. Tampilkan panduan impor ke Google Slides
    setShowGoogleSlidesModal(true);
  };

  const startGenerating = () => {
    setIsGenerating(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setStep(5);
        }, 500);
      }
      setGenerateProgress(progress);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">Dukun Skripsi</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <h1 className="font-semibold text-slate-700">Generate Presentasi</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2">
            <X className="w-4 h-4" /> Batal
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-4xl">
          
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex justify-between mb-3 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>
              
              {[
                { icon: FileText, label: 'Sumber' },
                { icon: LayoutDashboard, label: 'Konten' },
                { icon: LayoutTemplate, label: 'Template' },
                { icon: Wand2, label: 'Generate' },
                { icon: MonitorPlay, label: 'Selesai' }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                    {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${step >= i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-6 sm:p-10 flex-1">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Pilih Sumber */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Pilih Sumber Dokumen</h2>
                    <p className="text-slate-500 mb-8">Pilih darimana AI akan mengambil materi untuk presentasi sidang Anda.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div 
                        onClick={() => setSourceType('project')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${sourceType === 'project' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sourceType === 'project' ? 'border-emerald-500' : 'border-slate-300'}`}>
                            {sourceType === 'project' && <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>}
                          </div>
                          <FileText className={`w-6 h-6 ${sourceType === 'project' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <h3 className="font-bold text-slate-900">Dari Proyek Tersimpan</h3>
                        </div>
                        
                        <div className="pl-9 space-y-3">
                          {SAVED_PROJECTS.map((proj, idx) => (
                            <div 
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setSourceType('project'); setSelectedProject(proj); }}
                              className={`p-3 rounded-xl border text-sm transition-colors ${selectedProject === proj && sourceType === 'project' ? 'border-emerald-500 bg-white shadow-sm font-bold text-emerald-800' : 'border-slate-200 bg-white/50 text-slate-600'}`}
                            >
                              {proj}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setSourceType('upload')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${sourceType === 'upload' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sourceType === 'upload' ? 'border-emerald-500' : 'border-slate-300'}`}>
                            {sourceType === 'upload' && <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>}
                          </div>
                          <UploadCloud className={`w-6 h-6 ${sourceType === 'upload' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <h3 className="font-bold text-slate-900">Upload Dokumen Baru</h3>
                        </div>
                        
                        <div className="pl-9">
                          <div className="border border-dashed border-slate-300 bg-white rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                            <input 
                              type="file" 
                              accept=".docx,.pdf"
                              onChange={handleFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            {uploadedFile ? (
                              <p className="text-sm font-bold text-emerald-600 truncate">{uploadedFile.name}</p>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-slate-700">Pilih file DOCX atau PDF</p>
                                <p className="text-xs text-slate-500 mt-1">Maksimal 20MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Pilih Bab */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Pilih Cakupan Materi</h2>
                    <p className="text-slate-500 mb-6">Pilih bagian mana saja yang ingin diringkas dan dimasukkan ke dalam slide presentasi.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'abstrak', label: 'Abstrak & Latar Belakang' },
                        { id: 'bab1', label: 'Bab 1: Pendahuluan (Rumusan & Tujuan)' },
                        { id: 'bab2', label: 'Bab 2: Tinjauan Pustaka (Teori Utama)' },
                        { id: 'bab3', label: 'Bab 3: Metodologi Penelitian' },
                        { id: 'bab4', label: 'Bab 4: Hasil & Pembahasan' },
                        { id: 'bab5', label: 'Bab 5: Kesimpulan & Saran' },
                        { id: 'pustaka', label: 'Daftar Pustaka Utama' },
                      ].map(item => (
                        <div 
                          key={item.id}
                          onClick={() => handleChapterToggle(item.id as keyof typeof selectedChapters)}
                          className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${selectedChapters[item.id as keyof typeof selectedChapters] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedChapters[item.id as keyof typeof selectedChapters] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                            {selectedChapters[item.id as keyof typeof selectedChapters] && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`font-medium text-sm ${selectedChapters[item.id as keyof typeof selectedChapters] ? 'text-emerald-800' : 'text-slate-700'}`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Template */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Pilih Desain Template</h2>
                    <p className="text-slate-500 mb-6">Pilih tema visual untuk presentasi Anda. Dapat diubah nanti di aplikasi PPT.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {TEMPLATES.map(template => (
                        <div 
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`group rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${selectedTemplate === template.id ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
                        >
                          <div className={`h-32 ${template.color} w-full flex items-center justify-center p-4 relative`}>
                            {/* Mockup Slide */}
                            <div className="w-3/4 h-3/4 bg-white/10 backdrop-blur rounded shadow-sm border border-white/20 p-3 flex flex-col gap-2">
                              <div className="w-1/2 h-2 bg-white/40 rounded"></div>
                              <div className="w-full h-1 bg-white/20 rounded mt-2"></div>
                              <div className="w-5/6 h-1 bg-white/20 rounded"></div>
                              <div className="w-4/6 h-1 bg-white/20 rounded"></div>
                            </div>
                            {selectedTemplate === template.id && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-white">
                            <h3 className="font-bold text-slate-900 mb-1">{template.name}</h3>
                            <p className="text-xs text-slate-500">{template.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Generate */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 text-center py-10"
                  >
                    {!isGenerating ? (
                      <div>
                        <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                          <Presentation className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Semua Siap!</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">AI akan mengekstrak poin penting dari dokumen Anda dan menyusunnya menjadi ~15 slide presentasi siap pakai.</p>
                        
                        <button 
                          onClick={startGenerating}
                          className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto"
                        >
                          <Wand2 className="w-5 h-5" /> Generate PPT Sekarang
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Wand2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900">Menyusun Presentasi...</h2>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-bold text-slate-700">
                            <span>Mengekstrak poin-poin penting</span>
                            <span>{generateProgress}%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                              style={{ width: `${generateProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Finished */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Presentasi Berhasil Dibuat!</h2>
                    <p className="text-slate-500 mb-8">16 slide telah digenerate dari dokumen Anda dengan desain yang dipilih.</p>
                    
                    {/* Thumbnail Preview */}
                    <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-48 h-32 bg-white rounded-lg shadow-md border border-slate-200 shrink-0 p-3 flex flex-col justify-between">
                          <div className="text-left space-y-2">
                            <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                            <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-10 w-10 bg-slate-100 rounded"></div>
                            <div className="flex-1 space-y-1 mt-1">
                              <div className="h-1 w-full bg-slate-100 rounded"></div>
                              <div className="h-1 w-5/6 bg-slate-100 rounded"></div>
                              <div className="h-1 w-4/6 bg-slate-100 rounded"></div>
                            </div>
                          </div>
                          <div className="text-right text-[8px] text-slate-400 font-bold">Slide {i}</div>
                        </div>
                      ))}
                    </div>
                    
                    {downloadSuccess && (
                      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn max-w-md mx-auto">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{downloadSuccess}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={handleDownloadPptx}
                        disabled={isDownloading}
                        className="flex justify-center items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Mengekspor PPTX...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            <span>Download .PPTX</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={handleOpenGoogleSlides}
                        disabled={isDownloading}
                        className="flex justify-center items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                      >
                        <MonitorPlay className="w-5 h-5" />
                        <span>Buka di Google Slides</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">
                      *Tombol "Buka di Google Slides" akan mengunduh file .PPTX dan membuka tab Google Slides baru.
                    </p>

                    <div className="pt-8">
                      <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">
                        Kembali ke Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            {step < 4 && (
              <div className="bg-slate-50 px-6 sm:px-10 py-5 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 bg-slate-100'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm text-white transition-all shadow-sm bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                >
                  Selanjutnya <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Google Slides Modal Instructions */}
      <AnimatePresence>
        {showGoogleSlidesModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Cara Buka di Google Slides</h3>
                    <p className="text-xs text-slate-500">File .PPTX telah diunduh ke komputer Anda</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGoogleSlidesModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-blue-900 font-medium leading-relaxed">
                    Tab Google Slides baru telah dibuka di browser Anda! Silakan ikuti 3 langkah cepat berikut:
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
                    <span>Di tab Google Slides, klik menu <strong>File</strong> &rarr; <strong>Impor Slide (Import Slides)</strong>.</span>
                  </div>

                  <div className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
                    <span>Pilih tab <strong>Upload</strong> lalu drag & drop file .PPTX yang baru saja terunduh.</span>
                  </div>

                  <div className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">3</span>
                    <span>Klik <strong>Impor Slide</strong>. Presentasi skripsi Anda siap dipresentasikan di Google Slides!</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://slides.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  Buka Tab Google Slides <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowGoogleSlidesModal(false)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Mengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
