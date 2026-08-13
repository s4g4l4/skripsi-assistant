import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Upload, Send, Sparkles, BookOpen, Search, Highlighter, 
  Quote, CheckCircle2, Copy, AlertCircle, ArrowLeft, RefreshCw, 
  Cpu, FileCheck, ExternalLink, Layers, ChevronRight, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface PdfDoc {
  id: string;
  filename: string;
  title: string;
  pageCount: number;
  chunksCount: number;
  uploadedAt: string;
}

interface Highlight {
  page: number;
  quote: string;
  relevance: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  highlights?: Highlight[];
  citations?: { format: string; text: string }[];
  timestamp: string;
}

export default function PdfChatPage() {
  const [documents, setDocuments] = useState<PdfDoc[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('demo-journal-1');
  const [activeDoc, setActiveDoc] = useState<any>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Halo! Saya asisten RAG AI Dukun Skripsi. Dokumen referensimu sudah di-index. Tanyakan apa saja tentang metodologi, teori, sampel, temuan, atau minta saya mengekstrak sitasi APA/IEEE.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputQuestion, setInputQuestion] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedHighlightPage, setSelectedHighlightPage] = useState<number | null>(null);
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [citationData, setCitationData] = useState<any>(null);
  const [loadingCitation, setLoadingCitation] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (activeDocId) {
      fetchDocumentDetails(activeDocId);
    }
  }, [activeDocId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingAnswer]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/pdf-chat/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch {
      // Fallback
    }
  };

  const fetchDocumentDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/pdf-chat/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveDoc(data.document);
      }
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/pdf-chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        await fetchDocuments();
        setActiveDocId(data.document.id);
        setMessages([
          {
            id: `m-${Date.now()}`,
            sender: 'ai',
            text: `Dokumen "${data.document.title}" berhasil diunggah dan di-index (${data.document.chunksCount} text chunks ke Vector Store). Silakan ajukan pertanyaan!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, gagal mengunggah atau memproses dokumen.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleSendQuestion = async (qText?: string) => {
    const question = qText || inputQuestion;
    if (!question.trim() || loadingAnswer) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!qText) setInputQuestion('');
    setLoadingAnswer(true);

    try {
      const res = await fetch('/api/pdf-chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: activeDocId,
          question,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          highlights: data.highlights,
          citations: data.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        if (data.highlights && data.highlights.length > 0) {
          setSelectedHighlightPage(data.highlights[0].page);
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, terjadi kesalahan saat membaca indeks dokumen. Silakan coba lagi.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleExtractCitations = async () => {
    setCitationModalOpen(true);
    setLoadingCitation(true);
    try {
      const res = await fetch('/api/pdf-chat/extract-citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: activeDocId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCitationData(data.citations);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingCitation(false);
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white">Chat dengan Dokumen PDF (RAG)</h1>
              <p className="text-xs text-slate-400 hidden sm:block">AI Vector Indexing & Extraction</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExtractCitations}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-xs font-semibold text-white transition-all shadow-sm shadow-indigo-600/20 border border-indigo-500/30"
          >
            <Quote className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekstrak Sitasi APA</span>
          </button>

          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer transition-all shadow-sm shadow-emerald-600/20">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Document Reader & Vector Highlights */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 flex flex-col h-[50vh] lg:h-auto overflow-hidden">
          
          {/* Active Document Selector Header */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex-shrink-0">Dokumen:</span>
              <select
                value={activeDocId}
                onChange={(e) => setActiveDocId(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-emerald-500 max-w-[200px] sm:max-w-xs truncate"
              >
                {documents.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            {activeDoc && (
              <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeDoc.pageCount} Halaman</span>
                <span className="text-slate-600">•</span>
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeDoc.chunksCount} Chunks Indexed</span>
              </div>
            )}
          </div>

          {/* Document Content / Highlighted Passages View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {uploading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="font-semibold text-slate-200">Membaca dan Meng-index Dokumen PDF...</p>
                <p className="text-xs max-w-xs">Membuat text chunks & menghitung vector embeddings untuk RAG Search.</p>
              </div>
            ) : activeDoc ? (
              <div className="space-y-4">
                
                {/* Doc Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                        <FileCheck className="w-3 h-3" /> PDF Vector Indexed
                      </span>
                      <h2 className="text-sm font-bold text-white line-clamp-2">{activeDoc.title}</h2>
                      <p className="text-xs text-slate-400 mt-1">{activeDoc.filename}</p>
                    </div>
                  </div>
                </div>

                {/* Filter Highlight Badge */}
                {selectedHighlightPage && (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg text-xs text-amber-300">
                    <span className="flex items-center gap-2">
                      <Highlighter className="w-4 h-4 text-amber-400" />
                      Halaman {selectedHighlightPage} disorot berdasarkan pertanyaan AI
                    </span>
                    <button 
                      onClick={() => setSelectedHighlightPage(null)}
                      className="text-amber-400 hover:text-white font-medium underline"
                    >
                      Tampilkan Semua
                    </button>
                  </div>
                )}

                {/* Indexed Text Chunks list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passage Dokumen / Text Chunks</h3>
                  {activeDoc.chunks?.map((chunk: any) => {
                    const isHighlighted = selectedHighlightPage === chunk.page;
                    return (
                      <div
                        key={chunk.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                          isHighlighted 
                            ? 'bg-amber-950/30 border-amber-500/50 text-slate-100 shadow-md ring-1 ring-amber-500/30' 
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/60">
                          <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isHighlighted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            Halaman {chunk.page}
                          </span>
                          {isHighlighted && (
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Sitasi Terkait
                            </span>
                          )}
                        </div>
                        <p className={isHighlighted ? 'font-medium text-amber-100' : 'text-slate-300'}>
                          "{chunk.text}"
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Pilih atau unggah dokumen PDF untuk memulai.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: RAG Interactive Chat Window */}
        <div className="w-full lg:w-1/2 flex flex-col h-[50vh] lg:h-auto bg-slate-900">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Highlight references badge */}
                  {msg.highlights && msg.highlights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                      <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Highlighter className="w-3.5 h-3.5" /> Teks Disorot di Dokumen:
                      </p>
                      {msg.highlights.map((h, i) => (
                        <div 
                          key={i}
                          onClick={() => setSelectedHighlightPage(h.page)}
                          className="p-2 rounded bg-slate-900/60 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-semibold text-emerald-300">Halaman {h.page}</span>
                            <span className="group-hover:text-emerald-400 flex items-center gap-0.5">
                              Sorot di PDF <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                          <p className="italic text-slate-300 text-[11px]">"{h.quote}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Citations badge */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 flex items-center justify-between bg-indigo-950/40 border border-indigo-500/30 rounded p-2 text-[11px]">
                      <span className="text-indigo-300 truncate mr-2">{msg.citations[0].text}</span>
                      <button
                        onClick={() => copyToClipboard(msg.citations![0].text, 'chat-cit')}
                        className="text-indigo-400 hover:text-white flex-shrink-0 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedFormat === 'chat-cit' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </motion.div>
            ))}

            {loadingAnswer && (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 p-3 rounded-2xl rounded-bl-none max-w-xs text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AI sedang menganalisis vector chunks...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="p-2 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 flex-shrink-0">Cepat:</span>
            {[
              'Metodologi & Sampel',
              'Temuan Utama',
              'Landasan Teori',
              'Ringkas Kesimpulan',
              'Keterbatasan Penelitian'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(`Tolong uraikan ${prompt.toLowerCase()} dari dokumen ini.`)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
              placeholder="Tanyakan isi dokumen PDF..."
              disabled={loadingAnswer}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendQuestion()}
              disabled={loadingAnswer || !inputQuestion.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-all shadow-sm shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Citation Extraction Modal */}
      <AnimatePresence>
        {citationModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm text-white">Hasil Ekstraksi Sitasi & Referensi Dokumen</h3>
                </div>
                <button 
                  onClick={() => setCitationModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                >
                  Tutup
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs">
                {loadingCitation ? (
                  <div className="p-8 text-center space-y-3">
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-slate-300">Mengidentifikasi metadata, penulis, dan format sitasi APA/IEEE...</p>
                  </div>
                ) : citationData ? (
                  <>
                    {/* Metadata Box */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-indigo-300 text-sm">{citationData.metadata?.title}</h4>
                      <p className="text-slate-400">Penulis: <span className="text-slate-200">{citationData.metadata?.authors?.join(', ')}</span></p>
                      <p className="text-slate-400">Tahun: <span className="text-slate-200">{citationData.metadata?.year}</span></p>
                      <p className="text-slate-400">Jurnal/Penerbit: <span className="text-slate-200">{citationData.metadata?.journalOrPublisher}</span></p>
                    </div>

                    {/* APA Citation Format */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300">Format APA 7th Edition:</span>
                        <button
                          onClick={() => copyToClipboard(citationData.metadata?.apaCitation, 'apa')}
                          className="text-indigo-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedFormat === 'apa' ? 'Tersalin!' : 'Salin APA'}
                        </button>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 select-all">
                        {citationData.metadata?.apaCitation}
                      </div>
                    </div>

                    {/* IEEE Citation Format */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300">Format IEEE:</span>
                        <button
                          onClick={() => copyToClipboard(citationData.metadata?.ieeeCitation, 'ieee')}
                          className="text-indigo-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedFormat === 'ieee' ? 'Tersalin!' : 'Salin IEEE'}
                        </button>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-indigo-300 select-all">
                        {citationData.metadata?.ieeeCitation}
                      </div>
                    </div>

                    {/* Key Quotes Extracted */}
                    {citationData.keyQuotes && citationData.keyQuotes.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h5 className="font-bold text-slate-300">Kutipan Utama & Halaman:</h5>
                        {citationData.keyQuotes.map((q: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                              Halaman {q.page} - {q.topic}
                            </span>
                            <p className="italic text-slate-300">"{q.quote}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500">Tidak ada data sitasi.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
