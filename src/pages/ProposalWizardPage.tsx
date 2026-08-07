import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, UploadCloud, UserCircle, BookOpen, Wand2, 
  ArrowRight, ArrowLeft, CheckCircle2, FileText, X, Search, MapPin
, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_UNIVERSITIES, UniversityTemplate } from '../data/universities';

export default function ProposalWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchUniv, setSearchUniv] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  
  const categories = ['Semua', 'PTN', 'PTS', 'PTKIN', 'Politeknik', 'Sekolah Tinggi'];

  const filteredUnivs = DEFAULT_UNIVERSITIES.filter(u => {
    const matchesCategory = selectedCategory === 'Semua' || u.category === selectedCategory;
    const matchesSearch = u.name.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.city.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.province.toLowerCase().includes(searchUniv.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const [formData, setFormData] = useState({
    university: '',
    guidebookUploaded: false,
    author: {
      name: '',
      nim: '',
      major: '',
      faculty: '',
      year: '',
      supervisor: ''
    },
    research: {
      title: '',
      topic: '',
      type: 'Kuantitatif',
      variables: '',
      population: ''
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      author: { ...formData.author, [e.target.name]: e.target.value }
    });
  };

  const handleResearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      research: { ...formData.research, [e.target.name]: e.target.value }
    });
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setIsFinished(true);
        }, 500);
      }
      setGenerateProgress(progress);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">Dukun Skripsi</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2">
            <X className="w-4 h-4" /> Batal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-3xl">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-3 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>
              
              {[
                { icon: Building2, label: 'Kampus' },
                { icon: UploadCloud, label: 'Panduan' },
                { icon: UserCircle, label: 'Penulis' },
                { icon: BookOpen, label: 'Riset' },
                { icon: Wand2, label: 'Generate' }
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

          {/* Form Area */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900">Pilih Template Universitas</h2>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                          Data Kemendikdasmen / DIKTI
                        </span>
                      </div>
                      <p className="text-slate-500 mb-6">Sistem menyesuaikan margin, font, dan spasi otomatis berdasarkan pedoman resmi kampus Anda.</p>
                      
                      {/* Category Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 custom-scrollbar">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl whitespace-nowrap transition-all ${
                              selectedCategory === cat 
                                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/20' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Search Input */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          value={searchUniv}
                          onChange={(e) => setSearchUniv(e.target.value)}
                          className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
                          placeholder="Cari nama kampus, kota, atau provinsi..." 
                        />
                      </div>

                      {/* University List Grid */}
                      <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white custom-scrollbar p-1">
                        {filteredUnivs.length > 0 ? filteredUnivs.map((univ) => {
                          const isSelected = formData.university === univ.name;
                          return (
                            <div 
                              key={univ.id}
                              onClick={() => setFormData({ ...formData, university: univ.name })}
                              className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between my-0.5 ${
                                isSelected 
                                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold' 
                                  : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <div>
                                <p className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                                  {univ.name}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" /> {univ.city}, {univ.province} • <span className="font-semibold text-emerald-700">{univ.category}</span>
                                </p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        }) : (
                          <div className="p-8 text-center text-slate-500 text-sm">
                            Universitas tidak ditemukan dalam pencarian. Anda tetap dapat mengunggah buku panduan spesifik kampus Anda di langkah berikutnya.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Upload Buku Panduan Skripsi</h2>
                      <p className="text-slate-500 mb-6">Jika format spesifik belum ada, AI kami akan mempelajarinya langsung dari file PDF pedoman kampus Anda.</p>
                      
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer bg-white group">
                        <UploadCloud className="w-16 h-16 text-slate-300 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                        <h3 className="text-lg font-bold text-slate-700 mb-1 group-hover:text-emerald-600 transition-colors">Drag & drop file PDF di sini</h3>
                        <p className="text-sm text-slate-500 mb-4">atau klik untuk memilih file dari komputer</p>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-colors">
                          Pilih File
                        </button>
                      </div>

                      <div className="mt-6 text-center">
                        <button onClick={nextStep} className="text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-4">
                          Lewati langkah ini (gunakan template standar)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Data Penulis</h2>
                      <p className="text-slate-500 mb-6">Data ini akan digunakan untuk mengisi otomatis Cover dan Lembar Pengesahan.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                          <input name="name" value={formData.author.name} onChange={handleAuthorChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">NIM / NPM</label>
                          <input name="nim" value={formData.author.nim} onChange={handleAuthorChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Fakultas</label>
                          <input name="faculty" value={formData.author.faculty} onChange={handleAuthorChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Program Studi</label>
                          <input name="major" value={formData.author.major} onChange={handleAuthorChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Tahun Akademik</label>
                          <input name="year" value={formData.author.year} onChange={handleAuthorChange} type="text" placeholder="Contoh: 2023/2024" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Dosen Pembimbing</label>
                          <input name="supervisor" value={formData.author.supervisor} onChange={handleAuthorChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Detail Penelitian</h2>
                      <p className="text-slate-500 mb-6">Informasi ini akan memandu AI dalam menyusun Latar Belakang dan Metodologi.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Judul Penelitian</label>
                          <textarea name="title" value={formData.research.title} onChange={handleResearchChange} rows={2} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 resize-none" placeholder="Masukkan judul lengkap skripsi Anda..."></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Topik Utama</label>
                          <input name="topic" value={formData.research.topic} onChange={handleResearchChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" placeholder="Contoh: Machine Learning, Pemasaran Digital, dll." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Penelitian</label>
                            <select name="type" value={formData.research.type} onChange={handleResearchChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50">
                              <option value="Kuantitatif">Kuantitatif</option>
                              <option value="Kualitatif">Kualitatif</option>
                              <option value="Campuran (Mixed Methods)">Campuran (Mixed Methods)</option>
                              <option value="R&D (Research and Development)">R&D (Research & Development)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Populasi / Objek Penelitian</label>
                            <input name="population" value={formData.research.population} onChange={handleResearchChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" placeholder="Contoh: Mahasiswa aktif UI 2023" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Variabel Penelitian (Opsional)</label>
                          <input name="variables" value={formData.research.variables} onChange={handleResearchChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" placeholder="Contoh: (X) Kualitas Layanan, (Y) Kepuasan Pelanggan" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 text-center"
                  >
                    {!isFinished ? (
                      <div>
                        <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Siap untuk Generate!</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">AI kami akan menyusun draft kasar Bab 1 (Latar Belakang, Rumusan Masalah, Tujuan) hingga Bab 3 berdasarkan data yang Anda berikan.</p>
                        
                        {isGenerating ? (
                          <div className="max-w-sm mx-auto space-y-4">
                            <div className="flex justify-between text-sm font-bold text-slate-700">
                              <span>Menyusun Proposal...</span>
                              <span>{generateProgress}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                style={{ width: `${generateProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-400 animate-pulse">Menghubungkan ke database SINTA & Garuda...</p>
                          </div>
                        ) : (
                          <button 
                            onClick={handleGenerate}
                            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto"
                          >
                            <Wand2 className="w-5 h-5" /> Mulai Generate Proposal 1-Click
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100 shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Proposal Berhasil Dibuat!</h2>
                          <p className="text-slate-500">Draft proposal Anda sudah tersimpan dan siap untuk diedit lebih lanjut.</p>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between max-w-md mx-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900 truncate w-48">{formData.research.title || 'Draft_Proposal_Skripsi.docx'}</p>
                              <p className="text-xs text-slate-500">Dibuat baru saja • 14 Halaman</p>
                            </div>
                          </div>
                          <button onClick={() => navigate('/editor')} className="text-emerald-600 font-bold text-sm hover:text-emerald-700 px-3 py-1.5 bg-emerald-50 rounded-lg transition-colors">
                            Buka Editor
                          </button>
                        </div>
                        
                        <div className="pt-4">
                          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
                            Kembali ke Dashboard
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            {!isGenerating && !isFinished && (
              <div className="bg-slate-50 px-6 sm:px-10 py-5 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 bg-slate-100'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={step === 5}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm text-white transition-all shadow-sm ${step === 5 ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
                >
                  {step === 4 ? 'Review Data' : 'Selanjutnya'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
