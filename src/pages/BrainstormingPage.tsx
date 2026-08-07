import React, { useState, useRef, useEffect } from 'react';
import { 
  Lightbulb, Search, Plus, Tag, History, Send, 
  MessageSquare, ChevronLeft, Sparkles, Target, 
  BookOpen, ChevronRight, Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const FIELDS_OF_STUDY = [
  'Manajemen Pemasaran',
  'Ilmu Komputer & Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Manajemen Bisnis',
  'Psikologi',
  'Pendidikan',
  'Ilmu Komunikasi'
];

const PREVIOUS_SESSIONS = [
  { id: 1, title: 'AI dalam Pendidikan', date: 'Kemarin' },
  { id: 2, title: 'Sistem Pakar Diagnosa', date: '3 hari yang lalu' },
];

const QUICK_REPLIES = [
  'Aku bingung mau ambil judul skripsi tentang apa di bidang manajemen pemasaran. Bisa bantu brainstorm?',
  'Tolong parafrasekan paragraf ini agar lebih natural dan bebas plagiarisme: [Sertakan teks paragraf draf skripsi di sini]',
  'Apa saja yang perlu dipersiapkan untuk simulasi sidang?',
  'Bagaimana menentukan metode penelitian kuantitatif?',
  'Bantu buatkan rumusan masalah & tujuan penelitian'
];

type ChatMessage = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
};

type SuggestedTitle = {
  id: string;
  judul: string;
  relevance_score: number;
  alasan: string;
};

