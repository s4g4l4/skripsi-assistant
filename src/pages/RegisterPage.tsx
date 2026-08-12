import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Wand2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BidangIlmuSelector from '../components/BidangIlmuSelector';
import { registerOrUpdateUserAccess, FREE_TRIAL_HOURS, FREE_TRIAL_MS, isCampusEmail } from '../utils/accessControl';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    major: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const now = Date.now();
    const targetEmail = formData.email.trim();
    const isCampus = isCampusEmail(targetEmail);

    const newUserAccess = {
      id: `user-${now}`,
      name: formData.name.trim() || 'Mahasiswa Dukun Skripsi',
      email: targetEmail,
      role: 'user' as const,
      trialStartedAt: now,
      trialDurationHours: isCampus ? 999999 : FREE_TRIAL_HOURS,
      accessGrantedUntil: isCampus ? (now + 999999 * 3600 * 1000) : (now + FREE_TRIAL_MS),
      accessStatus: isCampus ? ('unlimited' as const) : ('active' as const),
      university: formData.university.trim() || undefined,
      major: formData.major.trim() || undefined
    };

    localStorage.setItem('user_info', JSON.stringify(newUserAccess));
    localStorage.setItem('auth_token', `token_manual_${now}`);
    registerOrUpdateUserAccess(newUserAccess);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Dukun Skripsi</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Buat Akun Manual
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
          Daftar 100% Gratis & langsung masuk ke Dashboard. Atau{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors underline">
            masuk di sini
          </Link>
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-6 px-4 shadow-xl border border-slate-200/80 sm:rounded-3xl sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Budi Santoso"
                  className={`appearance-none block w-full pl-9 pr-3 py-2.5 border ${
                    errors.name ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-colors`}
                />
              </div>
              {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nama@student.univ.ac.id atau email biasa"
                  className={`appearance-none block w-full pl-9 pr-3 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-colors`}
                />
              </div>
              {errors.email ? (
                <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
              ) : (
                <p className="mt-1 text-[10px] text-slate-400 font-medium">
                  Gunakan email berakhiran <strong className="text-emerald-700 font-mono">.ac.id</strong> untuk otomatis bebas biaya selamanya.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimal 6 karakter"
                  className={`appearance-none block w-full pl-9 pr-10 py-2.5 border ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>

            {/* Universitas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Perguruan Tinggi / Universitas <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="university"
                  type="text"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Contoh: Universitas Indonesia"
                  className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl shadow-2xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Jurusan / Program Studi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Program Studi / Jurusan <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <BidangIlmuSelector
                value={formData.major}
                onChange={(val) => setFormData(prev => ({ ...prev, major: val }))}
                placeholder="Pilih atau ketik nama program studi / ju"
                required={false}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2 group"
            >
              <CheckCircle2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span>{isSubmitting ? 'Memproses Akun Baru...' : 'Buat Akun Manual & Mulai Gratis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

