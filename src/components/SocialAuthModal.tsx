import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Mail, Building, User, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerOrUpdateUserAccess, FREE_TRIAL_HOURS, FREE_TRIAL_MS, isCampusEmail } from '../utils/accessControl';

export type SocialProvider = 'google' | 'microsoft' | 'yahoo' | 'proton';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: SocialProvider | null;
}

const PROVIDER_CONFIG: Record<SocialProvider, {
  name: string;
  badge: string;
  defaultEmail: string;
  defaultDomain: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  buttonBg: string;
  iconBg: string;
  description: string;
}> = {
  google: {
    name: 'Google Mail',
    badge: 'Google Workspace / Gmail',
    defaultEmail: 'mahasiswa.google@gmail.com',
    defaultDomain: '@gmail.com',
    colorBg: 'bg-blue-50/70',
    colorBorder: 'border-blue-200',
    colorText: 'text-blue-900',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    iconBg: 'bg-white',
    description: 'Masuk instan menggunakan akun Google Mail (@gmail.com) atau email kampus Google Workspace.'
  },
  microsoft: {
    name: 'Microsoft Mail',
    badge: 'Outlook / Hotmail / Live',
    defaultEmail: 'mahasiswa.ms@outlook.com',
    defaultDomain: '@outlook.com',
    colorBg: 'bg-sky-50/70',
    colorBorder: 'border-sky-200',
    colorText: 'text-sky-900',
    buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    iconBg: 'bg-sky-100',
    description: 'Masuk instan menggunakan akun Microsoft Outlook (@outlook.com, @hotmail.com, @live.com) atau Office 365 kampus.'
  },
  yahoo: {
    name: 'Yahoo Mail',
    badge: 'Yahoo! Indonesia / Yahoo.com',
    defaultEmail: 'mahasiswa.yahoo@yahoo.com',
    defaultDomain: '@yahoo.com',
    colorBg: 'bg-purple-50/70',
    colorBorder: 'border-purple-200',
    colorText: 'text-purple-900',
    buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    iconBg: 'bg-purple-100',
    description: 'Masuk instan menggunakan akun Yahoo Mail (@yahoo.com, @yahoo.co.id).'
  },
  proton: {
    name: 'Proton Mail',
    badge: 'Proton Encrypted Mail',
    defaultEmail: 'mahasiswa.proton@proton.me',
    defaultDomain: '@proton.me',
    colorBg: 'bg-emerald-50/70',
    colorBorder: 'border-emerald-200',
    colorText: 'text-emerald-900',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    iconBg: 'bg-emerald-100',
    description: 'Masuk instan menggunakan akun Proton Mail (@proton.me, @protonmail.com).'
  }
};

export default function SocialAuthModal({ isOpen, onClose, selectedProvider }: SocialAuthModalProps) {
  const navigate = useNavigate();
  const providerKey = selectedProvider || 'google';
  const config = PROVIDER_CONFIG[providerKey];

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [universityInput, setUniversityInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInstantQuickLogin = async (customEmail?: string) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const targetEmail = (customEmail || emailInput || config.defaultEmail).trim().toLowerCase();
    const targetName = nameInput.trim() || targetEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const targetUniv = universityInput.trim() || 'Universitas Indonesia';

    try {
      const res = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          provider: providerKey,
          university: targetUniv
        })
      });

      const data = await res.json();
      const now = Date.now();
      const isCampus = isCampusEmail(targetEmail);
      const userPayload = {
        id: data.user?.id || `user-${now}`,
        name: data.user?.name || targetName,
        email: targetEmail,
        role: 'user' as const,
        trialStartedAt: now,
        trialDurationHours: isCampus ? 999999 : FREE_TRIAL_HOURS,
        accessGrantedUntil: isCampus ? (now + 999999 * 3600 * 1000) : (now + FREE_TRIAL_MS),
        accessStatus: isCampus ? ('unlimited' as const) : ('active' as const),
        provider: providerKey,
        university: targetUniv
      };

      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      localStorage.setItem('user_info', JSON.stringify(userPayload));
      registerOrUpdateUserAccess(userPayload);

      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.warn('Social login fallback to local session:', err);
      const now = Date.now();
      const isCampus = isCampusEmail(targetEmail);
      const userPayload = {
        id: `user-${now}`,
        name: targetName,
        email: targetEmail,
        role: 'user' as const,
        trialStartedAt: now,
        trialDurationHours: isCampus ? 999999 : FREE_TRIAL_HOURS,
        accessGrantedUntil: isCampus ? (now + 999999 * 3600 * 1000) : (now + FREE_TRIAL_MS),
        accessStatus: isCampus ? ('unlimited' as const) : ('active' as const),
        provider: providerKey,
        university: targetUniv
      };
      localStorage.setItem('user_info', JSON.stringify(userPayload));
      registerOrUpdateUserAccess(userPayload);
      onClose();
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
        >
          {/* Header */}
          <div className={`p-6 ${config.colorBg} border-b ${config.colorBorder} relative flex items-start justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2.5 shrink-0 border border-slate-200">
                {providerKey === 'google' && (
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                {providerKey === 'microsoft' && (
                  <svg className="w-full h-full" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                )}
                {providerKey === 'yahoo' && (
                  <span className="font-black text-xl text-purple-600 tracking-tighter">Y!</span>
                )}
                {providerKey === 'proton' && (
                  <ShieldCheck className="w-full h-full text-emerald-600" />
                )}
              </div>
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 mb-1">
                  1-Klik Fast Pass
                </span>
                <h3 className={`text-xl font-extrabold ${config.colorText}`}>
                  Masuk dengan {config.name}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/80 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <p className="text-xs text-slate-600 leading-relaxed">
              {config.description} <strong className="text-slate-900 font-bold">100% Gratis & Langsung Aktif tanpa perlu buat password!</strong>
            </p>

            {/* Quick One-Click Auto-Fill Demo Option */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" /> Opsi Masuk Instan (1-Detik)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  Tanpa Ketik
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Gunakan akun email contoh preset <code className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">{config.defaultEmail}</code> untuk akses langsung dalam 1 klik.
              </p>
              <button
                type="button"
                onClick={() => handleInstantQuickLogin(config.defaultEmail)}
                disabled={isSubmitting}
                className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 ${config.buttonBg}`}
              >
                <CheckCircle2 className="w-4 h-4" /> Masuk Instan 1-Klik dengan {config.defaultEmail}
              </button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-bold">
                <span className="px-2 bg-white text-slate-400">Atau Gunakan Email {config.name} Milikmu</span>
              </div>
            </div>

            {/* Form custom input */}
            <form onSubmit={(e) => { e.preventDefault(); handleInstantQuickLogin(); }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email {config.name}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={`contoh: nama.kamu${config.defaultDomain}`}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap (Opsional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Budi Santoso"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Universitas (Opsional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={universityInput}
                      onChange={(e) => setUniversityInput(e.target.value)}
                      placeholder="Universitas Indonesia"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? 'Memproses Akses...' : `Lanjut Masuk dengan Email Saya`} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>🛡️ Tanpa Password • 100% Bebas Biaya</span>
            <span className="font-bold text-slate-700">Dukun Skripsi AI v2.5</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
