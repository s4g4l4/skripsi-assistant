import React, { useState } from 'react';
import { 
  Users, Clock, ShieldCheck, ShieldAlert, X, PlusCircle, Ban, 
  CheckCircle2, RefreshCw, Calendar, Key, MessageSquare, Trash2, Lock, Plus, Minus, Search, UserMinus, UserPlus, Cpu, Activity
} from 'lucide-react';
import { 
  getStoredUsers, extendUserAccess, adjustUserAccessTime, revokeUserAccess, deleteUserAccount, registerOrUpdateUserAccess, UserAccessInfo, 
  getRemainingTimeString, isAccessValid, ADMIN_EMAIL, ADMIN_WA_NUMBER 
} from '../utils/accessControl';
import { ResilienceStatusWidget } from './ResilienceStatusWidget';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'resilience'>('users');
  const [users, setUsers] = useState<UserAccessInfo[]>(() => getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [customInputs, setCustomInputs] = useState<{
    [email: string]: { amount: number; unit: 'hours' | 'days' };
  }>({});
  const [messageNotification, setMessageNotification] = useState<string>('');
  
  // Confirmation Modal States (Replaces window.confirm which gets blocked in iframe)
  const [userToDelete, setUserToDelete] = useState<UserAccessInfo | null>(null);
  const [userToRevoke, setUserToRevoke] = useState<UserAccessInfo | null>(null);

  // New user form state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      refreshUsers();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isOpen) return null;

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

  const confirmRevokeUser = () => {
    if (!userToRevoke) return;
    revokeUserAccess(userToRevoke.email);
    refreshUsers();
    setMessageNotification(`Akses user ${userToRevoke.email} berhasil dibatalkan.`);
    setUserToRevoke(null);
    setTimeout(() => setMessageNotification(''), 3000);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUserAccount(userToDelete.email);
    refreshUsers();
    setMessageNotification(`Akun user/mahasiswa ${userToDelete.name} (${userToDelete.email}) BERHASIL DIHAPUS PERMANEN dari sistem.`);
    setUserToDelete(null);
    setTimeout(() => setMessageNotification(''), 4000);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    const now = Date.now();
    const newUser: UserAccessInfo = {
      id: `user-${now}`,
      name: newUserName || 'Mahasiswa Baru',
      email: newUserEmail.trim().toLowerCase(),
      role: 'user',
      trialStartedAt: now,
      trialDurationHours: 168,
      accessGrantedUntil: now + 168 * 3600 * 1000,
      accessStatus: 'active'
    };
    registerOrUpdateUserAccess(newUser);
    refreshUsers();
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserForm(false);
    setMessageNotification(`Mahasiswa baru (${newUser.name}) berhasil ditambahkan!`);
    setTimeout(() => setMessageNotification(''), 3500);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Panel Kelola Akun & Akses User (Admin)</h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-200">
                  {users.length} User Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-500">Kelola, perpanjang, atau hapus akun mahasiswa/user terdaftar secara permanen</p>
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
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {messageNotification}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-3 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kelola Akun & Kuota User</span>
            <span className="px-1.5 py-0.2 bg-slate-200/80 text-slate-700 rounded-full text-[10px]">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resilience')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'resilience'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Keandalan & Keamanan Sistem (Resilience Hub)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>

        {activeTab === 'resilience' ? (
          <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            <ResilienceStatusWidget isAdmin={true} />
          </div>
        ) : (
          /* User Table & List */
          <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            
            {/* Filter & Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/60">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Daftar User/Mahasiswa ({filteredUsers.length})
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-64"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-xs shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Tambah User
                </button>
              </div>
            </div>

            {/* Form Tambah User Manual */}
            {showAddUserForm && (
              <form onSubmit={handleAddUserSubmit} className="p-3 bg-white border border-emerald-200 rounded-2xl space-y-3 shadow-xs">
                <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-600" /> Form Tambah Mahasiswa/User Baru
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Lengkap Mahasiswa"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Mahasiswa (misal: user@student.univ.ac.id)"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                  >
                    Simpan User Baru
                  </button>
                </div>
              </form>
            )}

            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">
                Tidak ada user atau mahasiswa yang cocok dengan pencarian "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => {
                  const isValid = isAccessValid(u);
                  const remainingStr = getRemainingTimeString(u);
                  const isAdmin = u.role === 'admin' || u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                  const userCustom = customInputs[u.email] || { amount: 1, unit: 'hours' };

                  return (
                    <div 
                      key={u.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
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
                          <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                            <span>{u.email}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">💾 User ID: {u.id}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" /> {remainingStr}
                          </div>

                          {!isAdmin && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
                              title="Hapus Akun Mahasiswa/User Secara Permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus User
                            </button>
                          )}
                        </div>
                      </div>

                      {!isAdmin && (
                        <div className="space-y-3 pt-1">
                          {/* Quick Add Action Buttons */}
                          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 space-y-1.5">
                            <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Perpanjang Masa Aktif User (+):
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
                                onClick={() => setUserToRevoke(u)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                                title="Batalkan Akses User Sementara"
                              >
                                <Ban className="w-3 h-3" /> Batalkan Akses
                              </button>

                              <button
                                onClick={() => setUserToDelete(u)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg transition-all flex items-center gap-1 shadow-xs"
                                title="Hapus Permanen Akun Ini"
                              >
                                <Trash2 className="w-3 h-3" /> Hapus Permanen
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Protection Policy Banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs flex items-center gap-3 border border-slate-800">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-100">🔒 Perlindungan Data Pendaftar (Proteksi Admin)</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Seluruh data akun pendaftar tersimpan secara permanen di penyimpanan aplikasi. Pembaruan/perbaikan sistem <strong>TIDAK AKAN menghapus akun terdaftar</strong>. Hanya Admin yang dapat menghapus akun secara manual melalui tombol merah "Hapus User" di atas.
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
      )}

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

      {/* Confirmation Modal for User Deletion */}
      {userToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Konfirmasi Hapus User</h3>
                <p className="text-xs text-red-600 font-extrabold uppercase tracking-wide">AKSI TINGKAT ADMIN - PERMANEN</p>
              </div>
            </div>

            <div className="p-3.5 bg-red-50/80 rounded-2xl border border-red-200/80 text-xs text-slate-800 space-y-2 mb-5">
              <p className="font-medium">Apakah Anda yakin ingin menghapus akun mahasiswa/user berikut secara permanen?</p>
              <div className="p-2.5 bg-white rounded-xl border border-red-100 font-mono text-[11px] space-y-1">
                <p><span className="text-slate-500 font-sans font-bold">Nama:</span> <strong className="text-slate-900">{userToDelete.name}</strong></p>
                <p><span className="text-slate-500 font-sans font-bold">Email:</span> <strong className="text-red-700">{userToDelete.email}</strong></p>
                <p><span className="text-slate-500 font-sans font-bold">User ID:</span> <span className="text-slate-600">{userToDelete.id}</span></p>
              </div>
              <p className="text-[11px] text-red-800 font-bold">⚠️ Akun yang terhapus akan langsung dihilangkan dari sistem dan tidak dapat login lagi.</p>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Revoking Access */}
      {userToRevoke && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-fadeIn">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <Ban className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Konfirmasi Pembatalan Akses</h3>
                <p className="text-xs text-amber-600 font-extrabold">AKSI SEMENTARA</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-800 space-y-1.5 mb-5">
              <p>Apakah Anda yakin ingin membatalkan akses aktif untuk user ini?</p>
              <p className="font-bold text-slate-900">{userToRevoke.name} ({userToRevoke.email})</p>
              <p className="text-[11px] text-amber-800">Status akses akan diubah menjadi 'Dibatalkan'. Akun masih tersimpan tetapi tidak memiliki akses fitur.</p>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setUserToRevoke(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmRevokeUser}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Ban className="w-4 h-4" /> Batalkan Akses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

