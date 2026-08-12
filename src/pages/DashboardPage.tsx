import React, { useState, useEffect } from 'react';
import { 
  Wand2, LayoutDashboard, PlusCircle, FileText, Edit3, Sparkles, 
  Layers, Presentation, MessageSquare, Database, History, ArrowRight,
  Settings, LogOut, Bell, Search, Menu, X, ChevronRight, Upload, PlayCircle, Lightbulb, BookOpen, Users, Clock, ShieldCheck, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  getCurrentUserAccess, isAccessValid, getRemainingTimeString, 
  ADMIN_EMAIL, UserAccessInfo 
} from '../utils/accessControl';
import { getUserProjects, openUserProject, deleteUserProject, UserProjectItem } from '../utils/projectStorage';
import AccessExpiredModal from '../components/AccessExpiredModal';
import AdminPanelModal from '../components/AdminPanelModal';

const SIDEBAR_MENU = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
  { name: 'Kolaborasi & Bimbingan', icon: Users, path: '/collaboration' },
  { name: 'Chat PDF (RAG)', icon: BookOpen, path: '/pdf-chat' },
  { name: 'Brainstorming', icon: Lightbulb, path: '/brainstorming' },
  { name: 'Project Baru', icon: PlusCircle, path: '/proposal/new' },
  { name: 'Proposal', icon: FileText, path: '/proposal/new' },
  { name: 'Editor', icon: Edit3, path: '/editor' },
  { name: 'Auto Format', icon: Sparkles, path: '/auto-format' },
  { name: 'Citation Manager', icon: Layers, path: '/citation-manager' },
  { name: 'Presentasi', icon: Presentation, path: '/presentation/new' },
  { name: 'Simulasi Sidang', icon: MessageSquare, path: '/simulation' },
  { name: 'Olah Data', icon: Database, path: '/olah-data' },
  { name: 'Riwayat', icon: History, path: '/riwayat' },
  { name: 'Pengaturan', icon: Settings, path: '/pengaturan' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  const [userAccess, setUserAccess] = useState<UserAccessInfo>(() => getCurrentUserAccess());
  const [remainingTime, setRemainingTime] = useState<string>(() => getRemainingTimeString(userAccess));
  const [hasValidAccess, setHasValidAccess] = useState<boolean>(() => isAccessValid(userAccess));

  const isAdmin = userAccess.role === 'admin' || userAccess.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const [projectsList, setProjectsList] = useState<UserProjectItem[]>([]);

  // Refresh user projects
  const refreshProjects = () => {
    const list = getUserProjects(userAccess.email, isAdmin);
    setProjectsList(list);
  };

  useEffect(() => {
    refreshProjects();
  }, [userAccess.email, isAdmin]);

  // Timer interval to keep remaining time countdown fresh
  useEffect(() => {
    const timer = setInterval(() => {
      const current = getCurrentUserAccess();
      setUserAccess(current);
      setRemainingTime(getRemainingTimeString(current));
      setHasValidAccess(isAccessValid(current));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 relative">
      
      {/* Access Expired Overlay for expired users */}
      {!hasValidAccess && (
        <AccessExpiredModal isOpen={!hasValidAccess} userEmail={userAccess.email} />
      )}

      {/* Admin Panel Modal */}
      {isAdmin && (
        <AdminPanelModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between lg:justify-start">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">Dukun Skripsi</span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {SIDEBAR_MENU.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {isAdmin && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Kelola Akses User (Admin)
            </button>
          )}

          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4 text-red-500" />
            Logout
          </Link>
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              {userAccess.name ? userAccess.name.substring(0, 2).toUpperCase() : 'UA'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-900 truncate">{userAccess.name}</p>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{userAccess.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-slate-200 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari dokumen, project..." className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Panel Admin
              </button>
            )}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs sm:hidden">
              {userAccess.name ? userAccess.name.substring(0, 2).toUpperCase() : 'UA'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Greeting */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {isAdmin ? 'Halo, Febri (Admin Dukun Skripsi)! 👋' : `Halo, ${userAccess.name}! 👋`}
                  </h1>
                  <p className="text-slate-500 mt-1">Siap untuk melanjutkan skripsimu hari ini?</p>
                </div>

                {/* Trial Time Remaining Badge */}
                {!isAdmin && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-xs">
                    <Clock className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-700 block uppercase font-extrabold">Masa Aktif Akses</span>
                      <span className="text-emerald-900 font-extrabold">{remainingTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => navigate('/proposal/new')} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20 group">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold">Project Baru</h3>
                  <p className="text-emerald-100 text-xs">Mulai kerangka skripsi</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/editor')}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm group text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Lanjutkan Proposal</h3>
                  <p className="text-slate-500 text-xs">Edit draft terakhir</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/proposal/new?step=2', { state: { step: 2 } })}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 transition-colors shadow-sm group cursor-pointer text-left"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Upload Panduan</h3>
                  <p className="text-slate-500 text-xs">Buku pedoman kampus</p>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Project</p>
                  <p className="text-2xl font-black text-slate-900">{projectsList.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Rata-rata Progress</p>
                  <p className="text-2xl font-black text-slate-900">
                    {projectsList.length > 0 
                      ? Math.round(projectsList.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsList.length) + '%' 
                      : '0%'}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Dokumen Tersimpan</p>
                  <p className="text-2xl font-black text-slate-900">{projectsList.length > 0 ? projectsList.length * 7 : 0}</p>
                </div>
              </div>
            </div>

            {/* 5-COLOR QUICK AI TOOLS GRID */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> Fitur Pintar AI (5-Warna) & 44 Generator
                </h2>
                <Link to="/ai-tools" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1">
                  <span>Lihat Semua 44 Tools AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Banner 44 Tools */}
              <Link 
                to="/ai-tools" 
                className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-800/60 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-emerald-500 transition-all"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    <Wand2 className="w-3 h-3" />
                    <span>Lengkap 44 AI Generators</span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    Pusat Generator AI Skripsi & Riset Akademis
                  </h3>
                  <p className="text-xs text-slate-300">
                    Diagram Kerangka Berpikir, Generator Hipotesis, Target Riset, AI to Human, Kalkulator Sampel, Pedoman Wawancara, dll.
                  </p>
                </div>

                <span className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shrink-0 flex items-center gap-2 shadow-md">
                  <span>Buka 44 Tools AI</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 🔵 Cari Jurnal SINTA / Scopus */}
                <a 
                  href="/#cari-jurnal" 
                  className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl shadow-sm transition-all space-y-3 block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">🔵</span>
                    <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase">Biru</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug group-hover:underline">Cari Jurnal Mudah</h3>
                    <p className="text-xs text-blue-100 mt-1">Rekomendasi jurnal SINTA & Scopus sesuai topik.</p>
                  </div>
                </a>

                {/* 🔵 AI Document Checker */}
                <a 
                  href="/#document-checker" 
                  className="bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-2xl border border-slate-800 shadow-sm transition-all space-y-3 block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-lg">📋</span>
                    <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase">Biru</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug text-white group-hover:underline">AI Document Checker</h3>
                    <p className="text-xs text-slate-400 mt-1">Cek PUEBI, struktur, dan estimasi Turnitin.</p>
                  </div>
                </a>

                {/* 🟠 Smart Outline Generator */}
                <a 
                  href="/#outline-generator" 
                  className="bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl shadow-sm transition-all space-y-3 block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">🟠</span>
                    <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase">Orange</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug group-hover:underline">Smart Outline Generator</h3>
                    <p className="text-xs text-orange-100 mt-1">Susun kerangka Bab I-V otomatis.</p>
                  </div>
                </a>

                {/* 🟡 Citation Helper */}
                <Link 
                  to="/citation-manager" 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-5 rounded-2xl shadow-sm transition-all space-y-3 block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 bg-slate-950/20 rounded-xl flex items-center justify-center font-bold text-lg">🟡</span>
                    <span className="text-[10px] font-extrabold bg-slate-950/20 px-2 py-0.5 rounded-full uppercase">Kuning</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base leading-snug group-hover:underline">Citation Helper</h3>
                    <p className="text-xs text-amber-950 font-medium mt-1">Format APA 7th & IEEE instan.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Proyek Terakhir</h2>
                  {isAdmin && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                      Mode Admin (Semua User)
                    </span>
                  )}
                </div>
                <button onClick={() => navigate('/editor')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat di Editor</button>
              </div>

              {projectsList.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Proyek Disimpan</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                    Anda belum memiliki draf proposal atau karya ilmiah. Klik tombol di bawah untuk membuat proposal baru secara otomatis.
                  </p>
                  <button 
                    onClick={() => navigate('/proposal/new')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Buat Proposal Baru
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                  {projectsList.map((project) => (
                    <div 
                      key={project.id} 
                      onClick={() => {
                        openUserProject(project.id);
                        navigate('/editor');
                      }}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            {project.documentType || 'Skripsi'}
                          </span>
                          <span className="text-xs text-slate-400">• {project.universityName}</span>
                          {isAdmin && project.userEmail && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                              User: {project.userEmail}
                            </span>
                          )}
                        </div>
                        <span className="text-base font-bold text-slate-900 truncate block group-hover:text-emerald-600 transition-colors">
                          {project.title}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                            {project.status || 'Draf Proposal'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Diubah: {new Date(project.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-56 flex items-center gap-3 shrink-0">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${project.progress || 35}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-9 text-right">{project.progress || 35}%</span>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
                              deleteUserProject(project.id);
                              refreshProjects();
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            openUserProject(project.id);
                            navigate('/editor'); 
                          }} 
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
