import React, { useState } from 'react';
import { 
  UploadCloud, Settings, FileText, Download, CheckCircle2, 
  Search, Wand2, ArrowRight, History, FileDown, AlertCircle, Building2, MapPin, Tag,
  Scale, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { DEFAULT_UNIVERSITIES, UniversityTemplate } from '../data/universities';
import IndonesianPageStandards from '../components/IndonesianPageStandards';

const RECENT_FORMATS = [
  { id: 1, name: 'Bab_1_Pendahuluan.docx', date: 'Hari ini, 10:30', status: 'Selesai', univ: 'Universitas Indonesia (UI)' },
  { id: 2, name: 'Draft_Skripsi_Full.pdf', date: 'Kemarin, 15:45', status: 'Selesai', univ: 'Universitas Gadjah Mada (UGM)' },
];

export default function AutoFormatPage() {
  const [mainTab, setMainTab] = useState<'formatter' | 'standards'>('formatter');
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchUniv, setSearchUniv] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedUnivObj, setSelectedUnivObj] = useState<UniversityTemplate>(DEFAULT_UNIVERSITIES[0]);
  
  const [formatSettings, setFormatSettings] = useState({
    font: 'Times New Roman',
    size: '12',
    spacing: '1.5',
    margin: { top: '4', bottom: '3', left: '4', right: '3' },
    pageNumber: 'Kanan Atas / Bawah Tengah'
  });

  const [isFormatting, setIsFormatting] = useState(false);
  const [formatProgress, setFormatProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const categories = ['Semua', 'PTN', 'PTS', 'PTKIN', 'Politeknik', 'Sekolah Tinggi'];

  const filteredUnivs = DEFAULT_UNIVERSITIES.filter(u => {
    const matchesCategory = selectedCategory === 'Semua' || u.category === selectedCategory;
    const matchesSearch = u.name.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.city.toLowerCase().includes(searchUniv.toLowerCase()) ||
                          u.province.toLowerCase().includes(searchUniv.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectUniv = (univ: UniversityTemplate) => {
    setSelectedUnivObj(univ);
    if (univ.formatPreset) {
      setFormatSettings({
        font: univ.formatPreset.font.split('/')[0].trim(),
        size: univ.formatPreset.fontSize.replace('pt', ''),
        spacing: univ.formatPreset.lineSpacing,
        margin: {
          top: univ.formatPreset.margins.top.replace(' cm', ''),
          bottom: univ.formatPreset.margins.bottom.replace(' cm', ''),
          left: univ.formatPreset.margins.left.replace(' cm', ''),
          right: univ.formatPreset.margins.right.replace(' cm', ''),
        },
        pageNumber: univ.formatPreset.pageNumberPos
      });
    }
  };

  const processUploadedDoc = async (file: File) => {
    setSelectedFile(file);
    setStep(2);

    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const formData = new FormData();
        formData.append('guidebook', file);
        const res = await fetch('/api/pdf-chat/parse-guidebook', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          const analysis = data.analysis;
          if (analysis) {
            if (analysis.font) setFormatSettings(prev => ({ ...prev, font: analysis.font }));
            if (analysis.fontSize) setFormatSettings(prev => ({ ...prev, size: analysis.fontSize.replace('pt', '') }));
            if (analysis.spacing) setFormatSettings(prev => ({ ...prev, spacing: analysis.spacing }));
            if (analysis.margins) {
              setFormatSettings(prev => ({
                ...prev,
                margin: {
                  top: analysis.margins.top?.replace(' cm', '') || '4',
                  bottom: analysis.margins.bottom?.replace(' cm', '') || '3',
                  left: analysis.margins.left?.replace(' cm', '') || '4',
                  right: analysis.margins.right?.replace(' cm', '') || '3',
                }
              }));
            }
          }
        }
      } catch (e) {
        console.error('Auto detection error:', e);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedDoc(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedDoc(e.dataTransfer.files[0]);
    }
  };

  const startFormatting = () => {
    setIsFormatting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsFormatting(false);
          setIsFinished(true);
        }, 500);
      }
      setFormatProgress(progress);
    }, 300);
  };

  const resetProcess = () => {
    setStep(1);
    setSelectedFile(null);
    setIsFinished(false);
    setFormatProgress(0);
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
          <h1 className="font-semibold text-slate-700">Auto Format & Pedoman Akademik</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMainTab('formatter')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mainTab === 'formatter' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto Format</span>
          </button>
          <button
            onClick={() => setMainTab('standards')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mainTab === 'standards' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pedoman Halaman RI (SN-Dikti)</span>
          </button>
        </div>
      </header>

      {mainTab === 'standards' ? (
        <div className="bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <IndonesianPageStandards />
          </div>
        </div>
      ) : (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Work Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Steps Indicator */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <span className={`text-sm font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>Upload</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <span className={`text-sm font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>Pengaturan</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${isFormatting || isFinished ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isFormatting || isFinished ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                <span className={`text-sm font-semibold ${isFormatting || isFinished ? 'text-slate-900' : 'text-slate-500'}`}>Selesai</span>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Upload */}
                {step === 1 && !isFinished && !isFormatting && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">Upload Dokumen</h2>
                    <p className="text-slate-500 mb-8">Upload file skripsi Anda (.docx atau .pdf) untuk diformat ulang sesuai panduan kampus.</p>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-300 rounded-3xl p-12 hover:bg-slate-50 hover:border-emerald-400 transition-colors cursor-pointer group relative"
                    >
                      <input 
                        type="file" 
                        accept=".docx,.pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">Pilih atau letakkan file di sini</h3>
                      <p className="text-sm text-slate-500">Mendukung file DOCX dan PDF (Max 20MB)</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Settings */}
                {step === 2 && !isFinished && !isFormatting && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{selectedFile?.name}</p>
                          <p className="text-xs text-slate-500">{(selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0)} MB</p>
                        </div>
                      </div>
                      <button onClick={() => setStep(1)} className="text-xs font-bold text-red-500 hover:text-red-600">Ganti File</button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600" /> Pilih Template Universitas (Kemendikdasmen / Dikti)
                        </h3>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          Data Resmi DIKTI
                        </span>
                      </div>

                      {/* Category Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 custom-scrollbar">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                              selectedCategory === cat 
                                ? 'bg-emerald-500 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          value={searchUniv}
                          onChange={(e) => setSearchUniv(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" 
                          placeholder="Cari universitas, kota, atau provinsi..." 
                        />
                      </div>

                      {/* University Card Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                        {filteredUnivs.map((univ) => {
                          const isSelected = selectedUnivObj.id === univ.id;
                          return (
                            <div 
                              key={univ.id}
                              onClick={() => handleSelectUniv(univ)}
                              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20' 
                                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className={`text-xs font-extrabold leading-snug ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                                  {univ.name}
                                </span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" /> {univ.city}, {univ.province}
                                </span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                                  {univ.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Univ Preset Banner */}
                      {selectedUnivObj && (
                        <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-bold">Template Aktif: {selectedUnivObj.name}</p>
                            <p className="text-[10px] text-emerald-700">
                              Format: {selectedUnivObj.formatPreset.font} ({selectedUnivObj.formatPreset.fontSize}) • Spasi {selectedUnivObj.formatPreset.lineSpacing} • Margin {selectedUnivObj.formatPreset.margins.top}-{selectedUnivObj.formatPreset.margins.bottom}-{selectedUnivObj.formatPreset.margins.left}-{selectedUnivObj.formatPreset.margins.right}
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-1 rounded-lg shrink-0">
                            Auto-Preset
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-emerald-500" /> Konfigurasi Format
                        </h3>
                        {selectedUnivObj.name !== 'Deteksi Otomatis (AI)' && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Diisi otomatis oleh template</span>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Font Family</label>
                            <select 
                              value={formatSettings.font}
                              onChange={(e) => setFormatSettings({...formatSettings, font: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                            >
                              <option>Times New Roman</option>
                              <option>Arial</option>
                              <option>Calibri</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Spasi Baris</label>
                            <select 
                              value={formatSettings.spacing}
                              onChange={(e) => setFormatSettings({...formatSettings, spacing: e.target.value})}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                            >
                              <option>1.0</option>
                              <option>1.15</option>
                              <option>1.5</option>
                              <option>2.0</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">Margin (cm)</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 bg-white px-2 py-1.5 border border-slate-300 rounded-lg">
                              <span className="text-xs text-slate-400 w-8">Atas</span>
                              <input type="text" value={formatSettings.margin.top} onChange={(e) => setFormatSettings({...formatSettings, margin: {...formatSettings.margin, top: e.target.value}})} className="w-full bg-transparent text-sm font-medium outline-none" />
                            </div>
                            <div className="flex items-center gap-2 bg-white px-2 py-1.5 border border-slate-300 rounded-lg">
                              <span className="text-xs text-slate-400 w-8">Bawah</span>
                              <input type="text" value={formatSettings.margin.bottom} onChange={(e) => setFormatSettings({...formatSettings, margin: {...formatSettings.margin, bottom: e.target.value}})} className="w-full bg-transparent text-sm font-medium outline-none" />
                            </div>
                            <div className="flex items-center gap-2 bg-white px-2 py-1.5 border border-slate-300 rounded-lg">
                              <span className="text-xs text-slate-400 w-8">Kiri</span>
                              <input type="text" value={formatSettings.margin.left} onChange={(e) => setFormatSettings({...formatSettings, margin: {...formatSettings.margin, left: e.target.value}})} className="w-full bg-transparent text-sm font-medium outline-none" />
                            </div>
                            <div className="flex items-center gap-2 bg-white px-2 py-1.5 border border-slate-300 rounded-lg">
                              <span className="text-xs text-slate-400 w-8">Kanan</span>
                              <input type="text" value={formatSettings.margin.right} onChange={(e) => setFormatSettings({...formatSettings, margin: {...formatSettings.margin, right: e.target.value}})} className="w-full bg-transparent text-sm font-medium outline-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={startFormatting}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        <Wand2 className="w-5 h-5" /> Mulai Auto-Format
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Processing & Finished */}
                {(isFormatting || isFinished) && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    {!isFinished ? (
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Wand2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900">Sedang Memformat Dokumen...</h2>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-bold text-slate-700">
                            <span>Merapikan margin & spasi</span>
                            <span>{formatProgress}%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                              style={{ width: `${formatProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Format Selesai!</h2>
                          <p className="text-slate-500">Dokumen Anda telah berhasil dirapikan sesuai template <strong>{selectedUnivObj.name}</strong>.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <button className="flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                            <FileDown className="w-5 h-5" /> Download DOCX
                          </button>
                          <button className="flex justify-center items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all">
                            <FileDown className="w-5 h-5" /> Download PDF
                          </button>
                        </div>

                        <div className="pt-8">
                          <button onClick={resetProcess} className="text-emerald-600 font-bold hover:text-emerald-700 text-sm underline underline-offset-4">
                            Format dokumen lain
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Sidebar - History & Tips */}
        <div className="space-y-6">
          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Riwayat Format
              </h3>
            </div>
            <div className="space-y-3">
              {RECENT_FORMATS.map(doc => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{doc.name}</p>
                      <p className="text-xs text-slate-500 truncate">{doc.univ}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">{doc.status}</span>
                        <span className="text-[10px] text-slate-400">{doc.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" /> Tips Auto-Format
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                Pastikan dokumen awal tidak dikunci (password protected).
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                Format tabel mungkin perlu disesuaikan manual jika terlalu kompleks.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                Gunakan opsi 'Deteksi Otomatis' jika kampus Anda tidak ada di daftar.
              </li>
            </ul>
          </div>
        </div>

      </main>
      )}
    </div>
  );
}

// Dummy icon component just to avoid importing another lucide icon inline
function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
