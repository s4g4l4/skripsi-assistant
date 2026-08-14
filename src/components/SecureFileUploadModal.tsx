import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, ShieldCheck, 
  X, Loader2, Lock, ArrowRight, RefreshCw, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateThesisFileUpload, FileValidationResult } from '../utils/fileSecurity';
import { errorTracker } from '../utils/errorTracker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFileAccepted: (file: File, validation: FileValidationResult) => void;
  title?: string;
  description?: string;
  maxSizeMb?: number;
  allowedExtensions?: string[];
}

export const SecureFileUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onFileAccepted,
  title = 'Upload Berkas Skripsi Aman',
  description = 'Unggah draf skripsi, buku pedoman kampus, atau lampiran data dengan validasi Magic-Byte dan proteksi biner otomatis.',
  maxSizeMb = 25,
  allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.csv', '.zip'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setSelectedFile(file);
    setIsScanning(true);
    setValidationResult(null);

    try {
      errorTracker.addBreadcrumb({
        category: 'upload',
        message: `Mulai validasi keamanan berkas: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        level: 'info',
      });

      // Artificial short delay for high-tech UI feedback (0.4s)
      await new Promise(r => setTimeout(r, 400));
      
      const result = await validateThesisFileUpload(file, {
        maxSizeMb,
        allowedExtensions,
        checkMagicBytes: true,
      });

      setValidationResult(result);

      if (result.isValid) {
        errorTracker.addBreadcrumb({
          category: 'upload',
          message: `Berkas lolos validasi keamanan: ${result.sanitizedName}`,
          level: 'info',
        });
      } else {
        errorTracker.captureMessage(`Upload ditolak: ${result.error}`, 'warn');
      }
    } catch (err: any) {
      setValidationResult({
        isValid: false,
        isSafe: false,
        error: err?.message || 'Gagal memproses berkas.',
        sanitizedName: file.name,
        fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)),
        detectedMime: file.type,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && validationResult && validationResult.isValid) {
      onFileAccepted(selectedFile, validationResult);
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
              <p className="text-xs text-slate-500">Maks. {maxSizeMb} MB • Magic-Byte Verified</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>

          <input 
            ref={fileInputRef}
            type="file" 
            accept={allowedExtensions.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 bg-emerald-100/70 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                Tarik & Lepas Berkas ke Sini atau <span className="text-emerald-600 underline">Pilih File</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Format didukung: {allowedExtensions.join(', ')}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-bold border border-emerald-200">
                <Lock className="w-3 h-3 text-emerald-600" /> Sanitasi & Pemeriksaan Header Aktif
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-700 font-semibold p-1.5"
                  title="Ganti File"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Scanning status */}
              {isScanning && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                  <span>Memeriksa struktur biner (Magic Bytes) dan sanitasi nama file...</span>
                </div>
              )}

              {/* Validation Result */}
              {!isScanning && validationResult && (
                <div>
                  {validationResult.isValid ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Berkas Aman & Terverifikasi</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 pl-6 space-y-0.5">
                        <p>• Header Format: {validationResult.detectedMime}</p>
                        <p>• Nama Bersih: {validationResult.sanitizedName}</p>
                        <p>• Ukuran: {validationResult.fileSizeMb} MB (Dalam batas)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-2 text-red-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Berkas Ditolak</span>
                      </div>
                      <p className="text-[11px] text-red-700 pl-6">
                        {validationResult.error}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Batal
          </button>
          
          <button
            type="button"
            disabled={!selectedFile || isScanning || !validationResult?.isValid}
            onClick={handleConfirm}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Lanjutkan Proses</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
