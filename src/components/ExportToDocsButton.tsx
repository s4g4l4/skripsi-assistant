import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FileText, Loader2, Download, CheckCircle2 } from 'lucide-react';

interface Props {
  content: string; // Teks yang akan diekspor
  title: string;   // Judul dokumen
}

const GoogleLoginButton: React.FC<{ 
  onSuccess: (token: string) => void;
  isExporting: boolean;
  exportedSuccess: boolean;
  onClickFallback: () => void;
  hasValidClientId: boolean;
}> = ({ onSuccess, isExporting, exportedSuccess, onClickFallback, hasValidClientId }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse.access_token),
    onError: (errorResponse) => {
      console.error('Google Login Error:', errorResponse);
      onClickFallback();
    },
    scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file'
  });

  const handleClick = () => {
    if (!hasValidClientId) {
      onClickFallback();
      return;
    }
    try {
      login();
    } catch (e) {
      console.error('Login trigger error:', e);
      onClickFallback();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExporting}
      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg border border-blue-500/50 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
      title="Ekspor ke Google Docs atau Unduh Berkas"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Memproses AI & Ekspor...</span>
        </>
      ) : exportedSuccess ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>Berhasil di-Ekspor!</span>
        </>
      ) : (
        <>
          <FileText className="w-3.5 h-3.5" />
          <span>Ekspor / Download</span>
        </>
      )}
    </button>
  );
};

export const ExportToDocsButton: React.FC<Props> = ({ content, title }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidClientId = Boolean(clientId && clientId.trim() !== '' && !clientId.includes('placeholder'));

  const handleExportSuccess = async (accessToken: string) => {
    setIsExporting(true);
    try {
      const customApiKeysRaw = localStorage.getItem('custom_api_keys');
      const response = await fetch('/api/google/create-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          ...(customApiKeysRaw ? { 'x-custom-api-keys': encodeURIComponent(customApiKeysRaw) } : {})
        },
        body: JSON.stringify({ title, content })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Gagal mengekspor dokumen');
      }
      
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 4000);
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan saat mengekspor ke Google Docs: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  return (
    <>
      <GoogleLoginButton 
        onSuccess={handleExportSuccess}
        isExporting={isExporting}
        exportedSuccess={exportedSuccess}
        onClickFallback={() => setShowModal(true)}
        hasValidClientId={hasValidClientId}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
              <FileText className="w-5 h-5" /> Opsi Ekspor Dokumen
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Google Client ID belum terkonfigurasi di environment preview ini atau popup diblokir. Anda dapat langsung mengunduh hasil rapi ini sebagai file teks (.txt) yang siap dimasukkan ke Google Docs.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-32 overflow-y-auto custom-scrollbar">
              {content}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleDownloadTxt();
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-4 h-4" /> Download Format .TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
