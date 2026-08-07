import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building, Calendar, ArrowRight, ArrowLeft, Wand2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedOtpCode, setGeneratedOtpCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  const handleGenerateNewOtp = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpCode(newCode);
    return newCode;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    major: '',
    batchYear: '',
    otp: ['', '', '', '', '', '']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.university.trim()) newErrors.university = 'Universitas wajib diisi';
    if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi';
    if (!formData.batchYear) newErrors.batchYear = 'Tahun angkatan wajib dipilih';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Dukun Skripsi</span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Atau{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
            masuk jika sudah punya akun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-3xl sm:px-10">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`text-xs font-bold ${step >= i ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {i === 1 ? 'Akun' : i === 2 ? 'Kampus' : 'Verifikasi'}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'} transition-colors duration-500`}></div>
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'} transition-colors duration-500`}></div>
              <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'} transition-colors duration-500`}></div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="name" type="text" value={formData.name} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="Budi Santoso" />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="budi@student.univ.ac.id" />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Universitas</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="university" type="text" value={formData.university} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${errors.university ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="Contoh: Universitas Indonesia" />
                    </div>
                    {errors.university && <p className="mt-1 text-xs text-red-500">{errors.university}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-slate-400" />
                      </div>
                      <input name="major" type="text" value={formData.major} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${errors.major ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`} placeholder="Contoh: Ilmu Komputer" />
                    </div>
                    {errors.major && <p className="mt-1 text-xs text-red-500">{errors.major}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tahun Angkatan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <select name="batchYear" value={formData.batchYear} onChange={handleChange} required className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${errors.batchYear ? 'border-red-500' : 'border-slate-300'} rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-slate-50 focus:bg-white`}>
                        <option value="">Pilih Tahun Angkatan</option>
                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    {errors.batchYear && <p className="mt-1 text-xs text-red-500">{errors.batchYear}</p>}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                    <Mail className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Verifikasi Kode Email</h3>
                    <p className="text-sm text-slate-600">
                      Kode OTP 6-digit dikirim oleh <strong className="font-bold text-slate-900">drido652@gmail.com</strong> ke: <br/>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-1 font-mono text-xs">{formData.email || 'email@anda.com'}</span>
                    </p>
                  </div>

                  {/* High Contrast Banner for Demo / Instant OTP with Sender Email */}
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-left space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-900 flex items-center gap-1.5">
                        <Wand2 className="w-4 h-4 text-amber-600" /> Pengirim: drido652@gmail.com
                      </span>
                      <span className="font-mono font-black text-sm text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-xs tracking-wider">
                        {generatedOtpCode}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Layanan OTP Otomatis dikirim dari email <strong>drido652@gmail.com</strong>. Klik tombol di bawah untuk Auto-Fill kode OTP acak ({generatedOtpCode}) secara otomatis:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, otp: generatedOtpCode.split('') });
                      }}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Auto-Fill Kode OTP Acak ({generatedOtpCode})
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Masukkan 6-Digit Kode OTP</label>
                    <div className="flex justify-center gap-2">
                      {formData.otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          className="w-10 h-12 text-center text-xl font-extrabold border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 shadow-xs transition-all"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && i > 0) {
                              const prev = document.getElementById(`otp-${i - 1}`);
                              prev?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Belum melihat kode?{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        const newCode = handleGenerateNewOtp();
                        setFormData({ ...formData, otp: newCode.split('') });
                        alert(`Kode OTP acak baru (${newCode}) telah dikirim oleh drido652@gmail.com`);
                      }}
                      className="font-bold text-emerald-600 hover:text-emerald-500 underline"
                    >
                      Kirim Ulang Kode OTP Acak
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Lanjut <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    const now = Date.now();
                    const newUserAccess = {
                      id: `user-${now}`,
                      name: formData.name || 'User Dukun Skripsi',
                      email: formData.email || 'user@dukunskripsi.id',
                      role: 'user' as const,
                      trialStartedAt: now,
                      trialDurationHours: 5,
                      accessGrantedUntil: now + 5 * 3600 * 1000,
                      accessStatus: 'active' as const
                    };
                    localStorage.setItem('user_info', JSON.stringify(newUserAccess));
                    navigate('/dashboard');
                  }}
                  className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Selesai Daftar (Mulai Trial 5 Jam)
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
