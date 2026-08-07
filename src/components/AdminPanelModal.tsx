import React, { useState } from 'react';
import { 
  Users, Clock, ShieldCheck, ShieldAlert, X, PlusCircle, Ban, 
  CheckCircle2, RefreshCw, Calendar, Key, MessageSquare, Trash2, Lock, Plus, Minus
} from 'lucide-react';
import { 
  getStoredUsers, extendUserAccess, adjustUserAccessTime, revokeUserAccess, deleteUserAccount, UserAccessInfo, 
  getRemainingTimeString, isAccessValid, ADMIN_EMAIL, ADMIN_WA_NUMBER 
} from '../utils/accessControl';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [users, setUsers] = useState<UserAccessInfo[]>(() => getStoredUsers());
  const [customInputs, setCustomInputs] = useState<{
    [email: string]: { amount: number; unit: 'hours' | 'days' };
  }>({});
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

  const handleReduceHours = (email: string, hours: number) => {
    adjustUserAccessTime(email, { hours, action: 'reduce' });
    refreshUsers();
    setMessageNotification(`Akses -${hours} Jam berhasil dikurangi untuk ${email}`);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const handleReduceDays = (email: string, days: number) => {
    adjustUserAccessTime(email, { days, action: 'reduce' });
    refreshUsers();
    setMessageNotification(`Akses -${days} Hari berhasil dikurangi untuk ${email}`);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const handleCustomAdjust = (email: string, action: 'add' | 'reduce') => {
    const custom = customInputs[email] || { amount: 1, unit: 'hours' };
    if (!custom.amount || custom.amount <= 0) return;

    if (custom.unit === 'hours') {
      if (action === 'add') {
        extendUserAccess(email, { hours: custom.amount });
      } else {
        adjustUserAccessTime(email, { hours: custom.amount, action: 'reduce' });
      }
      setMessageNotification(`Akses ${action === 'add' ? '+' : '-'}${custom.amount} Jam berhasil diproses untuk ${email}`);
    } else {
      if (action === 'add') {
        extendUserAccess(email, { days: custom.amount });
      } else {
        adjustUserAccessTime(email, { days: custom.amount, action: 'reduce' });
      }
      setMessageNotification(`Akses ${action === 'add' ? '+' : '-'}${custom.amount} Hari berhasil diproses untuk ${email}`);
    }

    refreshUsers();
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

  const handleDelete = (email: string) => {
    if (confirm(`AKSI KHUSUS ADMIN:\nApakah Anda yakin ingin MENGHAPUS PERMANEN akun (${email})?\n\nAkun yang terhapus tidak akan bisa masuk lagi kecuali mendaftar ulang.`)) {
      deleteUserAccount(email);
      refreshUsers();
      setMessageNotification(`Akun ${email} telah berhasil dihapus dari database oleh Admin.`);
      setTimeout(() => setMessageNotification(''), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Panel Kelola Akses User (Admin)</h2>
              <p className="text-xs text-slate-500">Atur & sesuaikan (tambah/kurang) jam dan hari masa aktif pengguna</p>
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

            <div className="space-y-4">
              {users.map((u) => {
                const isValid = isAccessValid(u);
                const remainingStr = getRemainingTimeString(u);
                const isAdmin = u.role === 'admin' || u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                const userCustom = customInputs[u.email] || { amount: 1, unit: 'hours' };

                return (
                  <div 
                    key={u.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                  >
                    {/* User Info Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                          {isAdmin ? (
                            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">ADMIN</span>
                          ) : isValid ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">AKSES AKTIF</span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2 py-0.5 rounded-full">AKSES BERAKHIR</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{u.email}</p>
                      </div>

                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1.5 self-start sm:self-center">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> {remainingStr}
                      </div>
                    </div>

                    {!isAdmin && (
                      <div className="space-y-3 pt-1">
                        {/* Quick Add Action Buttons */}
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 space-y-1.5">
                          <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Tambah Masa Aktif (+)
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              onClick={() => handleGrantHours(u.email, 1)}
                              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              +1 Jam
                            </button>
                            <button
                              onClick={() => handleGrantHours(u.email, 5)}
                              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              +5 Jam
                            </button>
                            <button
                              onClick={() => handleGrantDays(u.email, 1)}
                              className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              +1 Hari
                            </button>
                            <button
                              onClick={() => handleGrantDays(u.email, 7)}
                              className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              +7 Hari
                            </button>
                            <button
                              onClick={() => handleGrantDays(u.email, 30)}
                              className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              +30 Hari
                            </button>
                            <button
                              onClick={() => handleGrantUnlimited(u.email)}
                              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              ⭐ Unlimited
                            </button>
                          </div>
                        </div>

                        {/* Custom Input Adjustment Box */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-700">Atur Kustom:</span>
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={userCustom.amount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setCustomInputs(prev => ({
                                  ...prev,
                                  [u.email]: { ...userCustom, amount: val }
                                }));
                              }}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <select
                              value={userCustom.unit}
                              onChange={(e) => {
                                const unit = e.target.value as 'hours' | 'days';
                                setCustomInputs(prev => ({
                                  ...prev,
                                  [u.email]: { ...userCustom, unit }
                                }));
                              }}
                              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="hours">Jam</option>
                              <option value="days">Hari</option>
                            </select>

                            <button
                              onClick={() => handleCustomAdjust(u.email, 'add')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Plus className="w-3 h-3" /> Tambah
                            </button>
                            <button
                              onClick={() => handleCustomAdjust(u.email, 'reduce')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Minus className="w-3 h-3" /> Kurangi
                            </button>
                          </div>

                          {/* Actions: Revoke & Delete */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRevoke(u.email)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                              title="Batalkan Akses User"
                            >
                              <Ban className="w-3 h-3" /> Batalkan
                            </button>

                            <button
                              onClick={() => handleDelete(u.email)}
                              className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                              title="Hapus Akun Permanen"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Protection Policy Banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs flex items-center gap-3 border border-slate-800">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-100">🔒 Perlindungan Data Pendaftar (Proteksi Perbaikan)</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Seluruh data akun pendaftar tersimpan secara permanen di penyimpanan aplikasi. Pembaruan/perbaikan sistem <strong>TIDAK AKAN menghapus akun terdaftar</strong>. Hanya Admin yang dapat menghapus akun secara manual melalui tombol "Hapus" di atas.
              </p>
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

