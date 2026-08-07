import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, User, Clock, Award, ChevronLeft, 
  Send, AlertCircle, CheckCircle2, Play, RefreshCcw, BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const CHARACTERS = [
  { id: 'galak', name: 'Prof. Galak', role: 'Penguji Utama', desc: 'Pertanyaan sulit, tekanan tinggi, fokus pada kelemahan.', color: 'bg-rose-100 text-rose-700 border-rose-200', avatar: '😠' },
  { id: 'santai', name: 'Dr. Santai', role: 'Penguji Pendukung', desc: 'Supportive, pertanyaan mendasar, memberi arahan.', color: 'bg-sky-100 text-sky-700 border-sky-200', avatar: '😎' },
  { id: 'detail', name: 'Prof. Detail', role: 'Pakar Metodologi', desc: 'Sangat teliti pada metode penelitian dan validitas data.', color: 'bg-amber-100 text-amber-700 border-amber-200', avatar: '🧐' },
  { id: 'kritis', name: 'Dr. Kritis', role: 'Penguji Hasil', desc: 'Fokus pada temuan, kontribusi, dan signifikansi hasil.', color: 'bg-purple-100 text-purple-700 border-purple-200', avatar: '🤔' },
  { id: 'pakar', name: 'Dr. Pakar', role: 'Penguji Implikasi', desc: 'Fokus pada implikasi praktis dan penerapan di industri.', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', avatar: '🤓' },
];

const TOPICS = [
  'Latar Belakang & Rumusan Masalah',
  'Tinjauan Pustaka & Landasan Teori',
  'Metodologi Penelitian',
  'Hasil & Pembahasan',
  'Kesimpulan & Saran',
  'Full Simulasi (Semua Bab)'
];

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  feedback?: { score: number; comment: string };
};

