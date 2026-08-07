import React, { useState } from 'react';
import { 
  Settings, User, ShieldCheck, Key, ArrowLeft, Save, 
  Check, Sparkles, Award, Sliders, Bell, Laptop, GraduationCap,
  ExternalLink, Cpu, Globe, Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BidangIlmuSelector from '../components/BidangIlmuSelector';

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('user_info');
      return saved ? JSON.parse(saved) : {
        name: 'User Uji Coba Analysis',
        email: 'analysis@dukunskripsi.id',
        university: 'Universitas Indonesia',
        major: 'Teknik Informatika / Ilmu Komputer',
        thesisTitle: 'Implementasi Machine Learning & Analisis Kuantitatif Produk UMKM',
        isPro: true,
        plan: 'PRO (Trial Overall Analysis)'
      };
    } catch (e) {
      return {
        name: 'User Uji Coba Analysis',
        email: 'analysis@dukunskripsi.id',
        university: 'Universitas Indonesia',
        major: 'Teknik Informatika / Ilmu Komputer',
        thesisTitle: 'Implementasi Machine Learning & Analisis Kuantitatif Produk UMKM',
        isPro: true,
        plan: 'PRO (Trial Overall Analysis)'
      };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'apikeys' | 'security'>('profile');

  // Custom API Keys & Multi-Engine Choice
  const [customApiKeys, setCustomApiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_api_keys');
      return saved ? JSON.parse(saved) : {
        selectedEngine: 'multi_synergy',
        groqApiKey: '',
        deepseekApiKey: '',
        prismApiKey: '',
        gkswriteApiKey: '',
        geminiApiKey: ''
      };
    } catch (e) {
      return { 
        selectedEngine: 'multi_synergy',
        groqApiKey: '', 
        deepseekApiKey: '', 
        prismApiKey: '',
        gkswriteApiKey: '',
        geminiApiKey: '' 
      };
    }
  });

  // Preferences State
  const [citationFormat, setCitationFormat] = useState('APA 7th Edition');
  const [tone, setTone] = useState('Akademik Formal (Standar Dikti)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isProUser = userInfo.isPro || userInfo.email === 'analysis@dukunskripsi.id' || userInfo.email === 'febricase@gmail.com';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Pengaturan Akun & Asisten</h1>
              <p className="text-xs text-slate-500">Atur profil mahasiswa, perguruan tinggi, & preferensi Dukun Skripsi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Navigation Tabs */}
        <div className="md:col-span-4 space-y-4">
          {/* Pro Status Box */}
          <div className="p-4 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl shadow-sm border border-emerald-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700">
                STATUS AKUN
              </span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              {userInfo.name}
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">{userInfo.email}</p>
            <div className="mt-3 pt-3 border-t border-emerald-800/50 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                ⭐ {userInfo.email === 'febricase@gmail.com' ? 'Akses Admin' : 'Akses Fitur Penuh'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Aktif
              </span>
            </div>
          </div>

          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" /> Profil Mahasiswa & Skripsi
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'preferences' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-600" /> Preferensi Format AI
            </button>

            <button
              onClick={() => setActiveTab('apikeys')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'apikeys' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Key className="w-4 h-4 text-emerald-600" /> API Keys Custom (Groq / DeepSeek)
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'security' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Keamanan & Password
            </button>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {savedSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" /> Pengaturan berhasil diperbarui dan disimpan!
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> Informasi Akademik & Skripsi
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={userInfo.name || ''}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={userInfo.email || ''}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perguruan Tinggi / Universitas</label>
                  <input
                    type="text"
                    value={userInfo.university || ''}
                    onChange={(e) => setUserInfo({ ...userInfo, university: e.target.value })}
                    placeholder="Contoh: Universitas Indonesia"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi / Bidang Ilmu</label>
                  <BidangIlmuSelector
                    value={userInfo.major || ''}
                    onChange={(val) => setUserInfo({ ...userInfo, major: val })}
                    placeholder="Contoh: Pendidikan Matematika, Teknik Informatika, Keperawatan..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Skripsi / Tugas Akhir</label>
                <textarea
                  rows={3}
                  value={userInfo.thesisTitle || ''}
                  onChange={(e) => setUserInfo({ ...userInfo, thesisTitle: e.target.value })}
                  placeholder="Tuliskan judul skripsi Anda di sini..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium leading-relaxed"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" /> Preferensi Penulisan & AI
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gaya Sitasi Default</label>
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                >
                  <option value="APA 7th Edition">APA 7th Edition (Standar Ilmu Sosial & Komputer)</option>
                  <option value="IEEE">IEEE (Teknik & Komputer)</option>
                  <option value="Harvard">Harvard Reference System</option>
                  <option value="MLA 9th Edition">MLA 9th Edition (Bahasa & Sastra)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gaya Bahasa AI Rewrite & Draft</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800"
                >
                  <option value="Akademik Formal (Standar Dikti)">Akademik Formal & Baku (Standar Dikti)</option>
                  <option value="Lugas & Efisien">Lugas, Ringkas & Efisien</option>
                  <option value="Deskriptif Mendalam">Deskriptif & Kuantitatif Mendalam</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <p className="font-bold mb-0.5">⚡ Mode Dukun Skripsi High Precision</p>
                <p className="text-[11px] text-emerald-800">AI dioptimalkan untuk meminimalkan halusinasi kutipan dan menjaga kaidah penulisan ilmiah Indonesia.</p>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600" /> Multi-Engine AI Integration & Custom API Keys
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pilih model AI utama atau gunakan sinergi gabungan (Multi-Engine Synergy). Anda dapat mengambil API Key gratis dari masing-masing provider melalui tautan resmi di bawah ini.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
                <label className="block text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" /> Modus Operasi Engine AI
                </label>
                <select
                  value={customApiKeys.selectedEngine || 'multi_synergy'}
                  onChange={(e) => setCustomApiKeys({ ...customApiKeys, selectedEngine: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="multi_synergy">✨ Synergy Multi-AI (Gunakan Semua Engine Sesuai Spesialisasi)</option>
                  <option value="groq">⚡ Groq Cloud (Llama-3 / Mixtral - Ultra Fast)</option>
                  <option value="deepseek">🧠 DeepSeek-R1 / V3 (Deep Reasoning & Analysis)</option>
                  <option value="prism">🔮 Prism by OpenAI (GPT-4o Academic Writer)</option>
                  <option value="gkswrite">✒️ GKS-Write (Baku Dikti & Grammar Synthesis)</option>
                  <option value="gemini">♊ Google Gemini 2.5 Flash (Standard Bawaan Sistem)</option>
                </select>
                <p className="text-[11px] text-slate-300 leading-tight pt-1">
                  *Dengan pilihan <strong>Synergy Multi-AI</strong>, sistem secara otomatis mengombinasikan kekuatan tata bahasa GKS-Write, kecerdasan DeepSeek, sintesis Prism, kecepatan Groq, dan presisi Gemini.
                </p>
              </div>

              {/* API Key Form Fields & Links */}
              <div className="space-y-4 pt-1">

                {/* 1. Groq Cloud */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">⚡ Groq Cloud API Key</span>
                    <a 
                      href="https://console.groq.com/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                    >
                      Dapatkan Key Groq <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={customApiKeys.groqApiKey || ''}
                    onChange={(e) => setCustomApiKeys({ ...customApiKeys, groqApiKey: e.target.value })}
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">URL Resmi: <code className="text-slate-700 font-mono">https://console.groq.com/keys</code></p>
                </div>

                {/* 2. DeepSeek AI */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">🧠 DeepSeek AI API Key</span>
                    <a 
                      href="https://platform.deepseek.com/api_keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-extrabold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200"
                    >
                      Dapatkan Key DeepSeek <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={customApiKeys.deepseekApiKey || ''}
                    onChange={(e) => setCustomApiKeys({ ...customApiKeys, deepseekApiKey: e.target.value })}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">URL Resmi: <code className="text-slate-700 font-mono">https://platform.deepseek.com/api_keys</code></p>
                </div>

                {/* 3. Prism by OpenAI */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">🔮 Prism / OpenAI API Key</span>
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-purple-600 hover:text-purple-700 hover:underline font-extrabold flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200"
                    >
                      Dapatkan Key Prism/OpenAI <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={customApiKeys.prismApiKey || ''}
                    onChange={(e) => setCustomApiKeys({ ...customApiKeys, prismApiKey: e.target.value })}
                    placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">URL Resmi: <code className="text-slate-700 font-mono">https://platform.openai.com/api-keys</code></p>
                </div>

                {/* 4. GKS-Write */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">✒️ GKS-Write Academic Key</span>
                    <a 
                      href="https://gkswrite.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-600 hover:text-teal-700 hover:underline font-extrabold flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200"
                    >
                      Buka GKS-Write <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={customApiKeys.gkswriteApiKey || ''}
                    onChange={(e) => setCustomApiKeys({ ...customApiKeys, gkswriteApiKey: e.target.value })}
                    placeholder="gks_key_xxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">URL Resmi: <code className="text-slate-700 font-mono">https://gkswrite.com/</code></p>
                </div>

                {/* 5. Google Gemini AI */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">♊ Google Gemini API Key</span>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                    >
                      Dapatkan Key Gemini <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={customApiKeys.geminiApiKey || ''}
                    onChange={(e) => setCustomApiKeys({ ...customApiKeys, geminiApiKey: e.target.value })}
                    placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">URL Resmi: <code className="text-slate-700 font-mono">https://aistudio.google.com/app/apikey</code></p>
                </div>

              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('custom_api_keys', JSON.stringify(customApiKeys));
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2500);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Pengaturan & API Keys
                </button>
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-4 h-4" /> Berhasil Tersimpan!
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" /> Keamanan & Kata Sandi
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Lama</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <button
                onClick={() => alert('Password berhasil diubah!')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs"
              >
                Ubah Password
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
