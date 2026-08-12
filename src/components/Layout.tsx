import { useState } from 'react';
import { Wand2, Menu, X, ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Dukun Skripsi</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <a 
              href="https://skripsi-assistant-jade.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Web Utama
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Masuk</Link>
            <Link to="/register" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-full transition-colors">Mulai Gratis</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#fitur" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md">Fitur</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md">FAQ</a>
            <a 
              href="https://skripsi-assistant-jade.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-2 text-base font-bold text-emerald-400 hover:bg-slate-800 rounded-md flex items-center gap-2"
            >
              <Globe className="w-4 h-4" /> Kembali ke Web Utama
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-800">
            <div className="flex items-center px-5 gap-4">
              <Link to="/login" className="w-full text-center text-base font-medium text-slate-300 hover:text-white transition-colors py-2 block">Masuk</Link>
              <Link to="/register" className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold rounded-full transition-colors text-center block">Mulai Gratis</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Dukun Skripsi</span>
          </div>
          <p className="text-sm">Asisten AI terbaik untuk menyelesaikan skripsi Anda dengan format yang tepat, cepat, dan bebas plagiasi.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Produk</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a></li>
            <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
            <li>
              <a 
                href="https://skripsi-assistant-jade.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-emerald-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Web Utama
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Dukungan</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Pusat Bantuan</a></li>
            <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Hubungi Kami</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Syarat Ketentuan</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-sm text-center">
        © 2024 Dukun Skripsi. All rights reserved.
      </div>
    </footer>
  );
}
