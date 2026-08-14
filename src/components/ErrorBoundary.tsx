import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, Check, Home, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { errorTracker } from '../utils/errorTracker';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  isSectional?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      copied: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to Real-Time Telemetry / Sentry
    const errorId = errorTracker.captureException(error, {
      componentStack: errorInfo?.componentStack,
      isSectional: Boolean(this.props.isSectional)
    });

    this.setState({ errorId });
  }

  private handleCopyError = () => {
    const diagnostic = errorTracker.generateDiagnosticReport();
    navigator.clipboard.writeText(diagnostic);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  private handleSoftReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  public render() {
    if (this.state.hasError) {
      // Sectional Fallback (e.g. For widgets, charts, sidebar modules)
      if (this.props.isSectional) {
        return (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-slate-800 dark:text-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{this.props.fallbackTitle || 'Bagian ini mengalami kendala sementara'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {this.props.fallbackMessage || 'Komponen diproteksi oleh SafeSection Boundary.'}
            </p>
            <button
              onClick={this.handleSoftReset}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-[10px]"
            >
              <RotateCcw className="w-3 h-3" /> Coba Render Ulang
            </button>
          </div>
        );
      }

      // Full Page Safe Fallback
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> Jaring Pengaman ErrorBoundary Aktif
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Sistem Mengalami Kendala Tampilan</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                {this.state.error?.message || 'Terjadi kesalahan saat memuat tampilan halaman. Seluruh data penelitian Anda tetap aman tersimpan.'}
              </p>
              {this.state.errorId && (
                <p className="text-[10px] font-mono text-slate-500">ID Tiket Diagnostik: {this.state.errorId}</p>
              )}
            </div>

            {this.state.error?.stack && (
              <div className="relative bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-left font-mono text-[11px] text-amber-300/90 max-h-36 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap break-all leading-tight">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack.slice(0, 500)}...
                </pre>
                <button
                  onClick={this.handleCopyError}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors border border-slate-700"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Laporan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Diagnostik</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                onClick={this.handleSoftReset}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Ulang</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => {
                  if (window.confirm('Reset cache akan membersihkan draf lokal sementara yang rusak. Lanjutkan?')) {
                    localStorage.removeItem('user_saved_citations');
                    localStorage.removeItem('dukun_skripsi_current_doc');
                    window.location.href = '/dashboard';
                  }
                }}
                className="text-[11px] text-slate-500 hover:text-red-400 font-medium transition-colors"
              >
                Atur Ulang Cache Sesi yang Rusak
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Sectional Safe Wrapper Component
 */
export const SafeSection: React.FC<{ children: ReactNode; title?: string; message?: string }> = ({
  children,
  title,
  message,
}) => {
  return (
    <ErrorBoundary isSectional fallbackTitle={title} fallbackMessage={message}>
      {children}
    </ErrorBoundary>
  );
};