export default function DefenseSimulationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'simulation' | 'report'>('setup');
  
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0].id);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [currentScore, setCurrentScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChar = CHARACTERS.find(c => c.id === selectedChar)!;

  useEffect(() => {
    if (step === 'simulation' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === 'simulation') {
      endSimulation();
    }
  }, [step, timeLeft]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startSimulation = () => {
    setStep('simulation');
    setTimeLeft(900);
    setCurrentScore(0);
    setQuestionCount(0);
    setMessages([]);
    
    // Initial AI Question
    setIsTyping(true);
    setTimeout(() => {
      let initMsg = '';
      if (activeChar.id === 'galak') initMsg = `Saya sudah baca draf Anda. Topik '${selectedTopic}' ini sangat lemah dasar argumennya. Bisa Anda jelaskan secara singkat dan logis apa urgensi dari penelitian ini? Jangan bertele-tele.`;
      else if (activeChar.id === 'santai') initMsg = `Halo, selamat ya sudah sampai tahap ini. Mari kita santai saja. Untuk bagian '${selectedTopic}', ceritakan sedikit pengalaman Anda selama menyusunnya. Apa tantangan terbesarnya?`;
      else initMsg = `Mari kita bahas tentang '${selectedTopic}'. Jelaskan poin utama yang ingin Anda sampaikan di bagian ini.`;
      
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: initMsg }]);
      setIsTyping(false);
    }, 1500);
  };

  const endSimulation = () => {
    setStep('report');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI evaluation and next question
    setTimeout(() => {
      // Evaluate previous answer
      const scoreGain = Math.floor(Math.random() * 15) + 70; // 70-85 score
      const totalQuestions = questionCount + 1;
      const newAvgScore = Math.round(((currentScore * questionCount) + scoreGain) / totalQuestions);
      
      setCurrentScore(newAvgScore);
      setQuestionCount(totalQuestions);

      // Update user message with feedback
      setMessages(prev => prev.map(msg => 
        msg.id === newUserMsg.id 
          ? { ...msg, feedback: { score: scoreGain, comment: getFeedback(scoreGain, activeChar.id) } } 
          : msg
      ));

      if (totalQuestions >= 3) {
        // End simulation after 3 questions for demo
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: `Waktu dan sesi tanya jawab sudah cukup. Mari kita lihat hasil evaluasinya.` 
        }]);
        setIsTyping(false);
        setTimeout(endSimulation, 2000);
      } else {
        // Next question
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: getNextQuestion(activeChar.id, selectedTopic) 
        }]);
        setIsTyping(false);
      }
    }, 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-slate-900 tracking-tight hidden sm:block">Simulasi Sidang Skripsi</h1>
          </div>
        </div>
        
        {step === 'simulation' && (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm ${timeLeft < 180 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
            <button onClick={endSimulation} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm rounded-lg transition-colors border border-rose-200">
              Akhiri Simulasi
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {step === 'setup' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="text-center space-y-2 mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900">Siap Hadapi Sidang?</h2>
                <p className="text-slate-500 max-w-lg mx-auto">Pilih karakter dosen penguji dan topik untuk melatih mental dan argumentasi Anda dalam simulasi interaktif.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Character Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Pilih Karakter Penguji
                  </h3>
                  <div className="space-y-3">
                    {CHARACTERS.map(char => (
                      <div 
                        key={char.id}
                        onClick={() => setSelectedChar(char.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-4 ${selectedChar === char.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${char.color}`}>
                          {char.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{char.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase tracking-wider">{char.role}</span>
                          </div>
                          <p className="text-xs text-slate-500">{char.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" /> Fokus Evaluasi
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TOPICS.map(topic => (
                        <div 
                          key={topic}
                          onClick={() => setSelectedTopic(topic)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors text-sm font-medium ${selectedTopic === topic ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-900 rounded-2xl p-6 text-white text-center shadow-lg">
                    <h3 className="font-bold text-xl mb-2">Mulai Simulasi</h3>
                    <p className="text-blue-200 text-sm mb-6">Waktu simulasi: 15 Menit. Bersiaplah untuk menjawab pertanyaan dengan jelas dan lugas.</p>
                    <button 
                      onClick={startSimulation}
                      className="w-full py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play className="w-5 h-5" /> Mulai Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'simulation' && (
          <div className="flex-1 flex flex-col sm:flex-row bg-slate-100/50">
            {/* Sidebar Stats */}
            <aside className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-200 bg-white p-4 shrink-0 flex flex-row sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto">
              <div className="flex sm:flex-col items-center sm:items-start gap-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0 ${activeChar.color}`}>
                  {activeChar.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{activeChar.name}</h3>
                  <p className="text-xs text-slate-500">{activeChar.role}</p>
                </div>
              </div>
              
              <div className="w-px h-10 sm:w-full sm:h-px bg-slate-200 my-auto sm:my-2 hidden sm:block"></div>
              
              <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-4 sm:mt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-[120px] sm:w-full">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Topik</p>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-2">{selectedTopic}</p>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 min-w-[120px] sm:w-full flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Skor Rata-rata</p>
                    <p className="text-2xl font-extrabold text-emerald-700">{currentScore}</p>
                  </div>
                  <Award className="w-8 h-8 text-emerald-200" />
                </div>
              </div>
            </aside>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative h-full">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                
                <div className="text-center text-xs text-slate-400 font-medium mb-6">
                  Simulasi Dimulai • {formatTime(900)}
                </div>

                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${msg.sender === 'ai' ? activeChar.color : 'bg-slate-800 text-white'}`}>
                        {msg.sender === 'ai' ? activeChar.avatar : <User className="w-4 h-4" />}
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                          {msg.text}
                        </div>
                        
                        {/* Real-time Feedback on User Answer */}
                        {msg.feedback && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-start gap-2 mt-2"
                          >
                            <div className={`font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${msg.feedback.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {msg.feedback.score >= 80 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              Skor: {msg.feedback.score}
                            </div>
                            <p className="text-xs text-slate-600 italic">"{msg.feedback.comment}"</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 max-w-[85%]"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${activeChar.color}`}>
                        {activeChar.avatar}
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

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ketik jawaban argumen Anda di sini..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 'report' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/50">
            <div className="max-w-3xl mx-auto">
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Evaluasi Simulasi Sidang</h2>
                <p className="text-slate-500">Anda telah menyelesaikan sesi dengan {activeChar.name}</p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100">
                  <div className="text-center sm:text-left sm:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nilai Akhir</p>
                    <div className="flex items-end justify-center sm:justify-start gap-2">
                      <span className="text-6xl font-black text-emerald-600 leading-none">{currentScore}</span>
                      <span className="text-xl text-slate-400 font-bold mb-1">/ 100</span>
                    </div>
                    <p className="text-sm font-medium text-emerald-700 mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                      {currentScore >= 80 ? 'Sangat Baik' : currentScore >= 70 ? 'Cukup Baik' : 'Perlu Peningkatan'}
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-4 sm:pt-0 sm:border-l border-slate-100 sm:pl-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Topik Evaluasi</p>
                      <p className="text-sm font-bold text-slate-800 line-clamp-2">{selectedTopic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Total Pertanyaan</p>
                      <p className="text-sm font-bold text-slate-800">{questionCount} Pertanyaan</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Catatan dari Penguji</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                    <div className="text-3xl shrink-0">{activeChar.avatar}</div>
                    <div>
                      <p className="text-slate-700 text-sm leading-relaxed mb-3">
                        "Secara umum kamu menguasai materi, namun perlu lebih tenang saat menjawab. Argumenmu di bagian akhir kurang ditopang oleh data yang kuat. Perbaiki cara menyampaikan poin penting agar lebih lugas dan tidak berputar-putar."
                      </p>
                      <p className="text-xs font-bold text-blue-800">- {activeChar.name} ({activeChar.role})</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setStep('setup')}
                  className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" /> Ulangi Simulasi
                </button>
                <Link 
                  to="/dashboard"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  Kembali ke Dashboard
                </Link>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Dummy responses
function getNextQuestion(charId: string, topic: string) {
  const qs = [
    "Lalu apa kontribusi kebaruan (novelty) dari pendekatan ini dibandingkan penelitian sebelumnya?",
    "Bagaimana Anda yakin bahwa instrumen yang digunakan sudah cukup valid?",
    "Coba jelaskan lebih detail mengenai batasan penelitian Anda. Kenapa memilih populasi tersebut?",
    "Apakah Anda sudah memikirkan kelemahan utama dari metode yang Anda gunakan ini?",
    "Jika data yang dihasilkan tidak sesuai dengan hipotesis, apa yang akan Anda simpulkan?"
  ];
  return qs[Math.floor(Math.random() * qs.length)];
}

function getFeedback(score: number, charId: string) {
  if (score >= 85) return "Jawaban yang sangat baik dan didukung argumen logis.";
  if (score >= 75) return "Cukup bagus, namun masih ada beberapa poin yang kurang spesifik.";
  return "Argumen Anda kurang kuat dan terkesan menghindari inti pertanyaan.";
}
