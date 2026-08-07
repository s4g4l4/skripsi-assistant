import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Presentation, FileText, UploadCloud, CheckCircle2, 
  ChevronRight, Wand2, Download, ArrowRight, ArrowLeft,
  LayoutTemplate, MonitorPlay, X, LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button className="flex justify-center items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all">
                        <Download className="w-5 h-5" /> Download .PPTX
                      </button>
                      <button className="flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                        <MonitorPlay className="w-5 h-5" /> Buka di Google Slides
                      </button>
                    </div>

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
    </div>
  );
}
