import React from 'react';
import { Lock, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ADMIN_WA_NUMBER } from '../utils/accessControl';

interface AccessExpiredModalProps {
  isOpen: boolean;
  userEmail?: string;
}

export default function AccessExpiredModal({ isOpen, userEmail }: AccessExpiredModalProps) {
  if (!isOpen) return null;

  const dynamicWaLink = `https://wa.me/62895405247374?text=${encodeURIComponent(
    `Halo Admin Dukun Skripsi, masa aktif gratis 7 hari untuk akun saya (${userEmail || 'Mahasiswa'}) telah habis. Mohon bantu perpanjang masa pakai akun saya.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative overflow-hidden animate-fade-in">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>

        {/* Lock Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-black rounded-full mb-3 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" /> Masa Gratis 7 Hari Telah Habis
        </span>

        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          Masa Aktif Akses Gratis 7 Hari Berakhir
        </h2>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 mb-6 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            Pemberitahuan Akses Dukun Skripsi:
          </p>
          <p className="text-slate-600">
            Masa uji coba gratis 7 hari untuk akun Anda telah berakhir. Silahkan hubungi Admin melalui WhatsApp di nomor{' '}
            <strong className="text-slate-900 bg-amber-100 px-1 py-0.5 rounded font-black">{ADMIN_WA_NUMBER}</strong>{' '}
            untuk memperpanjang masa pakai akun Anda.
          </p>
          {userEmail && (
            <p className="text-[11px] text-slate-400 border-t border-slate-200 pt-1.5">
              Email Akun Mahasiswa: <span className="font-mono text-slate-700 font-bold">{userEmail}</span>
            </p>
          )}
        </div>

        {/* WhatsApp Call to Action Button */}
        <a
          href={dynamicWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
        >
          <MessageSquare className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" />
          Hubungi Admin via WhatsApp
        </a>

        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          Admin WhatsApp: {ADMIN_WA_NUMBER} (Febri - Dukun Skripsi)
        </p>
      </div>
    </div>
  );
}
