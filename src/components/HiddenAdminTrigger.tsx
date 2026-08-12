import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, X, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_NAME, registerOrUpdateUserAccess } from '../utils/accessControl';
import AdminPanelModal from './AdminPanelModal';

export default function HiddenAdminTrigger() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleOpenAuthModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAuthModalOpen(true);
    setErrorMsg('');
  };

  const handleAdminLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Authenticate as Admin
    const targetEmail = (emailInput || ADMIN_EMAIL).trim().toLowerCase();
    if (targetEmail !== ADMIN_EMAIL.toLowerCase() && !targetEmail.includes('admin')) {
      setErrorMsg('Email yang dimasukkan bukan email resmi Admin.');
      return;
    }

    const now = Date.now();
    const adminUser = {
      id: 'admin-01',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin' as const,
      trialStartedAt: now,
      trialDurationHours: 999999,
      accessGrantedUntil: now + 999999 * 3600 * 1000,
      accessStatus: 'unlimited' as const
    };

    localStorage.setItem('user_info', JSON.stringify(adminUser));
    localStorage.setItem('auth_token', 'admin_secret_token_123');
    registerOrUpdateUserAccess(adminUser);

    setIsAuthModalOpen(false);
    setIsAdminPanelOpen(true);
    setSuccessToast('Berhasil masuk sebagai Admin (Febri - Dukun Skripsi)');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  return (
    <>
      {/* Titik Tersembunyi Sebelah Kanan Atas (Hidden Dot Trigger) */}
      <div 
        onClick={handleOpenAuthModal}
        className="fixed top-2 right-2 z-[9999] w-3 h-3 flex items-center justify-center cursor-pointer group"
        title="Titik Akses Admin"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300/40 group-hover:bg-emerald-500 group-hover:scale-150 group-hover:opacity-100 transition-all opacity-20" />
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Admin Secret Login Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[10000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Pintu Masuk Rahasia Admin</h3>
                    <p className="text-[10px] text-slate-500">Akses khusus Febri (Admin Dukun Skripsi)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="py-4 space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <span className="font-extrabold flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Akun Admin Terverifikasi
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Email Admin: <strong className="font-mono">{ADMIN_EMAIL}</strong>
                  </p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Admin
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kata Sandi Admin
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Masuk & Buka Panel Admin <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                    <span className="px-2 bg-white text-slate-400">Atau Akses Cepat</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdminLoginSubmit()}
                  className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" /> Masuk 1-Klik Sebagai Admin
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Fitur Rahasia Kelola & Perpanjang Akses Mahasiswa
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </>
  );
}
