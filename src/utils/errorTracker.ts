/**
 * Real-Time Error Tracker & Telemetry System
 * Supports Sentry/LogRocket integration + In-Memory & LocalStorage Ring Buffer
 * Dispatches diagnostic reports to backend /api/diagnostics/telemetry
 */

export type SeverityLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface Breadcrumb {
  timestamp: string;
  category: string;
  message: string;
  level: SeverityLevel;
  data?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  timestamp: string;
  name: string;
  message: string;
  stack?: string;
  level: SeverityLevel;
  url: string;
  userAgent: string;
  context?: Record<string, any>;
  breadcrumbs: Breadcrumb[];
}

const MAX_BREADCRUMBS = 60;
const STORAGE_KEY_ERRORS = 'dukun_skripsi_telemetry_errors';

class ErrorTracker {
  private breadcrumbs: Breadcrumb[] = [];
  private isInitialized = false;
  private isSentryLoaded = false;
  private isLogRocketLoaded = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Add initial startup breadcrumb
    this.addBreadcrumb({
      category: 'system',
      message: 'Aplikasi Skripsi dimulai (Telemetry Active)',
      level: 'info',
    });

    // Check for Sentry / LogRocket in global window or env
    this.detectThirdPartyTrackers();

    // Attach Global Error Listeners
    window.addEventListener('error', (event) => {
      const msg = String(event.message || '');
      // Ignore benign browser/Vite/cross-origin noise
      if (
        msg.includes('ResizeObserver') ||
        msg.includes('websocket') ||
        msg.includes('Script error.') ||
        msg.includes('ChunkLoadError')
      ) {
        return;
      }
      this.captureException(event.error || new Error(event.message || 'Unknown window error'), {
        source: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const errorMsg = String(reason?.message || reason || '');
      if (
        errorMsg.includes('ResizeObserver') ||
        errorMsg.includes('websocket') ||
        errorMsg.includes('AbortError') ||
        errorMsg.includes('user cancelled')
      ) {
        return;
      }
      const error = reason instanceof Error ? reason : new Error(String(reason || 'Unhandled Promise Rejection'));
      this.captureException(error, {
        source: 'window.onunhandledrejection',
      });
    });

    // Capture console.error breadcrumbs safely
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      originalConsoleError.apply(console, args);
      try {
        const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        this.addBreadcrumb({
          category: 'console',
          message: msg.slice(0, 300),
          level: 'error',
        });
      } catch {
        // Prevent console loop
      }
    };
  }

  private detectThirdPartyTrackers() {
    try {
      // Check Sentry
      if ((window as any).Sentry) {
        this.isSentryLoaded = true;
      }
      // Check LogRocket
      if ((window as any).LogRocket) {
        this.isLogRocketLoaded = true;
      }
    } catch {
      // Ignore detection error
    }
  }

  public addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>) {
    const entry: Breadcrumb = {
      ...breadcrumb,
      timestamp: new Date().toISOString(),
    };

    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > MAX_BREADCRUMBS) {
      this.breadcrumbs.shift();
    }

    // Forward to Sentry if active
    if (this.isSentryLoaded && (window as any).Sentry?.addBreadcrumb) {
      try {
        (window as any).Sentry.addBreadcrumb({
          category: entry.category,
          message: entry.message,
          level: entry.level === 'warn' ? 'warning' : entry.level,
          data: entry.data,
        });
      } catch {}
    }
  }

  public captureException(error: Error | any, context?: Record<string, any>): string {
    const errorObj = error instanceof Error ? error : new Error(String(error || 'Unknown Error'));
    const errorId = 'err_' + Math.random().toString(36).substring(2, 9);

    const report: ErrorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      name: errorObj.name || 'Error',
      message: errorObj.message || 'Unknown error occurred',
      stack: errorObj.stack,
      level: 'error',
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      context,
      breadcrumbs: [...this.breadcrumbs],
    };

    // Save to local storage ring buffer for offline persistence
    this.saveLocalReport(report);

    // Forward to Sentry
    if (this.isSentryLoaded && (window as any).Sentry?.captureException) {
      try {
        (window as any).Sentry.captureException(errorObj, { extra: context });
      } catch {}
    }

    // Forward to LogRocket
    if (this.isLogRocketLoaded && (window as any).LogRocket?.captureException) {
      try {
        (window as any).LogRocket.captureException(errorObj, { extra: context });
      } catch {}
    }

    // Dispatch to Backend Telemetry Endpoint in background
    this.dispatchToBackend(report);

    return errorId;
  }

  public captureMessage(message: string, level: SeverityLevel = 'info', context?: Record<string, any>) {
    this.addBreadcrumb({
      category: 'telemetry',
      message,
      level,
      data: context,
    });

    if (level === 'error' || level === 'fatal') {
      this.captureException(new Error(message), context);
    }
  }

  private async dispatchToBackend(report: ErrorReport) {
    try {
      if (typeof fetch === 'undefined') return;
      await fetch('/api/diagnostics/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
    } catch {
      // Silent catch to prevent recursion
    }
  }

  private saveLocalReport(report: ErrorReport) {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY_ERRORS);
      const list: ErrorReport[] = raw ? JSON.parse(raw) : [];
      list.unshift(report);
      if (list.length > 20) list.pop();
      localStorage.setItem(STORAGE_KEY_ERRORS, JSON.stringify(list));
    } catch {}
  }

  public getRecentErrors(): ErrorReport[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY_ERRORS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public getBreadcrumbs(): Breadcrumb[] {
    return [...this.breadcrumbs];
  }

  public clearAllLogs() {
    this.breadcrumbs = [];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY_ERRORS);
      }
    } catch {}
  }

  public generateDiagnosticReport(): string {
    const memory = (performance as any)?.memory 
      ? `JS Heap: ${Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round((performance as any).memory.totalJSHeapSize / (1024 * 1024))}MB`
      : 'Memory info not available';

    const report = {
      app: 'Dukun Skripsi AI',
      generatedAt: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
      memory,
      breadcrumbsCount: this.breadcrumbs.length,
      recentErrors: this.getRecentErrors().slice(0, 5),
    };

    return JSON.stringify(report, null, 2);
  }
}

export const errorTracker = new ErrorTracker();
