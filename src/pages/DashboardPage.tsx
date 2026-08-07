import React, { useState } from 'react';
import { 
  Wand2, LayoutDashboard, PlusCircle, FileText, Edit3, Sparkles, 
  Layers, Presentation, MessageSquare, Database, History, 
  Settings, LogOut, Bell, Search, Menu, X, ChevronRight, Upload, PlayCircle, Lightbulb, BookOpen, Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

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
  { name: 'Olah Data', icon: Database, path: '/dashboard' },
  { name: 'Riwayat', icon: History, path: '/dashboard' },
  { name: 'Pengaturan', icon: Settings, path: '/dashboard' },
];

const RECENT_PROJECTS = [
  { id: 1, title: 'Analisis Sentimen Pengguna Twitter terhadap UI/UX Aplikasi KAI Access', status: 'Revisi Bab 3', progress: 65, date: '2 hari yang lalu' },
  { id: 2, title: 'Implementasi Machine Learning untuk Prediksi Harga Saham', status: 'Draft Proposal', progress: 20, date: '1 minggu yang lalu' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
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

        <div className="p-4 border-t border-slate-100">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mb-4">
            <LogOut className="w-5 h-5 text-red-500" />
            Logout
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              BS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Budi Santoso</p>
              <p className="text-xs text-slate-500 truncate">Universitas Indonesia</p>
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
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm sm:hidden">
              BS
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Greeting */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Halo, Budi! 👋</h1>
              <p className="text-slate-500 mt-1">Siap untuk melanjutkan skripsimu hari ini?</p>
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
              <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Lanjutkan Proposal</h3>
                  <p className="text-slate-500 text-xs">Edit draft terakhir</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50 transition-colors shadow-sm group">
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
                  <p className="text-2xl font-black text-slate-900">2</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Rata-rata Progress</p>
                  <p className="text-2xl font-black text-slate-900">42%</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Dokumen Tersimpan</p>
                  <p className="text-2xl font-black text-slate-900">14</p>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Proyek Terakhir</h2>
                <Link to="/dashboard" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Semua</Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {RECENT_PROJECTS.map((project, i) => (
                  <div key={project.id} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <Link to="/dashboard" className="text-base font-bold text-slate-900 truncate block hover:text-emerald-600 transition-colors">
                        {project.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          {project.status}
                        </span>
                        <span className="text-xs text-slate-400">{project.date}</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-48 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-9 text-right">{project.progress}%</span>
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-2">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
