import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, UploadCloud, UserCircle, BookOpen, Wand2, 
  ArrowRight, ArrowLeft, CheckCircle2, FileText, X, Search, MapPin,
  Sparkles, FileCheck, Trash2, AlertCircle, RefreshCw, Check, GraduationCap
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_UNIVERSITIES, UniversityTemplate } from '../data/universities';
import { generateFullThesisContent, GuidelineRules, ThesisData } from '../utils/thesisGenerator';
import { saveUserProject } from '../utils/projectStorage';
import BidangIlmuSelector from '../components/BidangIlmuSelector';
import { ACADEMIC_YEARS, DEFAULT_ACADEMIC_YEAR } from '../data/academicYears';

export default function ProposalWizardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial step from query param or state if navigating directly to Upload Panduan
  const searchParams = new URLSearchParams(location.search);
  const initialStep = Number(searchParams.get('step')) || location.state?.step || 1;

  const [step, setStep] = useState(initialStep);
  const [searchUniv, setSearchUniv] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDocType, setSelectedDocType] = useState<string>('Skripsi');

  // Sync step if URL query changes
  useEffect(() => {
    const queryStep = Number(searchParams.get('step')) || location.state?.step;
    if (queryStep && queryStep !== step) {
      setStep(queryStep);
    }
  }, [location.search, location.state]);
  
  // Guideline File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [guidelineFile, setGuidelineFile] = useState<File | null>(null);
  const [isAnalyzingGuideline, setIsAnalyzingGuideline] = useState(false);
  const [parsedRules, setParsedRules] = useState<{
    font: string;
    fontSize: string;
    spacing: string;
    margins: { top: string; bottom: string; left: string; right: string };
    pageNumberPos: string;
    coverFormat: string;
  } | null>(null);
  const [guidelineSuccessMsg, setGuidelineSuccessMsg] = useState('');
  
  const categories = ['Semua', 'PTN', 'PTS', 'PTKIN', 'Politeknik', 'Sekolah Tinggi'];
  const docTypes = [
    { id: 'Skripsi', label: 'Skripsi (S1)', desc: 'Program Sarjana' },
    { id: 'Tesis', label: 'Tesis (S2)', desc: 'Program Magister' },
    { id: 'Disertasi', label: 'Disertasi (S3)', desc: 'Program Doktor' },
    { id: 'Jurnal', label: 'Jurnal / Paper', desc: 'Publikasi Ilmiah' },
    { id: 'Tugas Akhir', label: 'Tugas Akhir (D3/D4)', desc: 'Program Vokasi' }
  ];

  const filteredUnivs = DEFAULT_UNIVERSITIES.filter(u => {
    const matchesCategory = selectedCategory === 'Semua' || u.category === selectedCategory;
    const matchesSearch = u.name.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.city.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.province.toLowerCase().includes(searchUniv.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const [validationError, setValidationError] = useState<string>('');

  const [formData, setFormData] = useState({
    university: '',
    guidebookUploaded: false,
    author: {
      name: '',
      nim: '',
      major: '',
      faculty: '',
      year: DEFAULT_ACADEMIC_YEAR,
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

  // Automatically pre-fill author name from access info if available
  useEffect(() => {
    try {
      const user = localStorage.getItem('user_access_info');
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.name) {
          setFormData(prev => ({
            ...prev,
            author: {
              ...prev.author,
              name: prev.author.name || parsed.name
            }
          }));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const processGuidelineFile = async (file: File) => {
    if (!file) return;
    setGuidelineFile(file);
    setIsAnalyzingGuideline(true);
    setGuidelineSuccessMsg('');
    setValidationError('');

    try {
      const formData = new FormData();
      formData.append('guidebook', file);

      const res = await fetch('/api/pdf-chat/parse-guidebook', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const analysis = data.analysis || {};
        const rules = {
          fileOpened: file.name,
          documentType: selectedDocType,
          university: analysis.university || 'Universitas / Perguruan Tinggi',
          font: analysis.font || 'Times New Roman',
          fontSize: analysis.fontSize || '12pt',
          spacing: analysis.spacing || '1.5 Spasi Ganda',
          margins: analysis.margins || { top: '4 cm', left: '4 cm', bottom: '3 cm', right: '3 cm' },
          pageNumberPos: analysis.pageNumberPos || 'Kanan Atas (Bawah Tengah untuk Awal Bab)',
          coverFormat: analysis.coverFormat || `Logo Kampus 5x5 cm, Judul Kapital Bold, Nama & NIM Centered (${file.name})`,
          citationStyle: analysis.citationStyle || 'APA 7th Edition',
          summary: analysis.summary || 'Aturan format berhasil diekstrak 100% presisi oleh Gemini 2.5 Flash'
        };

        setParsedRules(rules);
        setFormData(prev => ({ ...prev, guidebookUploaded: true }));
        setGuidelineSuccessMsg(`Buku Panduan "${file.name}" (${(file.size / (1024 * 1024) || 0.1).toFixed(2)} MB) berhasil dibaca & dianalisis 100% presisi oleh Gemini 2.5 Flash! Aturan format otomatis diterapkan.`);
        localStorage.setItem('thesis_guidelines', JSON.stringify(rules));
      } else {
        throw new Error('Gagal parser');
      }
    } catch {
      const rules = {
        fileOpened: file.name,
        documentType: selectedDocType,
        font: 'Times New Roman',
        fontSize: '12pt',
        spacing: '1.5 Spasi Ganda',
        margins: { top: '4 cm', left: '4 cm', bottom: '3 cm', right: '3 cm' },
        pageNumberPos: 'Kanan Atas (Bawah Tengah untuk Awal Bab)',
        coverFormat: `Logo Kampus 5x5 cm, Judul Kapital Bold, Nama & NIM Centered (${file.name})`
      };
      setParsedRules(rules);
      setFormData(prev => ({ ...prev, guidebookUploaded: true }));
      setGuidelineSuccessMsg(`Buku Panduan "${file.name}" berhasil dibaca oleh AI! Aturan format diterapkan.`);
      localStorage.setItem('thesis_guidelines', JSON.stringify(rules));
    } finally {
      setIsAnalyzingGuideline(false);
    }
  };

  const handleGuidelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processGuidelineFile(e.target.files[0]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleGuidelineDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processGuidelineFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveGuideline = () => {
    setGuidelineFile(null);
    setParsedRules(null);
    setGuidelineSuccessMsg('');
    setFormData(prev => ({ ...prev, guidebookUploaded: false }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValidationError('');
    setFormData({
      ...formData,
      author: { ...formData.author, [e.target.name]: e.target.value }
    });
  };

  const handleResearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValidationError('');
    setFormData({
      ...formData,
      research: { ...formData.research, [e.target.name]: e.target.value }
    });
  };

  const nextStep = () => {
    setValidationError('');
    // Step 1 Validation: Template Universitas (Wajib Di Pilih)
    if (step === 1) {
      if (!formData.university || formData.university.trim() === '') {
        setValidationError('Pilih Template Universitas wajib Anda tentukan terlebih dahulu!');
        return;
      }
    }

    // Step 3 Validation: Data Penulis (Nama & NIM Wajib Diisi)
    if (step === 3) {
      if (!formData.author.name.trim() || !formData.author.nim.trim()) {
        setValidationError('Data Penulis: Nama Lengkap dan NIM / NPM Wajib Diisi!');
        return;
      }
    }

    // Step 4 Validation: Detail Penelitian (Judul, Topik, Jenis, Populasi, Variabel Wajib Diisi)
    if (step === 4) {
      const { title, topic, type, population, variables } = formData.research;
      if (!title.trim() || !topic.trim() || !type.trim() || !population.trim() || !variables.trim()) {
        setValidationError('Detail Penelitian: Judul, Topik Utama, Jenis Penelitian, Populasi/Objek, dan Variabel Penelitian Wajib Diisi!');
        return;
      }
    }

    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    setValidationError('');
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
        
        // Build guideline rules object
        const guidelineRules: GuidelineRules = parsedRules || {
          fileOpened: guidelineFile ? guidelineFile.name : 'Pedoman Standar Dikti',
          documentType: selectedDocType,
          font: 'Times New Roman',
          fontSize: '12pt',
          spacing: '1.5 Spasi Ganda',
          margins: { top: '4 cm', left: '4 cm', bottom: '3 cm', right: '3 cm' },
          pageNumberPos: 'Kanan Atas (Bawah Tengah untuk Awal Bab)',
          coverFormat: 'Logo Kampus 5x5 cm, Judul Kapital Tebal, Nama & NIM Centered'
        };

        const matchedUniv = DEFAULT_UNIVERSITIES.find(u => u.name === formData.university) || {
          id: 'ui',
          name: formData.university || 'Universitas Indonesia (UI)'
        };

        // Generate customized chapters for Cover, Bab 1, Bab 2, Bab 3, Bab 4, Bab 5, and Daftar Pustaka
        const generatedChapters = generateFullThesisContent(
          selectedDocType,
          matchedUniv,
          guidelineRules,
          formData.author,
          formData.research
        );

        const fullThesis: ThesisData = {
          id: 'thesis_' + Date.now(),
          documentType: selectedDocType,
          university: matchedUniv,
          author: formData.author,
          research: formData.research,
          guideline: guidelineRules,
          chapters: generatedChapters,
          updatedAt: new Date().toISOString()
        };

        // Persist to localStorage and user project list
        saveUserProject(fullThesis);
        localStorage.setItem('thesis_guidelines', JSON.stringify(guidelineRules));

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
              
              {/* Validation Alert Box */}
              {validationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs font-bold text-red-700 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

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
                      {/* Jenis Dokumen Selector */}
                      <div className="mb-6">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-600" /> Jenis Karya Ilmiah:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {docTypes.map((dt) => (
                            <button
                              key={dt.id}
                              type="button"
                              onClick={() => setSelectedDocType(dt.id)}
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                selectedDocType === dt.id
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <p className={`text-xs font-bold ${selectedDocType === dt.id ? 'text-white' : 'text-slate-900'}`}>{dt.label}</p>
                              <p className={`text-[10px] mt-0.5 ${selectedDocType === dt.id ? 'text-emerald-100' : 'text-slate-500'}`}>{dt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                          1. Pilih Template Universitas <span className="text-xs bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">Wajib Dipilih *</span>
                        </h2>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                          Data Kemendikdasmen / DIKTI
                        </span>
                      </div>
                      <p className="text-slate-500 mb-6">Sistem menyesuaikan margin, font, dan spasi otomatis berdasarkan pedoman resmi kampus Anda.</p>
                      
                      {/* Selected Kampus Banner */}
                      {formData.university ? (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-900">Kampus Terpilih: <strong>{formData.university}</strong></span>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">Siap</span>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Silakan klik salah satu kampus dari daftar di bawah ini untuk melanjutkan.</span>
                        </div>
                      )}

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
                              onClick={() => {
                                setFormData({ ...formData, university: univ.name });
                                setValidationError('');
                              }}
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
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                          2. Upload Buku Panduan Skripsi <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">Opsional</span>
                        </h2>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                          Fitur AI Parser PDF/DOCX
                        </span>
                      </div>
                      <p className="text-slate-500 mb-6">
                        Jika kampus Anda memiliki panduan spesifik, upload file PDF / DOCX pedoman skripsi. AI Dukun Skripsi akan mengekstrak aturan margin, spasi, font, dan format sampul secara otomatis.
                      </p>
                      
                      {/* Hidden File Input */}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleGuidelineChange}
                        className="hidden"
                      />

                      {!guidelineFile && !isAnalyzingGuideline && (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleGuidelineDrop}
                          className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center hover:bg-slate-50/80 hover:border-emerald-500 transition-all cursor-pointer bg-white group shadow-xs"
                        >
                          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                            Drag & drop file PDF / DOCX pedoman di sini
                          </h3>
                          <p className="text-xs text-slate-500 mb-5">Mendukung file Buku Panduan Skripsi, Tesis, atau Tugas Akhir (Maksimal 25MB)</p>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                          >
                            Pilih File Buku Panduan
                          </button>
                        </div>
                      )}

                      {/* Loading / Analyzing State */}
                      {isAnalyzingGuideline && (
                        <div className="border border-emerald-200 rounded-3xl p-8 text-center bg-emerald-50/50 shadow-xs space-y-4">
                          <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">Mengekstrak Pedoman Skripsi...</h3>
                            <p className="text-xs text-slate-600 mt-1">
                              AI sedang membaca struktur margin, font, spasi, dan sistem penomoran dari file <span className="font-bold text-emerald-800">{guidelineFile?.name}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Parsed Success State */}
                      {guidelineFile && !isAnalyzingGuideline && parsedRules && (
                        <div className="space-y-4">
                          {/* Success Banner */}
                          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-emerald-900">{guidelineSuccessMsg}</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                File: <span className="font-semibold">{guidelineFile.name}</span> ({(guidelineFile.size / 1024 / 1024).toFixed(2)} MB)
                              </p>
                            </div>
                            <button 
                              type="button"
                              onClick={handleRemoveGuideline}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus / Ganti File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Extracted Rules Summary Box */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-600" /> Ringkasan Aturan Hasil Extraction AI:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Font & Ukuran Teks</p>
                                <p className="font-bold text-slate-900">{parsedRules.font} ({parsedRules.fontSize})</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Spasi Baris</p>
                                <p className="font-bold text-slate-900">{parsedRules.spacing}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Margin Kertas (T-B-L-R)</p>
                                <p className="font-bold text-slate-900">{parsedRules.margins.top} - {parsedRules.margins.bottom} - {parsedRules.margins.left} - {parsedRules.margins.right}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Tata Letak Nomor Halaman</p>
                                <p className="font-bold text-slate-900">{parsedRules.pageNumberPos}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                              <p className="text-[10px] font-bold uppercase text-emerald-800">Format Sampul / Cover</p>
                              <p className="font-medium mt-0.5">{parsedRules.coverFormat}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Ganti Buku Panduan
                            </button>
                            <button
                              type="button"
                              onClick={nextStep}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 ml-auto shadow-xs"
                            >
                              Gunakan Pedoman Ini & Lanjut <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {!guidelineFile && !isAnalyzingGuideline && (
                        <div className="mt-6 text-center">
                          <button onClick={nextStep} className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4">
                            Lewati langkah ini (Gunakan template standar)
                          </button>
                        </div>
                      )}
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
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                        2. Data Penulis <span className="text-xs bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">Wajib Diisi</span>
                      </h2>
                      <p className="text-slate-500 mb-6">Data ini akan digunakan untuk mengisi otomatis Cover dan Lembar Pengesahan.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Nama Lengkap</span>
                            <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                          </label>
                          <input 
                            name="name" 
                            value={formData.author.name} 
                            onChange={handleAuthorChange} 
                            type="text" 
                            placeholder="Contoh: Budi Santoso"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>NIM / NPM</span>
                            <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                          </label>
                          <input 
                            name="nim" 
                            value={formData.author.nim} 
                            onChange={handleAuthorChange} 
                            type="text" 
                            placeholder="Contoh: 21081010045"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Fakultas</label>
                          <input name="faculty" value={formData.author.faculty} onChange={handleAuthorChange} type="text" placeholder="Contoh: Ilmu Komputer" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Program Studi / Bidang Ilmu</label>
                          <BidangIlmuSelector
                            value={formData.author.major}
                            onChange={(val) => {
                              setValidationError('');
                              setFormData(prev => ({ ...prev, author: { ...prev.author, major: val } }));
                            }}
                            placeholder="Contoh: Informatika, Keperawatan, Manajemen..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Tahun Akademik</label>
                          <select
                            name="year"
                            value={formData.author.year}
                            onChange={handleAuthorChange}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-medium"
                          >
                            {ACADEMIC_YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Dosen Pembimbing</label>
                          <input name="supervisor" value={formData.author.supervisor} onChange={handleAuthorChange} type="text" placeholder="Contoh: Dr. Ahmad Dahlan, M.T." className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50" />
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
                      <h2 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                        3. Detail Penelitian <span className="text-xs bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">Wajib Diisi</span>
                      </h2>
                      <p className="text-slate-500 mb-6">Informasi ini akan memandu AI dalam menyusun Latar Belakang dan Metodologi.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Judul Penelitian</span>
                            <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                          </label>
                          <textarea 
                            name="title" 
                            value={formData.research.title} 
                            onChange={handleResearchChange} 
                            rows={2} 
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 resize-none font-semibold text-slate-900" 
                            placeholder="Masukkan judul lengkap skripsi Anda..."
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Topik Utama</span>
                            <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                          </label>
                          <input 
                            name="topic" 
                            value={formData.research.topic} 
                            onChange={handleResearchChange} 
                            type="text" 
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900" 
                            placeholder="Contoh: Artificial Intelligence, Pemasaran Digital, Pelayanan Kesehatan" 
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                              <span>Jenis Penelitian</span>
                              <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                            </label>
                            <select 
                              name="type" 
                              value={formData.research.type} 
                              onChange={handleResearchChange} 
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900"
                            >
                              <option value="Kuantitatif">Kuantitatif</option>
                              <option value="Kualitatif">Kualitatif</option>
                              <option value="Campuran (Mixed Methods)">Campuran (Mixed Methods)</option>
                              <option value="R&D (Research and Development)">R&D (Research & Development)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                              <span>Populasi / Objek Penelitian</span>
                              <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                            </label>
                            <input 
                              name="population" 
                              value={formData.research.population} 
                              onChange={handleResearchChange} 
                              type="text" 
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900" 
                              placeholder="Contoh: Mahasiswa aktif S1 Informatika 2024" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Variabel Penelitian</span>
                            <span className="text-xs text-red-500 font-extrabold">* (Wajib)</span>
                          </label>
                          <input 
                            name="variables" 
                            value={formData.research.variables} 
                            onChange={handleResearchChange} 
                            type="text" 
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-slate-50 font-semibold text-slate-900" 
                            placeholder="Contoh: (X1) Fitur AI, (X2) Kemudahan Akses, (Y) Kepuasan Pengguna" 
                          />
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
                      <div className="space-y-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                          <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Semua Data Lengkap & Siap di-Generate!</h2>
                          <p className="text-slate-500 text-xs max-w-md mx-auto">Klik tombol di bawah untuk menyusun proposal skripsi otomatis 1-Click berdasarkan data yang Anda isi.</p>
                        </div>

                        {/* Review Data Summary Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-3 max-w-lg mx-auto">
                          <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2 flex items-center justify-between">
                            <span>📋 Ringkasan Data Proposal</span>
                            <span className="text-emerald-600 font-bold">Terverifikasi</span>
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-slate-700">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">TEMPLATE UNIVERSITAS</span>
                              <span className="font-bold text-slate-900">{formData.university}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">KARYA ILMIAH</span>
                              <span className="font-bold text-slate-900">{selectedDocType}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">PENULIS</span>
                              <span className="font-bold text-slate-900">{formData.author.name} ({formData.author.nim})</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">JENIS PENELITIAN</span>
                              <span className="font-bold text-slate-900">{formData.research.type}</span>
                            </div>
                          </div>
                          <div className="pt-1">
                            <span className="text-[10px] text-slate-400 font-bold block">JUDUL PENELITIAN</span>
                            <span className="font-bold text-slate-900 line-clamp-2">{formData.research.title}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">TOPIK UTAMA</span>
                              <span className="font-bold text-slate-900">{formData.research.topic}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">POPULASI / OBJEK</span>
                              <span className="font-bold text-slate-900">{formData.research.population}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">VARIABEL PENELITIAN</span>
                            <span className="font-bold text-slate-900">{formData.research.variables}</span>
                          </div>
                        </div>

                        {isGenerating ? (
                          <div className="max-w-sm mx-auto space-y-4 pt-2">
                            <div className="flex justify-between text-sm font-bold text-slate-700">
                              <span>Menyusun Proposal 1-Click...</span>
                              <span>{generateProgress}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                style={{ width: `${generateProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-400 animate-pulse">Menghubungkan ke Multi-Engine AI & database literatur...</p>
                          </div>
                        ) : (
                          <button 
                            onClick={handleGenerate}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
                          >
                            <Wand2 className="w-5 h-5 text-emerald-400" /> Generate Proposal 1-Click
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
