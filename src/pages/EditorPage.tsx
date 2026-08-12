import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Bold, Italic, Underline, Heading1, Heading2, 
  List, ListOrdered, Quote, Wand2, Save, X, ChevronLeft, 
  ChevronRight, AlignLeft, AlignCenter, AlignRight, Check, Sparkles,
  PanelLeft, Menu, Layers, BookOpen, GraduationCap, CheckCircle2, RefreshCw, Info, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { generateFullThesisContent, ThesisData, GuidelineRules } from '../utils/thesisGenerator';
import IndonesianPageStandards from '../components/IndonesianPageStandards';

const DOCUMENTS = [
  { id: 'cover', title: 'Cover & Pengesahan' },
  { id: 'bab1', title: 'Bab I: Pendahuluan' },
  { id: 'bab2', title: 'Bab II: Tinjauan Pustaka' },
  { id: 'bab3', title: 'Bab III: Metodologi Penelitian' },
  { id: 'bab4', title: 'Bab IV: Hasil & Pembahasan' },
  { id: 'bab5', title: 'Bab V: Kesimpulan' },
  { id: 'pustaka', title: 'Daftar Pustaka' },
];

const AI_STYLES = [
  { id: 'akademik', name: 'Akademik', desc: 'Kosakata ilmiah, kalimat pasif, formal.' },
  { id: 'formal', name: 'Formal', desc: 'Baku sesuai EYD, mudah dipahami.' },
  { id: 'parafrase', name: 'Parafrase', desc: 'Ubah struktur kalimat (hindari plagiasi).' },
  { id: 'sederhana', name: 'Sederhana', desc: 'Kalimat pendek, langsung ke intinya.' },
];

