import React, { useState } from 'react';
import { ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import SocialAuthModal, { SocialProvider } from './SocialAuthModal';

interface SocialAuthButtonsProps {
  title?: string;
  subtitle?: string;
}

export default function SocialAuthButtons({
  title = "Masuk / Daftar dengan Mail",
  subtitle = "Pilih provider email terdaftar milikmu:"
}: SocialAuthButtonsProps) {
  const [selectedProvider, setSelectedProvider] = useState<SocialProvider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProvider = (provider: SocialProvider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-extrabold shadow-2xs">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gratis Selamanya untuk Mail Kampus (@*.ac.id)</span>
        </div>
        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>

      {/* Grid Logo-Only Buttons */}
      <div className="grid grid-cols-4 gap-2.5 max-w-md mx-auto">
        {/* Google Mail */}
        <button
          type="button"
          onClick={() => handleOpenProvider('google')}
          title="Masuk dengan Google Mail (@gmail.com / Kampus)"
          className="flex flex-col items-center justify-center p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 rounded-2xl shadow-xs hover:shadow-md transition-all group aspect-square"
        >
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1.5 group-hover:text-blue-600 transition-colors truncate max-w-full">
            Google
          </span>
        </button>

        {/* Microsoft Mail */}
        <button
          type="button"
          onClick={() => handleOpenProvider('microsoft')}
          title="Masuk dengan Microsoft Mail (Outlook / Hotmail / Kampus)"
          className="flex flex-col items-center justify-center p-3 bg-white hover:bg-sky-50/70 border border-slate-200 hover:border-sky-400 rounded-2xl shadow-xs hover:shadow-md transition-all group aspect-square"
        >
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-full h-full" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1.5 group-hover:text-sky-600 transition-colors truncate max-w-full">
            Microsoft
          </span>
        </button>

        {/* Yahoo Mail */}
        <button
          type="button"
          onClick={() => handleOpenProvider('yahoo')}
          title="Masuk dengan Yahoo Mail (@yahoo.com / .co.id)"
          className="flex flex-col items-center justify-center p-3 bg-white hover:bg-purple-50/70 border border-slate-200 hover:border-purple-400 rounded-2xl shadow-xs hover:shadow-md transition-all group aspect-square"
        >
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="font-black text-xl text-purple-600 tracking-tighter">Y!</span>
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1.5 group-hover:text-purple-600 transition-colors truncate max-w-full">
            Yahoo
          </span>
        </button>

        {/* Proton Mail */}
        <button
          type="button"
          onClick={() => handleOpenProvider('proton')}
          title="Masuk dengan Proton Mail (@proton.me / protonmail)"
          className="flex flex-col items-center justify-center p-3 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-2xl shadow-xs hover:shadow-md transition-all group aspect-square"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1.5 group-hover:text-emerald-600 transition-colors truncate max-w-full">
            Proton
          </span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-semibold">
          💡 Gunakan email terdaftar dari Google, Microsoft, Yahoo, atau Proton Mail.
        </p>
      </div>

      <SocialAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProvider={selectedProvider}
      />
    </div>
  );
}