export default function BrainstormingPage() {
  const [topic, setTopic] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [field, setField] = useState(FIELDS_OF_STUDY[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTitle[]>([]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '0', sender: 'ai', text: 'Halo! Saya asisten AI Dukun Skripsi untuk brainstorming judul skripsi. Silakan isi form di sebelah kiri untuk mulai mendapatkan saran judul, atau tanyakan langsung di sini.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const generateTitles = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    setSuggestions([]);
    
    try {
      const response = await fetch('/api/brainstorming/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.join(', '),
          field
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          const formatted = data.suggestions.map((item: any, index: number) => ({
            id: String(index + 1),
            judul: item.judul || item.title || `Analisis ${topic} pada ${field}`,
            relevance_score: item.relevance_score ?? (item.score ? Math.min(10, item.score / 10) : 9),
            alasan: item.alasan || item.reason || 'Sangat spesifik dan layak diteliti.'
          }));
          setSuggestions(formatted);
          setIsGenerating(false);
          setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'ai',
            text: `Saya telah merumuskan 5 saran judul skripsi terbaik berdasarkan topik "${topic}". Anda bisa melihat detail skor relevansi dan alasannya di panel kiri.`
          }]);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend API request skipped, fallback to client generation:', e);
    }

    // Fallback if API fails or offline preview
    setTimeout(() => {
      setSuggestions([
        { id: '1', judul: `Pengaruh ${topic} terhadap Optimasi Kinerja pada ${field} di Indonesia`, relevance_score: 9.5, alasan: 'Spesifik, memiliki dua variabel independen & dependen yang jelas, serta relevan dengan tren industri.' },
        { id: '2', judul: `Analisis Perbandingan Implementasi ${topic} Menggunakan Pendekatan Kuantitatif`, relevance_score: 8.8, alasan: 'Fokus pada evaluasi komparatif yang terukur dengan instrumen kuesioner baku.' },
        { id: '3', judul: `Strategi Mitigasi Risiko dan Evaluasi Efektivitas ${topic} pada Sektor ${field}`, relevance_score: 8.5, alasan: 'Memiliki implikasi praktis dan kontribusi teoritis yang tajam untuk akademisi.' },
        { id: '4', judul: `Pengembangan Framework Berbasis AI untuk Meningkatkan Adopsi ${topic}`, relevance_score: 8.0, alasan: 'Menggabungkan metode R&D modern untuk menyelesaikan masalah riil mahasiswa/industri.' },
        { id: '5', judul: `Analisis Sentimen dan Persepsi Pengguna terhadap ${topic} Menggunakan Metode Machine Learning`, relevance_score: 9.0, alasan: 'Sangat diminati dosen penguji karena menggunakan data sekunder riil dari media sosial/review.' }
      ]);
      setIsGenerating(false);
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Saya telah membuat 5 rekomendasi judul skripsi berdasarkan topik "${topic}". Setiap judul dilengkapi skor relevansi (1-10) dan alasan akademis.`
      }]);
    }, 1500);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatTyping(true);
    
    setTimeout(() => {
      let aiResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('manajemen pemasaran') || lower.includes('brainstorm')) {
        aiResponse = `Tentu! Berikut beberapa ide judul skripsi yang prospektif di bidang Manajemen Pemasaran:\n\n` +
          `1. **Pengaruh Influencer Marketing dan Customer Review terhadap Decisions Purchase pada E-Commerce (Studi Generasi Z)**\n` +
          `2. **Strategi Rebranding & Brand Loyalty dalam Meningkatkan Customer Retention pada Industri F&B Lokal**\n` +
          `3. **Analisis Omnichannel Marketing dan Dampaknya terhadap High Experience Satisfaction Pelanggan Retail**\n` +
          `4. **Peran Personalization & AI Chatbot Recommendation terhadap Impulse Buying di Social Commerce (TikTok Shop)**\n\n` +
          `Manakah dari sudut pandang di atas yang paling sesuai dengan minat riset Anda?`;
      } else if (lower.includes('parafrase') || lower.includes('bebas plagiarisme')) {
        aiResponse = `Tentu, ini hasil parafrase akademik yang dipoles agar lebih mengalir, elegan, dan memenuhi kriteria bebas plagiarisme:\n\n` +
          `**Versi Parafrase Akademik:**\n` +
          `"Penerapan strategi pemasaran digital berbasis personalisasi terbukti meningkatkan keterikatan konsumen (*customer engagement*) secara signifikan. Temuan ini mengindikasikan bahwa segmentasi audiens yang tepat sasaran menjadi kunci utama dalam mendorong keputusan pembelian di era persaingan e-commerce saat ini."\n\n` +
          `*Catatan:* Struktur kalimat telah disesuaikan dengan ejaan bahasa Indonesia baku dan diksi ilmiah.`;
      } else if (lower.includes('simulasi sidang') || lower.includes('dipersiapkan')) {
        aiResponse = `Berikut poin-poin krusial yang wajib dipersiapkan sebelum menghadapi Simulasi Sidang Skripsi:\n\n` +
          `1. **Slide Presentasi (PPT) Maksimal 10-12 Slide**: Fokus pada Latar Belakang, Rumusan Masalah, Metodologi, Hasil Utama, dan Kesimpulan.\n` +
          `2. **Penguasaan Metodologi & Alasan Pemilihan Sampel/Rumus**: Pastikan Anda bisa menjelaskan mengapa memilih teknik sampling tertentu (misal: *Purposive Sampling*).\n` +
          `3. **Pemahaman Batasan Penelitian & Implikasi**: Pahami kelemahan riset Anda sebelum dosen penguji menanyakannya.\n` +
          `4. **Latihan Waktu (Pitching 10-15 Menit)**: Latih penyampaian secara lugas tanpa membacakan seluruh slide.\n\n` +
          `Anda juga bisa menggunakan fitur **Simulasi Sidang** di menu utama untuk berlatihan langsung dengan AI Penguji!`;
      } else {
        aiResponse = `Terima kasih! Mengenai pertanyaan Anda tentang "${text}", AI Dukun Skripsi siap membantu menyusun draf, memberikan referensi jurnal, atau menyempurnakan struktur argumentasi akademik Anda.`;
      }

      setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
      setIsChatTyping(false);
    }, 1200);
  };

  const selectTitleForChat = (title: string) => {
    handleSendMessage(`Saya tertarik dengan judul: "${title}". Bisa tolong breakdown rumusan masalahnya?`);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800 overflow-hidden">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-slate-900 tracking-tight hidden sm:block">Brainstorming Judul</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - History (Desktop only) */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-800">
            <History className="w-4 h-4 text-slate-400" /> Riwayat
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {PREVIOUS_SESSIONS.map(session => (
              <button 
                key={session.id}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="font-medium text-sm text-slate-700 group-hover:text-amber-600 truncate mb-1">
                  {session.title}
                </div>
                <div className="text-xs text-slate-400">{session.date}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area - Split Pane */}
        <main className="flex-1 flex flex-col lg:flex-row min-w-0">
          
          {/* Left Pane - Form & Results */}
          <div className="flex-1 flex flex-col border-r border-slate-200 bg-white overflow-hidden lg:max-w-xl">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
              
              {/* Form Input */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-500" /> Kriteria Judul
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTopic('Pengaruh media sosial terhadap perilaku konsumtif mahasiswa');
                      setKeywords(['media sosial', 'perilaku konsumtif', 'mahasiswa', 'e-commerce']);
                      setField('Manajemen Pemasaran');
                    }}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" /> Isi Contoh Pengujian
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topik Utama <span className="text-red-500">*</span></label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-amber-500 focus:border-amber-500 min-h-[80px] resize-none"
                    placeholder="Contoh: Penggunaan Artificial Intelligence untuk meningkatkan efisiensi operasional..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kata Kunci (Opsional)</label>
                  <div className="bg-white border border-slate-300 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                    {keywords.map(kw => (
                      <span key={kw} className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        {kw}
                        <button onClick={() => removeKeyword(kw)} className="hover:text-amber-900"><Plus className="w-3 h-3 rotate-45" /></button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                      className="flex-1 min-w-[100px] outline-none text-sm bg-transparent"
                      placeholder={keywords.length === 0 ? "Ketik lalu tekan Enter" : ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bidang Studi</label>
                  <select 
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <button 
                  onClick={generateTitles}
                  disabled={!topic || isGenerating}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Meracik Ide...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Ide Judul</>
                  )}
                </button>
              </div>

              {/* Results */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-500" /> Hasil Brainstorming ({suggestions.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => {
                        const displayScore = typeof suggestion.relevance_score === 'number' 
                          ? (suggestion.relevance_score <= 10 ? suggestion.relevance_score.toFixed(1) : (suggestion.relevance_score / 10).toFixed(1))
                          : '9.0';
                        const scorePct = Math.min(100, Math.max(0, Number(displayScore) * 10));

                        return (
                          <div key={suggestion.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-300 transition-colors group">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h4 className="font-bold text-slate-800 text-sm leading-snug flex-1">
                                {suggestion.judul}
                              </h4>
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 rounded-full border-[3px] border-amber-100 flex items-center justify-center relative bg-amber-50">
                                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#fef3c7" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${scorePct} 100`} />
                                  </svg>
                                  <span className="text-[11px] font-black text-amber-600 relative z-10">{displayScore}</span>
                                </div>
                                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Relevansi /10</span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-4">{suggestion.alasan}</p>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => selectTitleForChat(suggestion.judul)}
                                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Diskusikan
                              </button>
                              <button className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors">
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Right Pane - Chat */}
          <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
            <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Pembimbing</h3>
                  <p className="text-xs text-slate-500">Siap membantu membedah judul Anda</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${msg.sender === 'ai' ? 'bg-amber-100 text-amber-700' : 'bg-slate-800 text-white'}`}>
                      {msg.sender === 'ai' ? <Sparkles className="w-4 h-4" /> : <UserIcon />}
                    </div>
                    
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {isChatTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 max-w-[85%]"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm bg-amber-100 text-amber-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 flex gap-1 shadow-sm">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies & Input */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              {chatMessages.length > 1 && !isChatTyping && (
                <div className="flex overflow-x-auto gap-2 mb-3 pb-2 custom-scrollbar">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSendMessage(reply)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full whitespace-nowrap transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }} 
                className="flex gap-3"
              >
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Tanyakan sesuatu ke AI..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all outline-none"
                  disabled={isChatTyping}
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || isChatTyping}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
