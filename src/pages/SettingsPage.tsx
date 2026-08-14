import React, { useState } from 'react';
import { 
  Settings, User, ShieldCheck, Key, ArrowLeft, Save, 
  Check, Sparkles, Award, Sliders, Bell, Laptop, GraduationCap,
  ExternalLink, Cpu, Globe, Bot, Search, Database, FileText, 
  Mic, Eye, Layers, Zap, Info, CheckCircle2, Copy, Filter,
  Volume2, BookOpen, Server, Compass, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BidangIlmuSelector from '../components/BidangIlmuSelector';
import AdminPanelModal from '../components/AdminPanelModal';
import { isCampusEmail } from '../utils/accessControl';

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
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'apikeys' | 'security'>('profile');
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Category filter and search query for API Keys section
  const [apiCategory, setApiCategory] = useState<'all' | 'llm' | 'search' | 'embeddings' | 'vectordb' | 'scraping' | 'vision'>('all');
  const [apiSearchQuery, setApiSearchQuery] = useState('');

  // Comprehensive Custom API Keys & Multi-Engine Choice
  const [customApiKeys, setCustomApiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_api_keys');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        selectedEngine: parsed.selectedEngine || 'multi_synergy',
        // 1. AI Reasoning & LLM Flags & Keys
        geminiEnabled: parsed.geminiEnabled !== undefined ? parsed.geminiEnabled : true,
        geminiApiKey: parsed.geminiApiKey || '',
        nvidiaEnabled: parsed.nvidiaEnabled !== undefined ? parsed.nvidiaEnabled : Boolean(parsed.nvidiaApiKey),
        nvidiaApiKey: parsed.nvidiaApiKey || '',
        mistralEnabled: parsed.mistralEnabled !== undefined ? parsed.mistralEnabled : Boolean(parsed.mistralApiKey),
        mistralApiKey: parsed.mistralApiKey || '',
        groqEnabled: parsed.groqEnabled !== undefined ? parsed.groqEnabled : Boolean(parsed.groqApiKey),
        groqApiKey: parsed.groqApiKey || '',
        deepseekEnabled: parsed.deepseekEnabled !== undefined ? parsed.deepseekEnabled : Boolean(parsed.deepseekApiKey),
        deepseekApiKey: parsed.deepseekApiKey || '',
        openrouterEnabled: parsed.openrouterEnabled !== undefined ? parsed.openrouterEnabled : Boolean(parsed.openrouterApiKey),
        openrouterApiKey: parsed.openrouterApiKey || '',
        prismEnabled: parsed.prismEnabled !== undefined ? parsed.prismEnabled : Boolean(parsed.prismApiKey),
        prismApiKey: parsed.prismApiKey || '',
        cohereEnabled: parsed.cohereEnabled !== undefined ? parsed.cohereEnabled : Boolean(parsed.cohereApiKey),
        cohereApiKey: parsed.cohereApiKey || '',

        // 2. Web & Academic Search
        europePmcEnabled: parsed.europePmcEnabled !== undefined ? parsed.europePmcEnabled : true,
        ncbiEnabled: parsed.ncbiEnabled !== undefined ? parsed.ncbiEnabled : true,
        ncbiApiKey: parsed.ncbiApiKey || '',
        tavilyEnabled: parsed.tavilyEnabled !== undefined ? parsed.tavilyEnabled : Boolean(parsed.tavilyApiKey),
        tavilyApiKey: parsed.tavilyApiKey || '',
        openAlexEnabled: parsed.openAlexEnabled !== undefined ? parsed.openAlexEnabled : true,
        openAlexApiKey: parsed.openAlexApiKey || '',

        // 3. Vector Embeddings & Reranker
        jinaEnabled: parsed.jinaEnabled !== undefined ? parsed.jinaEnabled : Boolean(parsed.jinaApiKey),
        jinaApiKey: parsed.jinaApiKey || '',
        voyageEnabled: parsed.voyageEnabled !== undefined ? parsed.voyageEnabled : Boolean(parsed.voyageApiKey),
        voyageApiKey: parsed.voyageApiKey || '',
        cohereRerankEnabled: parsed.cohereRerankEnabled !== undefined ? parsed.cohereRerankEnabled : Boolean(parsed.cohereRerankApiKey),
        cohereRerankApiKey: parsed.cohereRerankApiKey || '',

        // 4. Vector Database & Storage
        qdrantEnabled: parsed.qdrantEnabled !== undefined ? parsed.qdrantEnabled : Boolean(parsed.qdrantUrl),
        qdrantUrl: parsed.qdrantUrl || '',
        qdrantApiKey: parsed.qdrantApiKey || '',

        // 5. Document Scraping & Parsing
        firecrawlEnabled: parsed.firecrawlEnabled !== undefined ? parsed.firecrawlEnabled : Boolean(parsed.firecrawlApiKey),
        firecrawlApiKey: parsed.firecrawlApiKey || '',
        llamaCloudEnabled: parsed.llamaCloudEnabled !== undefined ? parsed.llamaCloudEnabled : Boolean(parsed.llamaCloudApiKey),
        llamaCloudApiKey: parsed.llamaCloudApiKey || '',

        // 6. Vision, Geospatial & MCP Servers
        context7Enabled: parsed.context7Enabled !== undefined ? parsed.context7Enabled : Boolean(parsed.context7ApiKey),
        context7ApiKey: parsed.context7ApiKey || '',
        agriBrainEndpoint: parsed.agriBrainEndpoint || 'http://localhost:8000/sse',
        agriBrainEnabled: parsed.agriBrainEnabled !== undefined ? parsed.agriBrainEnabled : true,
        leafEnginesEndpoint: parsed.leafEnginesEndpoint || 'https://api.leafengines.mcp/v1/sse',
        leafEnginesApiKey: parsed.leafEnginesApiKey || '',
        leafEnginesEnabled: parsed.leafEnginesEnabled !== undefined ? parsed.leafEnginesEnabled : true,
        agricultureMcpEndpoint: parsed.agricultureMcpEndpoint || 'http://localhost:8080/mcp',
        agricultureMcpEnabled: parsed.agricultureMcpEnabled !== undefined ? parsed.agricultureMcpEnabled : true
      };
    } catch (e) {
      return { 
        selectedEngine: 'multi_synergy',
        geminiEnabled: true,
        geminiApiKey: '',
        nvidiaEnabled: false,
        nvidiaApiKey: '',
        mistralEnabled: false,
        mistralApiKey: '',
        groqEnabled: false,
        groqApiKey: '',
        deepseekEnabled: false,
        deepseekApiKey: '',
        openrouterEnabled: false,
        openrouterApiKey: '',
        prismEnabled: false,
        prismApiKey: '',
        cohereEnabled: false,
        cohereApiKey: '',
        europePmcEnabled: true,
        ncbiEnabled: true,
        ncbiApiKey: '',
        tavilyEnabled: false,
        tavilyApiKey: '',
        openAlexEnabled: true,
        openAlexApiKey: '',
        jinaEnabled: false,
        jinaApiKey: '',
        voyageEnabled: false,
        voyageApiKey: '',
        cohereRerankEnabled: false,
        cohereRerankApiKey: '',
        qdrantEnabled: false,
        qdrantUrl: '',
        qdrantApiKey: '',
        firecrawlEnabled: false,
        firecrawlApiKey: '',
        llamaCloudEnabled: false,
        llamaCloudApiKey: '',
        context7Enabled: false,
        context7ApiKey: '',
        agriBrainEndpoint: 'http://localhost:8000/sse',
        agriBrainEnabled: true,
        leafEnginesEndpoint: 'https://api.leafengines.mcp/v1/sse',
        leafEnginesApiKey: '',
        leafEnginesEnabled: true,
        agricultureMcpEndpoint: 'http://localhost:8080/mcp',
        agricultureMcpEnabled: true
      };
    }
  });

  const getActiveAiCount = () => {
    let count = 0;
    if (customApiKeys.geminiEnabled !== false) count++;
    if (customApiKeys.nvidiaEnabled) count++;
    if (customApiKeys.mistralEnabled) count++;
    if (customApiKeys.groqEnabled) count++;
    if (customApiKeys.deepseekEnabled) count++;
    if (customApiKeys.openrouterEnabled) count++;
    if (customApiKeys.prismEnabled) count++;
    if (customApiKeys.cohereEnabled) count++;
    return count;
  };

  const toggleAllAiEngines = (enable: boolean) => {
    setCustomApiKeys({
      ...customApiKeys,
      geminiEnabled: enable,
      nvidiaEnabled: enable,
      mistralEnabled: enable,
      groqEnabled: enable,
      deepseekEnabled: enable,
      openrouterEnabled: enable,
      prismEnabled: enable,
      cohereEnabled: enable,
    });
  };

  const toggleConfiguredAiOnly = () => {
    setCustomApiKeys({
      ...customApiKeys,
      geminiEnabled: true,
      nvidiaEnabled: Boolean(customApiKeys.nvidiaApiKey),
      mistralEnabled: Boolean(customApiKeys.mistralApiKey),
      groqEnabled: Boolean(customApiKeys.groqApiKey),
      deepseekEnabled: Boolean(customApiKeys.deepseekApiKey),
      openrouterEnabled: Boolean(customApiKeys.openrouterApiKey),
      prismEnabled: Boolean(customApiKeys.prismApiKey),
      cohereEnabled: Boolean(customApiKeys.cohereApiKey),
    });
  };

  // Preferences State
  const [citationFormat, setCitationFormat] = useState('APA 7th Edition');
  const [tone, setTone] = useState('Akademik Formal (Standar Dikti)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    window.dispatchEvent(new Event('storage'));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveApiKeys = () => {
    localStorage.setItem('custom_api_keys', JSON.stringify(customApiKeys));
    window.dispatchEvent(new Event('storage'));
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
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Pengaturan Akun & Integrasi Asisten</h1>
              <p className="text-xs text-slate-500">Atur profil mahasiswa, preferensi format, dan manajemen API Keys multi-engine</p>
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
            <div className="mt-3 pt-3 border-t border-emerald-800/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  ⭐ {
                    userInfo.email === 'febricase@gmail.com' || userInfo.role === 'admin'
                      ? 'Akses Admin'
                      : isCampusEmail(userInfo.email) || userInfo.accessStatus === 'unlimited'
                      ? 'Akses Mail Kampus (Gratis Selamanya)'
                      : 'Akses Fitur Penuh (Gratis 7 Hari)'
                  }
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>
              {(userInfo.email === 'febricase@gmail.com' || userInfo.role === 'admin') && (
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="w-full mt-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Buka Panel Kelola User Admin
                </button>
              )}
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
              <Key className="w-4 h-4 text-emerald-600" /> Manajemen API Keys & Integrasi
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-600" /> Pusat API Keys & Integrasi Multi-Layanan
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Kelola kunci API untuk LLM reasoning, pencarian akademik, embeddings, database vektor, parsing dokumen, dan konteks riset.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 self-start">
                    16 Layanan Terintegrasi
                  </span>
                </div>
              </div>

              {/* Status Breakdown Box */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl border border-emerald-800/40 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Ringkasan Integrasi Layanan & Status API Key</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="font-extrabold text-emerald-300 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Bawaan & Open Access
                    </span>
                    <p className="text-slate-300">
                      <strong>Europe PMC</strong> (40M+ Jurnal) & <strong>Gemini Server</strong> aktif tanpa wajib memasukkan key tambahan.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1 mb-1">
                      <Zap className="w-3.5 h-3.5" /> Deduplikasi Otomatis
                    </span>
                    <p className="text-slate-300">
                      <strong>Jina AI</strong> & <strong>Voyage AI</strong> disatukan menjadi 1 master key agar tidak terjadi duplikasi input.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <span className="font-extrabold text-sky-300 flex items-center gap-1 mb-1">
                      <Compass className="w-3.5 h-3.5" /> Integrasi Baru Tersedia
                    </span>
                    <p className="text-slate-300">
                      NCBI/PubMed, Tavily, Mistral, LlamaCloud, Qdrant, Context7, OpenAlex, AgriBrain & LeafEngines MCP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" /> Engine AI Utama (Primary Generator)
                  </label>
                  <span className="text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    {getActiveAiCount()} dari 8 AI Aktif
                  </span>
                </div>
                <select
                  value={customApiKeys.selectedEngine || 'multi_synergy'}
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextKeys = { ...customApiKeys, selectedEngine: val };
                    if (val === 'gemini') nextKeys.geminiEnabled = true;
                    if (val === 'nvidia') nextKeys.nvidiaEnabled = true;
                    if (val === 'mistral') nextKeys.mistralEnabled = true;
                    if (val === 'openrouter') nextKeys.openrouterEnabled = true;
                    if (val === 'groq') nextKeys.groqEnabled = true;
                    if (val === 'deepseek') nextKeys.deepseekEnabled = true;
                    if (val === 'prism') nextKeys.prismEnabled = true;
                    if (val === 'cohere') nextKeys.cohereEnabled = true;
                    setCustomApiKeys(nextKeys);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="multi_synergy">✨ Synergy Multi-AI (Failover Otomatis ke Semua AI yang Dicentang)</option>
                  <option value="gemini">♊ Google Gemini Flash {customApiKeys.geminiEnabled !== false ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="nvidia">🟢 NVIDIA NIM (DeepSeek-R1 / Llama-3.3) {customApiKeys.nvidiaEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="mistral">🌪️ Mistral AI (Large & Codestral) {customApiKeys.mistralEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="openrouter">🪐 OpenRouter AI (20+ Model Gratis) {customApiKeys.openrouterEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="groq">⚡ Groq Cloud (Llama-3.3 70B Ultra Fast) {customApiKeys.groqEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="deepseek">🧠 DeepSeek AI (R1 & V3) {customApiKeys.deepseekEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="prism">🔮 Prism by OpenAI (GPT-4o) {customApiKeys.prismEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                  <option value="cohere">💬 Cohere AI (Command R+) {customApiKeys.cohereEnabled ? '(✅ Aktif Dicentang)' : '(⚪ Nonaktif)'}</option>
                </select>
                <p className="text-[11px] text-slate-300 leading-tight pt-1">
                  *Dengan pilihan <strong>Synergy Multi-AI</strong>, sistem hanya menggunakan AI yang <strong>dicentang (✓)</strong> di bawah. AI yang centangnya dimatikan akan sepenuhnya dilewati (tidak dipanggil).
                </p>
              </div>

              {/* Filter Categories Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Kategori Layanan:
                  </span>
                  <input
                    type="text"
                    placeholder="Cari layanan (misal: Tavily, Mistral, Qdrant)..."
                    value={apiSearchQuery}
                    onChange={(e) => setApiSearchQuery(e.target.value)}
                    className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg w-52 outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: '🌟 Semua Layanan', icon: Layers },
                    { id: 'llm', label: '🤖 AI & LLM', icon: Cpu },
                    { id: 'search', label: '🌐 Web & Riset', icon: Search },
                    { id: 'embeddings', label: '🧬 Embeddings & Rerank', icon: Sparkles },
                    { id: 'vectordb', label: '🗄️ Vector DB', icon: Database },
                    { id: 'scraping', label: '📄 Scraping & PDF', icon: FileText },
                    { id: 'vision', label: '👁️ Konteks & MCP', icon: Eye },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setApiCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        apiCategory === cat.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields Categorized */}
              <div className="space-y-4 pt-1">

                {/* ========================================================================= */}
                {/* 1. AI ENGINES & LLM */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'llm') && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-600" />
                        <span>Kategori 1: AI Reasoning & LLM Engines</span>
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          {getActiveAiCount()} / 8 AI Aktif
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleAllAiEngines(true)}
                          className="text-[11px] font-bold bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          ✓ Centang Semua
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllAiEngines(false)}
                          className="text-[11px] font-bold bg-white text-rose-700 hover:bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          ✕ Hapus Semua
                        </button>
                        <button
                          type="button"
                          onClick={toggleConfiguredAiOnly}
                          className="text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          ⚡ Sesuai Key
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Petunjuk Pemilihan AI:</strong> Centang (✓) pada kotak di setiap AI yang ingin Anda pakai. Jika kotak centang dinonaktifkan (kosong), sistem All-in-One tidak akan memanggil AI tersebut sama sekali dan otomatis dialihkan ke AI alternatif lain yang dicentang.
                      </div>
                    </div>

                    {/* Google AI Studio / Gemini */}
                    {('gemini google ai studio'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.geminiEnabled !== false
                          ? 'bg-emerald-950/10 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={customApiKeys.geminiEnabled !== false}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, geminiEnabled: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.geminiEnabled !== false ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              ♊ Google AI Studio (Gemini API)
                            </span>
                            {customApiKeys.geminiEnabled !== false ? (
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300 hidden sm:inline-block">
                              BAWAAN SISTEM / GRATIS
                            </span>
                            <a 
                              href="https://aistudio.google.com/apikey" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                            >
                              Dapatkan Key Gemini <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={customApiKeys.geminiEnabled === false}
                          value={customApiKeys.geminiApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, geminiApiKey: e.target.value })}
                          placeholder={customApiKeys.geminiEnabled !== false ? "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx (Opsional - Server Default Aktif)" : "(Google Gemini dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.geminiEnabled !== false
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Model bawaan sistem utama (Gemini Flash). Jika centang dimatikan, sistem beralih penuh ke AI alternatif lain yang Anda aktifkan. URL: <code className="text-slate-800 font-mono">https://aistudio.google.com/apikey</code>
                        </p>
                      </div>
                    )}

                    {/* NVIDIA NIM */}
                    {('nvidia nim deepseek llama'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.nvidiaEnabled
                          ? 'bg-emerald-950/10 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.nvidiaEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, nvidiaEnabled: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.nvidiaEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              🟢 NVIDIA NIM (build.nvidia.com)
                            </span>
                            {customApiKeys.nvidiaEnabled ? (
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300 hidden sm:inline-block">
                              100% GRATIS (1,000 Credits)
                            </span>
                            <a 
                              href="https://build.nvidia.com/settings/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                            >
                              Dapatkan Key NVIDIA <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.nvidiaEnabled}
                          value={customApiKeys.nvidiaApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, nvidiaApiKey: e.target.value })}
                          placeholder={customApiKeys.nvidiaEnabled ? "nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(NVIDIA NIM dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.nvidiaEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Microservices inferensi dari NVIDIA untuk model DeepSeek-R1, Llama 3.3 70B, & Mistral. URL: <code className="text-slate-800 font-mono">https://build.nvidia.com/settings/api-keys</code>
                        </p>
                      </div>
                    )}

                    {/* Mistral AI */}
                    {('mistral codestral pixtral'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.mistralEnabled
                          ? 'bg-amber-950/10 border-amber-500/40 shadow-xs ring-1 ring-amber-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.mistralEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, mistralEnabled: e.target.checked })}
                              className="w-4 h-4 text-amber-600 rounded-md border-slate-300 focus:ring-amber-500 cursor-pointer accent-amber-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.mistralEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              🌪️ Mistral AI (console.mistral.ai)
                            </span>
                            {customApiKeys.mistralEnabled ? (
                              <span className="text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-amber-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 hidden sm:inline-block">
                              FREE TIER / EXPERIMENT
                            </span>
                            <a 
                              href="https://console.mistral.ai/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-800 hover:text-amber-900 hover:underline font-extrabold flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs"
                            >
                              Dapatkan Key Mistral <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.mistralEnabled}
                          value={customApiKeys.mistralApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, mistralApiKey: e.target.value })}
                          placeholder={customApiKeys.mistralEnabled ? "mis_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(Mistral AI dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.mistralEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-amber-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Model penalaran Eropa performa tinggi: Mistral Large, Codestral, dan Pixtral. URL: <code className="text-slate-800 font-mono">https://console.mistral.ai/</code>
                        </p>
                      </div>
                    )}

                    {/* Groq Cloud */}
                    {('groq llama mixtral ultra fast'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.groqEnabled
                          ? 'bg-orange-950/10 border-orange-500/40 shadow-xs ring-1 ring-orange-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.groqEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, groqEnabled: e.target.checked })}
                              className="w-4 h-4 text-orange-600 rounded-md border-slate-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.groqEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              ⚡ Groq Cloud (Ultra Fast LPU)
                            </span>
                            {customApiKeys.groqEnabled ? (
                              <span className="text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-orange-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300 hidden sm:inline-block">
                              100% GRATIS
                            </span>
                            <a 
                              href="https://console.groq.com/keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-orange-800 hover:text-orange-900 hover:underline font-extrabold flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-300 shadow-xs"
                            >
                              Dapatkan Key Groq <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.groqEnabled}
                          value={customApiKeys.groqApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, groqApiKey: e.target.value })}
                          placeholder={customApiKeys.groqEnabled ? "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(Groq Cloud dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.groqEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-orange-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Mesin inferensi tercepat di dunia untuk perbaikan tata bahasa dan parafrase skripsi instan. URL: <code className="text-slate-800 font-mono">https://console.groq.com/keys</code>
                        </p>
                      </div>
                    )}

                    {/* DeepSeek */}
                    {('deepseek reasoner r1 v3'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.deepseekEnabled
                          ? 'bg-blue-950/10 border-blue-500/40 shadow-xs ring-1 ring-blue-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.deepseekEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, deepseekEnabled: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.deepseekEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              🧠 DeepSeek AI (R1 & V3)
                            </span>
                            {customApiKeys.deepseekEnabled ? (
                              <span className="text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-blue-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300 hidden sm:inline-block">
                              GRATIS TRIAL
                            </span>
                            <a 
                              href="https://platform.deepseek.com/api_keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-800 hover:text-blue-900 hover:underline font-extrabold flex items-center gap-1 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 shadow-xs"
                            >
                              Dapatkan Key DeepSeek <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.deepseekEnabled}
                          value={customApiKeys.deepseekApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, deepseekApiKey: e.target.value })}
                          placeholder={customApiKeys.deepseekEnabled ? "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(DeepSeek dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.deepseekEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Spesialisasi perumusan masalah kompleks dan analisis metodologi statistik. URL: <code className="text-slate-800 font-mono">https://platform.deepseek.com/api_keys</code>
                        </p>
                      </div>
                    )}

                    {/* OpenRouter */}
                    {('openrouter claude llama qwen'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.openrouterEnabled
                          ? 'bg-indigo-950/10 border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.openrouterEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, openrouterEnabled: e.target.checked })}
                              className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.openrouterEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              🪐 OpenRouter AI
                            </span>
                            {customApiKeys.openrouterEnabled ? (
                              <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-indigo-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-300 hidden sm:inline-block">
                              100% GRATIS (20+ Free Models)
                            </span>
                            <a 
                              href="https://openrouter.ai/keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-indigo-700 hover:text-indigo-800 hover:underline font-extrabold flex items-center gap-1 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-300 shadow-xs"
                            >
                              Dapatkan Key OpenRouter <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.openrouterEnabled}
                          value={customApiKeys.openrouterApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, openrouterApiKey: e.target.value })}
                          placeholder={customApiKeys.openrouterEnabled ? "sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(OpenRouter dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.openrouterEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Gateway puluhan model open source gratis tanpa kartu kredit. URL: <code className="text-slate-800 font-mono">https://openrouter.ai/keys</code>
                        </p>
                      </div>
                    )}

                    {/* Prism / OpenAI */}
                    {('prism openai gpt-4o chatgpt'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.prismEnabled
                          ? 'bg-purple-950/10 border-purple-500/40 shadow-xs ring-1 ring-purple-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.prismEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, prismEnabled: e.target.checked })}
                              className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500 cursor-pointer accent-purple-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.prismEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              🔮 Prism by OpenAI (GPT-4o)
                            </span>
                            {customApiKeys.prismEnabled ? (
                              <span className="text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-purple-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-300 hidden sm:inline-block">
                              OPENAI COMPATIBLE
                            </span>
                            <a 
                              href="https://platform.openai.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-purple-700 hover:text-purple-800 hover:underline font-extrabold flex items-center gap-1 bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-300 shadow-xs"
                            >
                              Dapatkan Key OpenAI <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.prismEnabled}
                          value={customApiKeys.prismApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, prismApiKey: e.target.value })}
                          placeholder={customApiKeys.prismEnabled ? "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx" : "(OpenAI / Prism dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.prismEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-purple-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Sintesis draft akademik menggunakan model GPT-4o & GPT-4o-mini. URL: <code className="text-slate-800 font-mono">https://platform.openai.com/api-keys</code>
                        </p>
                      </div>
                    )}

                    {/* Cohere Command */}
                    {('cohere command r plus'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                        customApiKeys.cohereEnabled
                          ? 'bg-teal-950/10 border-teal-500/40 shadow-xs ring-1 ring-teal-500/20'
                          : 'bg-slate-100/80 border-slate-300 opacity-70'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(customApiKeys.cohereEnabled)}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, cohereEnabled: e.target.checked })}
                              className="w-4 h-4 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500 cursor-pointer accent-teal-600"
                            />
                            <span className={`text-xs font-black flex items-center gap-1.5 ${
                              customApiKeys.cohereEnabled ? 'text-slate-900' : 'text-slate-500 line-through'
                            }`}>
                              💬 Cohere AI (Command R+)
                            </span>
                            {customApiKeys.cohereEnabled ? (
                              <span className="text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-teal-600" /> AKTIF DIPAKAI
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                ✕ NONAKTIF (DILEWATI)
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-300 hidden sm:inline-block">
                              TRIAL FREE KEY
                            </span>
                            <a 
                              href="https://dashboard.cohere.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-teal-800 hover:text-teal-900 hover:underline font-extrabold flex items-center gap-1 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 shadow-xs"
                            >
                              Dapatkan Key Cohere <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="password"
                          disabled={!customApiKeys.cohereEnabled}
                          value={customApiKeys.cohereApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, cohereApiKey: e.target.value })}
                          placeholder={customApiKeys.cohereEnabled ? "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" : "(Cohere dinonaktifkan — centang untuk mengaktifkan)"}
                          className={`w-full px-3 py-2 text-xs border rounded-xl font-mono outline-none transition-all ${
                            customApiKeys.cohereEnabled
                              ? 'bg-white border-slate-300 focus:ring-2 focus:ring-teal-500 text-slate-800'
                              : 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-[10px] text-slate-600">
                          Model penalaran Retrieval-Augmented Generation (RAG) dan Command R+. URL: <code className="text-slate-800 font-mono">https://dashboard.cohere.com/api-keys</code>
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================================= */}
                {/* 2. WEB & ACADEMIC SEARCH */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'search') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Search className="w-4 h-4 text-emerald-600" /> Kategori 2: Pencarian Web & Riset Akademis
                    </div>

                    {/* Europe PMC (Keyless Open Access) */}
                    {('europe pmc pubmed central open access'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-emerald-950/10 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🏛️ Europe PMC RESTful Web Service
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300">🟢 100% BEBAS TANPA KEY (OPEN ACCESS)</span>
                          </span>
                          <a 
                            href="https://europepmc.org/RestfulWebService" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                          >
                            Buka Dokumentasi Web Service <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 leading-relaxed font-medium">
                          ✅ <strong>Sudah Terpasang Penuh di Aplikasi:</strong> Europe PMC menyediakan 40.5+ juta artikel ilmiah, preprint, dan paten secara gratis tanpa memerlukan akun atau API Key. Anda dapat langsung menggunakannya di menu <em>Pencari Jurnal</em> dan <em>Manajer Sitasi</em>.
                        </div>
                      </div>
                    )}

                    {/* NCBI / PubMed Account */}
                    {('ncbi pubmed e-utilities nih'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-blue-950/10 border border-blue-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🩺 NCBI / PubMed E-Utilities API Key
                            <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">100% GRATIS (NCBI Account)</span>
                          </span>
                          <a 
                            href="https://www.ncbi.nlm.nih.gov/account/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-800 hover:text-blue-900 hover:underline font-extrabold flex items-center gap-1 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 shadow-xs"
                          >
                            Buka Akun NCBI <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.ncbiApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, ncbiApiKey: e.target.value })}
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (NCBI API Key)"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Meningkatkan kecepatan query database PubMed/NCBI dari 3 req/detik menjadi 10 req/detik. Dapatkan di menu <em>Settings → API Key Management</em> pada akun NCBI Anda. URL: <code className="text-slate-800 font-mono">https://www.ncbi.nlm.nih.gov/account/</code>
                        </p>
                      </div>
                    )}

                    {/* Tavily AI Search */}
                    {('tavily search agent deep research'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-cyan-950/10 border border-cyan-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🔍 Tavily AI Search API
                            <span className="text-[10px] font-black bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-300">FREE TIER (1,000 Searches/bln)</span>
                          </span>
                          <a 
                            href="https://app.tavily.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-cyan-800 hover:text-cyan-900 hover:underline font-extrabold flex items-center gap-1 bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-300 shadow-xs"
                          >
                            Dapatkan Key Tavily <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.tavilyApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, tavilyApiKey: e.target.value })}
                          placeholder="tvly-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Mesin pencari khusus AI agent untuk deep research dan ekstraksi sumber akademik realtime. URL: <code className="text-slate-800 font-mono">https://app.tavily.com/</code>
                        </p>
                      </div>
                    )}

                    {/* OpenAlex */}
                    {('openalex index open science'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-teal-950/10 border border-teal-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            📚 OpenAlex Open Science Index API
                            <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-300">100% GRATIS (Open Index)</span>
                          </span>
                          <a 
                            href="https://openalex.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-teal-800 hover:text-teal-900 hover:underline font-extrabold flex items-center gap-1 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 shadow-xs"
                          >
                            Buka OpenAlex API <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="text"
                          value={customApiKeys.openAlexApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, openAlexApiKey: e.target.value })}
                          placeholder="email_anda@kampus.ac.id (Polite Pool)"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Katalog 250M+ karya ilmiah dunia. Cukup masukkan email kampus Anda untuk masuk ke "Polite Pool" cepat tanpa batas. URL: <code className="text-slate-800 font-mono">https://openalex.org/</code>
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================================= */}
                {/* 3. VECTOR EMBEDDINGS & RERANKER */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'embeddings') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Kategori 3: Vector Embeddings & Reranker
                    </div>

                    {/* Jina AI (Consolidated) */}
                    {('jina ai embeddings reader reranker'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-emerald-950/10 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🧬 Jina AI (Embeddings v3, Reader & Reranker)
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300">100% GRATIS (1 Juta Token)</span>
                          </span>
                          <a 
                            href="https://jina.ai/api-dashboard/key-manager" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                          >
                            Dapatkan Key Jina AI <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.jinaApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, jinaApiKey: e.target.value })}
                          placeholder="jina_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          <em>*Telah disatukan dari duplikasi URL.</em> Memberikan akses ke Jina Embeddings v3 (8192 context), Jina Reranker v2, dan Jina Reader (web-to-markdown). URL: <code className="text-slate-800 font-mono">https://jina.ai/api-dashboard/key-manager</code>
                        </p>
                      </div>
                    )}

                    {/* Voyage AI */}
                    {('voyage ai embeddings academic retrieval'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-blue-950/10 border border-blue-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            ⛵ Voyage AI (Academic & Code Embeddings)
                            <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-300">FREE TIER (50M Tokens)</span>
                          </span>
                          <a 
                            href="https://dash.voyageai.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-800 hover:text-blue-900 hover:underline font-extrabold flex items-center gap-1 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 shadow-xs"
                          >
                            Dapatkan Key Voyage AI <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.voyageApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, voyageApiKey: e.target.value })}
                          placeholder="pa-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          <em>*Telah disatukan dari duplikasi URL.</em> Model embedding akurasi tertinggi untuk riset ilmiah (voyage-3, voyage-code-2, voyage-law-2). URL: <code className="text-slate-800 font-mono">https://dash.voyageai.com/</code>
                        </p>
                      </div>
                    )}

                    {/* Cohere Rerank */}
                    {('cohere rerank v3 precision ranking'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-teal-950/10 border border-teal-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🎯 Cohere Rerank v3 API Key
                            <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-300">FREE TRIAL</span>
                          </span>
                          <a 
                            href="https://dashboard.cohere.com/api-keys" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-teal-800 hover:text-teal-900 hover:underline font-extrabold flex items-center gap-1 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 shadow-xs"
                          >
                            Dapatkan Key Reranker <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.cohereRerankApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, cohereRerankApiKey: e.target.value })}
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (Bisa gunakan Key Cohere yang sama)"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Mengurutkan ulang ratusan jurnal hasil pencarian agar yang paling relevan dengan bab skripsi muncul di urutan teratas. URL: <code className="text-slate-800 font-mono">https://dashboard.cohere.com/api-keys</code>
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================================= */}
                {/* 4. VECTOR DATABASE & CLOUD STORAGE */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'vectordb') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Database className="w-4 h-4 text-emerald-600" /> Kategori 4: Vector Database & Cloud Storage
                    </div>

                    {/* Qdrant Cloud */}
                    {('qdrant cloud vector database search'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-rose-950/10 border border-rose-500/30 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🎯 Qdrant Cloud Vector Database
                            <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">FREE TIER (1GB Cluster)</span>
                          </span>
                          <a 
                            href="https://cloud.qdrant.io/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-rose-800 hover:text-rose-900 hover:underline font-extrabold flex items-center gap-1 bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-300 shadow-xs"
                          >
                            Buka Qdrant Cloud <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-extrabold text-slate-700 block">Cluster Endpoint URL:</label>
                            <input
                              type="text"
                              value={customApiKeys.qdrantUrl || ''}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, qdrantUrl: e.target.value })}
                              placeholder="https://xyz-example.qdrant.tech:6333"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-rose-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-slate-700 block">Cluster API Key:</label>
                            <input
                              type="password"
                              value={customApiKeys.qdrantApiKey || ''}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, qdrantApiKey: e.target.value })}
                              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-rose-500"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-600">
                          Vector search engine berkecepatan ultra tinggi untuk indeks ribuan halaman PDF buku dan jurnal skripsi. URL: <code className="text-slate-800 font-mono">https://cloud.qdrant.io/</code>
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================================= */}
                {/* 5. DOCUMENT SCRAPING & PDF PARSING */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'scraping') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <FileText className="w-4 h-4 text-emerald-600" /> Kategori 5: Document Scraping & PDF Parsing
                    </div>

                    {/* Firecrawl */}
                    {('firecrawl scraper crawler markdown clean'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-orange-950/10 border border-orange-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🔥 Firecrawl (Web & PDF to Clean Markdown)
                            <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300">FREE (500 Credits)</span>
                          </span>
                          <a 
                            href="https://www.firecrawl.dev/app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-orange-800 hover:text-orange-900 hover:underline font-extrabold flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-300 shadow-xs"
                          >
                            Dapatkan Key Firecrawl <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.firecrawlApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, firecrawlApiKey: e.target.value })}
                          placeholder="fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Mengubah website repositori kampus, artikel berita, dan dokumen online menjadi markdown bersih siap analisis AI. URL: <code className="text-slate-800 font-mono">https://www.firecrawl.dev/app</code>
                        </p>
                      </div>
                    )}

                    {/* LlamaCloud / LlamaIndex Parsing */}
                    {('llamaindex llamacloud llamaparse pdf table'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-emerald-950/10 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🦙 LlamaCloud / LlamaParse (LlamaIndex)
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">FREE TIER (1,000 Hal/hari)</span>
                          </span>
                          <a 
                            href="https://cloud.llamaindex.ai/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-800 hover:text-emerald-900 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                          >
                            Dapatkan Key LlamaCloud <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.llamaCloudApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, llamaCloudApiKey: e.target.value })}
                          placeholder="llx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Parser dokumen tercanggih untuk membaca tabel kompleks, bagan, dan rumus matematika di PDF skripsi. URL: <code className="text-slate-800 font-mono">https://cloud.llamaindex.ai/</code>
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================================= */}
                {/* 6. CONTEXT, GEOSPATIAL & SERVER MCP */}
                {/* ========================================================================= */}
                {(apiCategory === 'all' || apiCategory === 'vision') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Eye className="w-4 h-4 text-emerald-600" /> Kategori 6: Konteks Riset, Geospatial & Server MCP
                    </div>

                    {/* Context7 */}
                    {('context7 research memory orchestration'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-teal-950/10 border border-teal-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🧠 Context7 (Context & Memory Layer)
                            <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-300">FREE TIER</span>
                          </span>
                          <a 
                            href="https://context7.com/dashboard" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-teal-800 hover:text-teal-900 hover:underline font-extrabold flex items-center gap-1 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 shadow-xs"
                          >
                            Dapatkan Key Context7 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={customApiKeys.context7ApiKey || ''}
                          onChange={(e) => setCustomApiKeys({ ...customApiKeys, context7ApiKey: e.target.value })}
                          placeholder="c7_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <p className="text-[10px] text-slate-600">
                          Lapisan memori jangka panjang dan orkestrasi konteks dokumen riset. URL: <code className="text-slate-800 font-mono">https://context7.com/dashboard</code>
                        </p>
                      </div>
                    )}

                    {/* AgriBrain Agronomic Intelligence MCP */}
                    {('agribrain mcp server agronomic'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-green-950/10 border border-green-500/30 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🌾 AgriBrain MCP Server (Agri-Intelligence)
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">🟢 TERHUBUNG (Open Data / Tanpa Key)</span>
                          </span>
                          <a 
                            href="https://github.com/VasileiosTs/agribrain" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-green-800 hover:text-green-900 hover:underline font-extrabold flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-lg border border-green-300 shadow-xs"
                          >
                            Buka Repo AgriBrain <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-700 block">URL Endpoint Server MCP (SSE / Local Host):</label>
                          <input
                            type="text"
                            value={customApiKeys.agriBrainEndpoint || 'http://localhost:8000/sse'}
                            onChange={(e) => setCustomApiKeys({ ...customApiKeys, agriBrainEndpoint: e.target.value })}
                            placeholder="http://localhost:8000/sse"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* LeafEngines MCP & QGIS */}
                    {('leafengines qgis mcp gis geospatial'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-lime-950/10 border border-lime-500/30 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🍃 LeafEngines Agricultural MCP & QGIS
                            <span className="text-[10px] font-black bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full border border-lime-300">🟢 TERHUBUNG (Free Protocol)</span>
                          </span>
                          <a 
                            href="https://github.com/QWarranto/leafengines-claude-mcp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-lime-800 hover:text-lime-900 hover:underline font-extrabold flex items-center gap-1 bg-lime-100 px-2.5 py-1 rounded-lg border border-lime-300 shadow-xs"
                          >
                            Buka LeafEngines <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-extrabold text-slate-700 block">URL Endpoint SSE Server MCP:</label>
                            <input
                              type="text"
                              value={customApiKeys.leafEnginesEndpoint || 'https://api.leafengines.mcp/v1/sse'}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, leafEnginesEndpoint: e.target.value })}
                              placeholder="https://api.leafengines.mcp/v1/sse"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-lime-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-slate-700 block">Test Key / Token (Opsional):</label>
                            <input
                              type="password"
                              value={customApiKeys.leafEnginesApiKey || ''}
                              onChange={(e) => setCustomApiKeys({ ...customApiKeys, leafEnginesApiKey: e.target.value })}
                              placeholder="Free Tier Test Key (Opsional)"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-lime-500"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-600">
                          *Catatan QGIS: Software desktop QGIS (<code>qgis.org</code>) adalah 100% Free Open Source dan tidak memerlukan API key, namun dapat terhubung dengan LeafEngines MCP melalui plugin Python.
                        </p>
                      </div>
                    )}

                    {/* Agriculture Open MCP */}
                    {('agriculture mcp protocol standard'.includes(apiSearchQuery.toLowerCase())) && (
                      <div className="p-3.5 bg-emerald-950/10 border border-emerald-500/30 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                            🚜 Agriculture Open MCP Protocol
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">🟢 TERHUBUNG (Open Standard)</span>
                          </span>
                          <a 
                            href="https://mcp.so" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-800 hover:text-emerald-900 hover:underline font-extrabold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs"
                          >
                            Buka MCP Server Hub <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-700 block">URL Protocol Endpoint / Bridge:</label>
                          <input
                            type="text"
                            value={customApiKeys.agricultureMcpEndpoint || 'http://localhost:8080/mcp'}
                            onChange={(e) => setCustomApiKeys({ ...customApiKeys, agricultureMcpEndpoint: e.target.value })}
                            placeholder="http://localhost:8080/mcp"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveApiKeys}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Semua Konfigurasi & API Keys
                </button>
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-4 h-4" /> Berhasil Tersimpan di Browser!
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
                onClick={() => {
                  setPasswordChanged(true);
                  setTimeout(() => setPasswordChanged(false), 3000);
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs"
              >
                {passwordChanged ? 'Berhasil Diubah!' : 'Ubah Password'}
              </button>
            </div>
          )}
        </div>

      </div>

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
