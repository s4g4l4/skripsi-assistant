import React, { useState } from 'react';
import { 
  Users, Clock, ShieldCheck, ShieldAlert, X, PlusCircle, Ban, 
  CheckCircle2, RefreshCw, Calendar, Key, MessageSquare
} from 'lucide-react';
import { 
  getStoredUsers, extendUserAccess, revokeUserAccess, UserAccessInfo, 
  getRemainingTimeString, isAccessValid, ADMIN_EMAIL, ADMIN_WA_NUMBER 
} from '../utils/accessControl';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [users, setUsers] = useState<UserAccessInfo[]>(() => getStoredUsers());
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [customHours, setCustomHours] = useState<number>(5);
  const [customDays, setCustomDays] = useState<number>(1);
  const [messageNotification, setMessageNotification] = useState<string>('');

  if (!isOpen) return null;

  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  const handleGrantHours = (email: string, hours: number) => {
    extendUserAccess(email, { hours });
    refreshUsers();
    setMessageNotification(`Akses +${hours} Jam berhasil ditambahkan untuk ${email}`);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const handleGrantDays = (email: string, days: number) => {
    extendUserAccess(email, { days });
    refreshUsers();
    setMessageNotification(`Akses +${days} Hari berhasil ditambahkan untuk ${email}`);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const handleGrantUnlimited = (email: string) => {
    extendUserAccess(email, { unlimited: true });
    refreshUsers();
    setMessageNotification(`Akses Tanpa Batas (Unlimited) diaktifkan untuk ${email}`);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const handleRevoke = (email: string) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan akses penuh untuk ${email}?`)) {
      revokeUserAccess(email);
      refreshUsers();
      setMessageNotification(`Akses user ${email} berhasil dibatalkan.`);
      setTimeout(() => setMessageNotification(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Panel Kelola Akses User (Admin)</h2>
              <p className="text-xs text-slate-500">Atur durasi jam/hari akses penuh atau batalkan akses user</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {messageNotification && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {messageNotification}
          </div>
        )}

        {/* User Table & List */}
        <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Daftar User & Status Masa Aktif
            </h3>

            <div className="space-y-3">
              {users.map((u) => {
                const isValid = isAccessValid(u);
                const remainingStr = getRemainingTimeString(u);
                const isAdmin = u.role === 'admin' || u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                return (
                  <div 
                    key={u.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{u.name}</span>
                        {isAdmin ? (
                          <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">ADMIN</span>
                        ) : isValid ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">AKSES AKTIF</span>
                        ) : (
                          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2 py-0.5 rounded-full">AKSES BERAKHIR</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                      <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" /> {remainingStr}
                      </div>
                    </div>

                    {!isAdmin && (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Quick Add Hour/Day Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleGrantHours(u.email, 5)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                          >
                            +5 Jam
                          </button>
                          <button
                            onClick={() => handleGrantDays(u.email, 1)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition-colors"
                          >
                            +1 Hari
                          </button>
                          <button
                            onClick={() => handleGrantDays(u.email, 7)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-200 transition-colors"
                          >
                            +7 Hari
                          </button>
                          <button
                            onClick={() => handleGrantDays(u.email, 30)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
                          >
                            +30 Hari
                          </button>
                          <button
                            onClick={() => handleGrantUnlimited(u.email)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs rounded-xl border border-amber-300 transition-colors"
                          >
                            ⭐ Unlimited
                          </button>
                        </div>

                        {/* Revoke Button */}
                        <button
                          onClick={() => handleRevoke(u.email)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center gap-1"
                          title="Batalkan Akses User"
                        >
                          <Ban className="w-3.5 h-3.5" /> Batalkan
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Admin Info Bar */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <p className="font-bold">📱 Layanan WhatsApp Konfirmasi Akses Admin:</p>
              <p className="text-[11px] text-emerald-800">Pesan otomatis konfirmasi perpanjangan dikirimkan ke nomor Admin: <strong className="font-bold">{ADMIN_WA_NUMBER}</strong></p>
            </div>
            <a
              href={`https://wa.me/62895405247374`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WA Admin
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
