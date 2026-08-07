# Panduan Deployment Lengkap (Dukun Skripsi Platform)

Dokumen ini berisi panduan teknis langkah-demi-langkah untuk melakukan deployment aplikasi **Dukun Skripsi** (React + Vite + Express Full-Stack) ke lingkungan produksi (*production environment*).

---

## 1. Frontend Deployment (Vercel / Netlify)

Jika Anda ingin mendedikasikan frontend terpisah atau meng-host static SPA:

### A. Vercel
1. Hubungkan repository GitHub ke Vercel Dashboard.
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://api.dukuns kripsi.com` (URL backend Express Anda)

### B. Netlify
1. Pilih *New site from Git*.
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. Buat file `public/_redirects` untuk penanganan Single Page Application (SPA):
   ```text
   /*    /index.html   200
   ```

---

## 2. Backend Deployment (Render / Railway / AWS Cloud Run)

Aplikasi ini menggunakan arsitektur Express + Vite yang dapat dibundel menjadi executable Node.js CJS tunggal (`dist/server.cjs`).

### A. Deployment Menggunakan Dockerfile (Disarankan)
Aplikasi sudah dilengkapi dengan `Dockerfile` multi-stage:
```dockerfile
# Build image
docker build -t dukun-skripsi-app .

# Run container
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY="your-gemini-key" \
  -e JWT_SECRET="your-jwt-secret" \
  dukun-skripsi-app
```

### B. Render / Railway / AWS App Runner / GCP Cloud Run
1. **Build Command**: `npm run build`
2. **Start Command**: `npm run start` (eksekusi `node dist/server.cjs`)
3. **Port**: `3000`
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `GEMINI_API_KEY`: API Key dari Google AI Studio / Gemini
   - `JWT_SECRET`: Secret key acak untuk verifikasi token JWT
   - `DATABASE_URL`: Connection string PostgreSQL / MongoDB

---

## 3. Database Deployment (MongoDB Atlas / PostgreSQL RDS)

### A. PostgreSQL (AWS RDS / Supabase / Neon)
1. Buat database instance (PostgreSQL 15+).
2. Dapatkan URL Koneksi SSL:
   `postgres://user:password@db-host.rds.amazonaws.com:5432/dukun_skripsi?sslmode=require`
3. Simpan di environment variable `DATABASE_URL`.

### B. MongoDB Atlas (jika menggunakan NoSQL)
1. Buat Cluster di MongoDB Atlas (Shared Free Tier / Dedicated M10+).
2. Tambahkan IP Address backend ke Network Access / Whitelist.
3. Dapatkan URI Connection String:
   `mongodb+srv://admin:password@cluster.mongodb.net/dukun_skripsi?retryWrites=true&w=majority`

---

## 4. Redis: Caching & Queue System (BullMQ)

Redis digunakan untuk caching data berat (seperti hasil interpretasi SPSS atau pencarian sitasi) serta penanganan antrean async job (generasi proposal / presentasi).

### A. Provider Redis Terkelola
- **Upstash Redis** / **Redis Enterprise** / **AWS ElastiCache**
- URI Redis Connection: `rediss://default:password@your-redis-host.upstash.io:6379`

### B. Contoh Integrasi Queue (BullMQ + Redis)
```typescript
import { Queue, Worker } from 'bullmq';

const connection = { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) };

export const proposalQueue = new Queue('proposal-generation', { connection });

// Worker pemroses antrean
const worker = new Worker('proposal-generation', async job => {
  console.log(`Processing job ${job.id}`);
  // Panggil AI Service
}, { connection });
```

---

## 5. CI/CD Pipeline (GitHub Actions)

Aplikasi sudah dikonfigurasi dengan workflow CI/CD otomatis di `.github/workflows/deploy.yml`:

1. **Trigger**: Push ke branch `main` atau `master`.
2. **Langkah-langkah Pipeline**:
   - Checkout kode repository.
   - Setup Node.js v20.
   - Run type checking & linter (`npm run lint`).
   - Run build (`npm run build`).
   - Build Docker Image & Push ke GitHub Container Registry (GHCR) atau Docker Hub.
   - Deploy otomatis ke Cloud Server via Webhook / Cloud Run Deploy Step.

---

## 6. Monitoring, Logging & APM

### A. Sentry (Error Tracking & Crash Reporting)
- Install Sentry SDK: `@sentry/node` dan `@sentry/react`.
- Tangkap unhandled exception di Express middleware & React Error Boundary.

### B. Prometheus & Grafana (Metrics)
- Gunakan package `prom-client` untuk mengekspos endpoint `/metrics`:
```typescript
import client from 'prom-client';
client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

### C. Log Management (ELK Stack / CloudWatch / Datadog)
- Gunakan struktur JSON Logger (misal: `winston` atau `pino`) agar log mudah di-index di Kibana / AWS CloudWatch Logs.

---

## 7. Keamanan Production (Security Best Practices)

### A. SSL / TLS HTTPS
- Selalu gunakan HTTPS di production (diatur otomatis oleh Vercel, Cloud Run, atau Reverse Proxy Nginx / Certbot / Cloudflare).

### B. Security Headers (Helmet.js)
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### C. Rate Limiting (Express Rate Limit)
Cegah brute-force dan abusive API spam:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP
  message: { error: 'Terlalu banyak permintaan, coba lagi nanti.' }
});

app.use('/api/', limiter);
```

### D. CORS (Cross-Origin Resource Sharing)
Restriksi domain origin yang diizinkan memanggil backend:
```typescript
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://dukuns kripsi.com',
  credentials: true
}));
```

---

## Ringkasan Perintah Penting (Cheat Sheet)

| Tugas | Perintah |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Check Types** | `npm run lint` |
| **Production Build** | `npm run build` |
| **Production Start** | `npm run start` |
| **Docker Build** | `docker build -t dukun-skripsi .` |
| **Docker Run** | `docker run -p 3000:3000 dukun-skripsi` |