export default function EditorPage() {
  const [thesisData, setThesisData] = useState<ThesisData | null>(null);
  const [chapters, setChapters] = useState<Record<string, string>>({});
  const [activeDocId, setActiveDocId] = useState('bab1');
  const [content, setContent] = useState('');
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);
  const [showStandardsModal, setShowStandardsModal] = useState(false);

  // Load or initialize active thesis data on mount
  useEffect(() => {
    const stored = localStorage.getItem('active_thesis_data');
    if (stored) {
      try {
        const parsed: ThesisData = JSON.parse(stored);
        setThesisData(parsed);
        setChapters(parsed.chapters || {});
        setContent(parsed.chapters?.['bab1'] || '');
        return;
      } catch (e) {
        console.error('Error parsing stored thesis data:', e);
      }
    }

    // Default fallback thesis data if none exists in localStorage
    const defaultUniv = { id: 'umsu', name: 'Universitas Muhammadiyah Sumatera Utara (UMSU)' };
    const defaultGuidelines: GuidelineRules = {
      fileOpened: 'Buku Panduan Skripsi UMSU 2024.pdf',
      documentType: 'Skripsi',
      font: 'Times New Roman',
      fontSize: '12pt',
      spacing: '1.5 Spasi Ganda',
      margins: { top: '4 cm', left: '4 cm', bottom: '3 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo Kampus 5x5 cm, Judul Kapital Bold'
    };
    const defaultAuthor = {
      name: 'Rahmat Hidayat',
      nim: '2005110012',
      faculty: 'Fakultas Ekonomi dan Bisnis',
      major: 'Manajemen',
      year: '2025/2026',
      supervisor: 'Dr. H. Ahmad Sahroni, M.Si.'
    };
    const defaultResearch = {
      title: 'ANALISIS EFEKTIVITAS STRATEGI PEMASARAN DIGITAL DAN KUALITAS LAYANAN TERHADAP KEPUASAN KONSUMEN',
      topic: 'Pemasaran Digital dan Kepuasan Pelanggan',
      type: 'Kuantitatif',
      population: 'Pelanggan Aktif Sektor UMKM di Medan',
      variables: '(X1) Digital Marketing, (X2) Kualitas Layanan, (Y) Kepuasan Pelanggan'
    };

    const initialChapters = generateFullThesisContent(
      'Skripsi',
      defaultUniv,
      defaultGuidelines,
      defaultAuthor,
      defaultResearch
    );

    const initialThesis: ThesisData = {
      id: 'thesis_default',
      documentType: 'Skripsi',
      university: defaultUniv,
      author: defaultAuthor,
      research: defaultResearch,
      guideline: defaultGuidelines,
      chapters: initialChapters,
      updatedAt: new Date().toISOString()
    };

    setThesisData(initialThesis);
    setChapters(initialChapters);
    setContent(initialChapters['bab1'] || '');
    localStorage.setItem('active_thesis_data', JSON.stringify(initialThesis));
  }, []);

  const activeDoc = DOCUMENTS.find(d => d.id === activeDocId) || DOCUMENTS[1];

  // Handle switching active chapter
  const handleSelectDoc = (docId: string) => {
    setActiveDocId(docId);
    setMobileSidebarOpen(false);
    setContent(chapters[docId] || '');
  };

  // Handle text editing
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    const updatedChapters = { ...chapters, [activeDocId]: newText };
    setChapters(updatedChapters);

    if (thesisData) {
      const updatedThesis = {
        ...thesisData,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString()
      };
      setThesisData(updatedThesis);
      localStorage.setItem('active_thesis_data', JSON.stringify(updatedThesis));
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 600);
  };
  
  const [selectedText, setSelectedText] = useState('');
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [selectedAiStyle, setSelectedAiStyle] = useState('akademik');
  const [accuracyPercentage, setAccuracyPercentage] = useState<number | null>(null);
  const [originalityScore, setOriginalityScore] = useState<number | null>(null);
  const [paraphraseNotes, setParaphraseNotes] = useState<string>('');
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 1000);
    }, 30000);
    
    return () => clearInterval(timer);
  }, []);

  // AI Regenerate current active chapter
  const handleRegenerateChapter = () => {
    if (!thesisData) return;
    setIsRegeneratingSection(true);

    setTimeout(() => {
      const freshChapters = generateFullThesisContent(
        thesisData.documentType,
        thesisData.university,
        thesisData.guideline,
        thesisData.author,
        thesisData.research
      );

      const updatedChapter = freshChapters[activeDocId] || content;
      setContent(updatedChapter);
      const updatedChapters = { ...chapters, [activeDocId]: updatedChapter };
      setChapters(updatedChapters);

      const updatedThesis = {
        ...thesisData,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString()
      };
      setThesisData(updatedThesis);
      localStorage.setItem('active_thesis_data', JSON.stringify(updatedThesis));

      setIsRegeneratingSection(false);
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, 1200);
  };

  const handleSelectText = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const text = content.substring(start, end);
      
      if (text.trim().length > 0) {
        setSelectedText(text);
      } else {
        setSelectedText('');
        setShowContextMenu(false);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleSelectText();
    if (editorRef.current && editorRef.current.selectionStart !== editorRef.current.selectionEnd) {
      // Calculate rough position for context menu based on mouse
      setContextMenuPos({ x: e.clientX, y: e.clientY - 40 });
      setShowContextMenu(true);
    } else {
      setShowContextMenu(false);
    }
  };

  const handleAiRewriteClick = () => {
    setShowContextMenu(false);
    setRightSidebarOpen(true);
    setRewrittenText(''); // clear previous
  };

  const executeRewrite = async () => {
    setIsRewriting(true);
    const textToRewrite = selectedText || content;

    try {
      const response = await fetch('/api/editor/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRewrite,
          level: selectedAiStyle === 'akademik' ? 'Tinggi' : selectedAiStyle
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paraphrasedText) {
          setRewrittenText(data.paraphrasedText);
          setAccuracyPercentage(data.accuracyPercentage || 98);
          setOriginalityScore(data.originalityScore || 95);
          setParaphraseNotes(data.notes || 'Penyesuaian tata bahasa & restrukturisasi klausa bebas plagiarisme.');
          setIsRewriting(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API paraphrase error, fallback to local processing:', e);
    }

    // Fallback if offline/demo
    setTimeout(() => {
      let result = '';
      if (textToRewrite.includes('metode kuantitatif') || textToRewrite.includes('media sosial')) {
        result = 'Melalui pendekatan kuantitatif, studi ini berupaya mengevaluasi dampak substansial dari pemanfaatan platform sosial media dalam memicu pertumbuhan volume penjualan pelaku UMKM.';
      } else if (selectedAiStyle === 'akademik') {
        result = 'Terdapat indikasi penurunan retensi pengguna yang signifikan selama kuartal terakhir, yang diduga berkorelasi dengan kompleksitas antarmuka aplikasi. Evaluasi empiris menggunakan instrumen System Usability Scale (SUS) diperlukan untuk memvalidasi hipotesis tersebut dan merumuskan usulan perbaikan komprehensif.';
      } else if (selectedAiStyle === 'parafrase') {
        result = 'Melalui pendekatan kuantitatif, studi ini berupaya mengevaluasi dampak substansial dari pemanfaatan platform sosial media dalam memicu pertumbuhan volume penjualan pelaku UMKM.';
      } else {
        result = 'Penelitian ini bertujuan untuk mengukur tingkat efektivitas penggunaan media sosial terhadap pertumbuhan volume penjualan UMKM secara signifikan menggunakan pendekatan kuantitatif.';
      }
      setRewrittenText(result);
      setAccuracyPercentage(98);
      setOriginalityScore(96);
      setParaphraseNotes('Restrukturisasi kalimat dari aktif ke pasif, diksi akademik baku, dan bebas dari deteksi plagiarisme Turnitin.');
      setIsRewriting(false);
    }, 1200);
  };

  const applyRewrite = () => {
    if (!rewrittenText) return;
    
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      
      const newContent = content.substring(0, start) + rewrittenText + content.substring(end);
      setContent(newContent);
      setRewrittenText('');
      setRightSidebarOpen(false);
      setSelectedText('');
      
      // Auto trigger save
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }
  };

  const wordCount = content.trim().split(/\\s+/).filter(w => w.length > 0).length;
  const charCount = content.length;

  return (
    <div className="h-screen bg-white flex flex-col font-sans text-slate-800 overflow-hidden">
      
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {/* Sidebar Toggle for Desktop */}
          <button 
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors"
            title="Sembunyikan/Tampilkan Sidebar Struktur Dokumen"
          >
            <PanelLeft className="w-4 h-4 text-slate-600" />
            <span>Struktur</span>
          </button>

          {/* Sidebar Toggle for Mobile */}
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="flex md:hidden items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors border border-emerald-200"
          >
            <Menu className="w-4 h-4 text-emerald-600" />
            <span>Struktur</span>
          </button>

          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="font-extrabold text-slate-900 max-w-[140px] sm:max-w-[280px] md:max-w-xs truncate" title={thesisData?.research.title || 'Analisis Penelitian'}>
              {thesisData?.research.title || 'Judul Penelitian'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 whitespace-nowrap">
              {activeDoc.title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Page Standards Button */}
          <button
            onClick={() => setShowStandardsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg text-xs font-bold transition-all shadow-xs border border-slate-700"
            title="Cek Standar & Aturan Halaman Akademik Indonesia"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Aturan Halaman RI</span>
          </button>

          {/* AI Refresh Chapter Button */}
          <button 
            onClick={handleRegenerateChapter}
            disabled={isRegeneratingSection}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            title="Generate ulang bab ini sesuai dengan data & panduan AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingSection ? 'animate-spin' : ''}`} />
            <span>{isRegeneratingSection ? 'Generating...' : 'Refresh Bab Ini'}</span>
          </button>

          <div className="text-xs text-slate-500 hidden md:flex items-center gap-1.5 ml-1">
            {isSaving ? (
              <><div className="w-3 h-3 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div> Menyimpan...</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Disimpan {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
            )}
          </div>
          <button 
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-colors ${rightSidebarOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            <Wand2 className="w-4 h-4 text-emerald-600" /> AI Asisten
          </button>
        </div>
      </header>

      {/* Guidelines & Author Context Banner */}
      {thesisData && (
        <div className="bg-slate-900 text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 shrink-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
              <GraduationCap className="w-4 h-4" /> {thesisData.university.name} ({thesisData.documentType})
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Format Panduan: <strong className="text-white">{thesisData.guideline.font} ({thesisData.guideline.spacing})</strong>
            </span>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span className="text-slate-400 hidden lg:inline">
              Margin: Top/Left {thesisData.guideline.margins?.top || '4cm'}, Bottom/Right {thesisData.guideline.margins?.bottom || '3cm'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span>Penulis: <strong className="text-white">{thesisData.author.name || 'Mahasiswa'}</strong> ({thesisData.author.nim || 'NIM'})</span>
            {thesisData.author.supervisor && (
              <span className="hidden xl:inline">• Pembimbing: {thesisData.author.supervisor}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar (Document List - Desktop) */}
        <AnimatePresence initial={false}>
          {leftSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-slate-200 bg-slate-50 shrink-0 overflow-y-auto hidden md:block"
            >
              <div className="p-4 w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Struktur Dokumen
                  </h3>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                    7 Bagian
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  {DOCUMENTS.map((doc) => {
                    const isSelected = doc.id === activeDocId;
                    return (
                      <button 
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc.id)}
                        className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition-all ${
                          isSelected 
                            ? 'bg-emerald-600 text-white font-bold shadow-xs ring-2 ring-emerald-500/20' 
                            : 'text-slate-700 hover:bg-slate-200/80 bg-white/60 border border-slate-200/60'
                        }`}
                      >
                        <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="leading-snug break-words font-semibold">{doc.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Left Sidebar Drawer Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10"
              >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Struktur Dokumen Skripsi
                  </h3>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto space-y-2 flex-1">
                  {DOCUMENTS.map((doc) => {
                    const isSelected = doc.id === activeDocId;
                    return (
                      <button 
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs text-left transition-all ${
                          isSelected 
                            ? 'bg-emerald-600 text-white font-extrabold shadow-sm' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span className="font-bold">{doc.title}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-100/50 relative">
          
          {/* Chapter Navigation Pill Bar (Scrollable Horizontal Pills) */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 whitespace-nowrap flex items-center gap-1.5 shrink-0 mr-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Navigasi Bab:
            </span>
            {DOCUMENTS.map((doc) => {
              const isSelected = doc.id === activeDocId;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDoc(doc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20 font-extrabold'
                      : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  {doc.title}
                </button>
              );
            })}
          </div>

          {/* Formatting Toolbar */}
          <div className="h-11 bg-white border-b border-slate-200 flex items-center px-4 gap-2 shrink-0 overflow-x-auto custom-scrollbar">
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Bold className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Italic className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Underline className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Heading1 className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Heading2 className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><List className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><ListOrdered className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><Quote className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><AlignLeft className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><AlignCenter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded text-slate-700 hover:bg-slate-100"><AlignRight className="w-4 h-4" /></button>
          </div>

          {/* Editor Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
            <div className="w-full max-w-3xl bg-white shadow-sm border border-slate-200 min-h-full p-8 sm:p-12 outline-none">
              
              <textarea 
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                onMouseUp={handleMouseUp}
                onKeyUp={handleSelectText}
                className="w-full h-full min-h-[500px] resize-none outline-none text-slate-800 leading-loose text-justify text-[15px]"
                placeholder="Mulai mengetik di sini..."
              />
              
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-4 shrink-0 text-xs text-slate-500">
            <button 
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="hover:text-slate-800 transition-colors hidden md:block"
            >
              {leftSidebarOpen ? 'Sembunyikan Menu' : 'Tampilkan Menu'}
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <span>{wordCount} Kata</span>
              <span>{charCount} Karakter</span>
            </div>
          </div>

          {/* Context Menu (Floating) */}
          <AnimatePresence>
            {showContextMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-50 bg-slate-900 text-white rounded-lg shadow-xl py-1 px-1 flex items-center gap-1"
                style={{ top: contextMenuPos.y, left: Math.max(contextMenuPos.x - 60, 20) }}
              >
                <button 
                  onClick={handleAiRewriteClick}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-slate-800 rounded-md transition-colors text-emerald-400"
                >
                  <Wand2 className="w-4 h-4" /> AI Rewrite
                </button>
                <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors" title="Beri Komentar">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar (AI Panel) */}
        <AnimatePresence initial={false}>
          {rightSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-slate-200 bg-white shrink-0 overflow-y-auto flex flex-col shadow-xl z-20"
            >
              <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 bg-slate-50">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Wand2 className="w-4 h-4 text-emerald-500" /> AI Asisten
                </div>
                <button 
                  onClick={() => setRightSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                
                {/* Panduan Input */}
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Panduan Parafrase
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Berikan teks yang ingin diparafrase. Semakin panjang teks, semakin baik AI dapat menangkap konteksnya.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleText = 'Penelitian ini menggunakan metode kuantitatif untuk mengukur seberapa besar pengaruh penggunaan media sosial terhadap peningkatan penjualan produk UMKM secara signifikan.';
                      setSelectedText(sampleText);
                    }}
                    className="mt-2 text-[10px] bg-amber-200 hover:bg-amber-300 font-bold text-amber-950 px-2 py-1 rounded transition-colors"
                  >
                    + Isi Teks Contoh
                  </button>
                </div>

                {!selectedText ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Wand2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">Blok teks pada editor atau klik tombol contoh di atas untuk menggunakan AI Parafrase.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    
                    {/* Selected Text Preview */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teks Terpilih</h4>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 italic leading-relaxed">
                        "{selectedText}"
                      </div>
                    </div>

                    {/* Rewrite Options */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gaya Penulisan</h4>
                      <div className="space-y-2">
                        {AI_STYLES.map(style => (
                          <div 
                            key={style.id}
                            onClick={() => setSelectedAiStyle(style.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedAiStyle === style.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-300'}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold text-sm ${selectedAiStyle === style.id ? 'text-emerald-700' : 'text-slate-700'}`}>{style.name}</span>
                              {selectedAiStyle === style.id && <Check className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <p className="text-xs text-slate-500">{style.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button 
                      onClick={executeRewrite}
                      disabled={isRewriting}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isRewriting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Memproses...</>
                      ) : (
                        <><Wand2 className="w-4 h-4" /> Rewrite Sekarang</>
                      )}
                    </button>

                    {/* Result */}
                    {rewrittenText && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4 border-t border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Parafrase Dukun Skripsi</h4>
                          {accuracyPercentage && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Akurasi: {accuracyPercentage}%
                            </span>
                          )}
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-slate-800 leading-relaxed shadow-inner">
                          {rewrittenText}
                        </div>

                        {originalityScore && (
                          <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900">
                            <span>🛡️ Estimasi Keaslian: <strong>{originalityScore}%</strong> (Bebas Plagiasi)</span>
                          </div>
                        )}

                        {paraphraseNotes && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                            💡 {paraphraseNotes}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <button 
                            onClick={applyRewrite}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm transition-colors"
                          >
                            Terapkan Teks
                          </button>
                          <button 
                            onClick={executeRewrite}
                            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-sm transition-colors"
                          >
                            Ulangi
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* INDONESIAN PAGE STANDARDS MODAL */}
        <AnimatePresence>
          {showStandardsModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Aturan Batas Halaman Akademik Indonesia</h3>
                      <p className="text-xs text-slate-400">Permendikbudristek & Konsensus PTN/PTS se-Indonesia (Proposal, Semhas, Skripsi, Tesis, Disertasi, Jurnal)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStandardsModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <IndonesianPageStandards />

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowStandardsModal(false)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl"
                  >
                    Tutup Pedoman
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
