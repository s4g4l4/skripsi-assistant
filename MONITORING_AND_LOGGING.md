# Arsitektur Monitoring, Logging & Error Handling Terpusat

Dokumen ini menjelaskan arsitektur terintegrasi untuk penanganan error (*global error handling*), sistem pencatatan log terstruktur (*structured logging*), pemantauan metriks (*monitoring & metrics*), serta sistem peringatan (*alert system*) pada platform **Dukun Skripsi**.

---

## 1. Global Error Handling (`AppError` & Middleware)

Seluruh error dalam aplikasi ditangani secara terpusat untuk menghindari *unhandled promise rejections*, kebocoran *stack trace* di lingkungan produksi, serta memberikan format respons JSON yang konsisten bagi klien.

### A. Kelas Custom `AppError` (`src/utils/AppError.ts`)
Digunakan untuk melempar *operational errors* yang diketahui beserta status HTTP terkait:

```typescript
import { AppError } from '../utils/AppError.js';

// Contoh penggunaan di Controller / Service:
if (!user) {
  throw AppError.notFound('Pengguna tidak ditemukan.');
}

if (!hasPermission) {
  throw AppError.forbidden('Anda tidak memiliki akses ke proyek ini.');
}
```

### B. Middleware Error Handler (`src/middleware/errorHandler.ts`)
Menangkap semua error dari rute Express, mencatat log terstruktur, dan mengirimkan respons JSON yang bersih:

```json
{
  "status": "error",
  "error": "Resource yang diminta tidak ditemukan."
}
```

---

## 2. Structured JSON Logging (`src/utils/logger.ts`)

Pencatatan log menggunakan format **JSON terstruktur** yang kompatibel dengan pengumpul log populer (*Log Collectors*) seperti Datadog, AWS CloudWatch, dan ELK Stack.

### A. Format Output Log
Setiap entri log mencakup timestamp, level, pesan, konteks, serta metadata opsional:

```json
{
  "timestamp": "2026-08-06T19:35:00.000Z",
  "level": "info",
  "message": "POST /api/proposal/generate 200 45ms",
  "context": "HTTP",
  "meta": {
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### B. Cara Pengunaan Logger
```typescript
import { logger } from '../utils/logger.js';

logger.info('Pengguna berhasil login', { userId: 'usr_123' }, 'AuthService');
logger.warn('Kuotakuota API Gemini mendekati batas', { remainingQuota: 5 }, 'AIService');
logger.error('Gagal menghubungkan ke database', { error: err.message }, 'Database');
```

---

## 3. Monitoring & Metriks (`src/utils/monitoring.ts`)

Aplikasi menyediakan dua jenis pemantauan ketersediaan dan performa:

### A. Endpoint Health Check (`GET /api/health`)
Mengembalikan status ketersediaan sistem, uptime, penggunaan memori (RAM), serta statistik request real-time:

```json
{
  "status": "ok",
  "service": "Dukun Skripsi Backend",
  "timestamp": "2026-08-06T19:35:00.000Z",
  "uptimeSeconds": 1420,
  "memory": {
    "rssMB": "85.40",
    "heapUsedMB": "42.10"
  },
  "requests": {
    "total": 1250,
    "errors": 12,
    "active": 3,
    "avgLatencyMs": 48.5
  }
}
```

### B. Endpoint Metriks Prometheus (`GET /api/metrics`)
Diekspos dalam format standar Prometheus untuk di-scrape oleh Prometheus Server / Grafana:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total 1250

# HELP http_requests_errors_total Total number of HTTP requests resulting in errors
# TYPE http_requests_errors_total counter
http_requests_errors_total 12

# HELP http_active_requests Currently active HTTP requests
# TYPE http_active_requests gauge
http_active_requests 3

# HELP http_request_duration_ms_avg Average HTTP request duration in milliseconds
# TYPE http_request_duration_ms_avg gauge
http_request_duration_ms_avg 48.50

# HELP app_uptime_seconds Application uptime in seconds
# TYPE app_uptime_seconds 1420

http_requests_by_status{status="200"} 1238
http_requests_by_status{status="500"} 12
```

---

## 4. Sistem Alert Real-time 100% Gratis (Telegram / Discord Webhook & Gmail SMTP)

Ketika terjadi error kritis server (Status HTTP `500` yang *non-operational* / crash tidak terduga):
1. `globalErrorHandler` mendeteksi error kritis.
2. `alertSystem.sendCriticalAlert()` dipanggil secara otomatis.
3. Notifikasi terkirim secara **100% GRATIS** tanpa biaya pengiriman melalui **Discord Webhook / Telegram Bot** dan **Gmail SMTP Nodemailer**.

### Konfigurasi Environment Variables (`.env.example`):
```env
# Free Discord / Telegram Alert Webhook (100% Gratis Tanpa Batas Kuota)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-channel-id/your-token
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Free Gmail SMTP (Hingga 500 email/hari gratis)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alert.dukuns kripsi@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_SECURE=false
ALERT_RECIPIENT_EMAIL=devops@dukuns kripsi.com
```

---

## 5. Integrasi Sentry (Optional)

Untuk melacak *unhandled exceptions* dan *client-side error tracking*:
1. Daftarkan DSN Sentry di environment variable `SENTRY_DSN`.
2. Sentry SDK secara otomatis menangkap stack trace pada `logger.error` dan `globalErrorHandler`.
