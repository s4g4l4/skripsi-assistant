# Strategi Optimasi Performa Skala Tinggi (Infrastruktur 100% Gratis & Open Source)

Dokumen ini berisi arsitektur dan strategi optimasi performa *end-to-end* untuk platform **Dukun Skripsi** yang dirancang menggunakan **stack infrastruktur 100% GRATIS** (Free Tier cloud services, open-source self-hosting, serta in-memory caching) dengan *latency* rendah, penggunaan resource efisien, dan ketersediaan tinggi tanpa biaya operasional bulanan.

---

## 1. Frontend Optimization (React + Vite - Hosted via Vercel / Cloudflare Pages Free Tier)

### A. Code Splitting & Dynamic Imports
Hindari memuat seluruh *bundle* aplikasi di awal. Gunakan `React.lazy` dan `Suspense` untuk membagi rilis berdasarkan *route* (halaman) dan komponen berat (seperti Rich Text Editor, PDF Previewer, dan SPSS Chart Visualizer):

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy load komponen berat
const ProposalWizardPage = lazy(() => import('./pages/ProposalWizardPage'));
const DocumentEditorPage = lazy(() => import('./pages/DocumentEditorPage'));
const SPSSAnalysisPage = lazy(() => import('./pages/SPSSAnalysisPage'));

export const AppRoutes = () => (
  <Suspense fallback={<div className="p-8 text-center">Loading module...</div>}>
    <Routes>
      <Route path="/wizard" element={<ProposalWizardPage />} />
      <Route path="/editor" element={<DocumentEditorPage />} />
      <Route path="/spss" element={<SPSSAnalysisPage />} />
    </Routes>
  </Suspense>
);
```

**Optimasi Chunking di `vite.config.ts`**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'motion'],
          aiServices: ['@google/genai']
        }
      }
    }
  }
});
```

### B. Component Memoization (`React.memo`, `useCallback`, `useMemo`)
Cegah *unnecessary re-renders* pada komponen daftar item yang panjang (seperti daftar riwayat sitasi atau riwayat chat AI):

```tsx
import React, { memo, useCallback } from 'react';

interface CitationItemProps {
  id: string;
  title: string;
  onDelete: (id: string) => void;
}

export const CitationCard = memo(({ id, title, onDelete }: CitationItemProps) => {
  return (
    <div className="p-4 border rounded-lg flex justify-between items-center">
      <span>{title}</span>
      <button onClick={() => onDelete(id)} className="text-red-500 hover:underline">
        Hapus
      </button>
    </div>
  );
});
```

### C. Image & Media Optimization
- Gunakan format kompresi modern **WebP** atau **AVIF** untuk aset gambar.
- Tambahkan atribut `loading="lazy"` dan `decoding="async"` untuk semua elemen gambar non-hero.
- Sajikan aset statis via **Cloudflare Free CDN** dengan *aggressive browser caching*: `Cache-Control: public, max-age=31536000, immutable`.

### D. Progressive Web App (PWA) Integration
Gunakan Service Worker untuk menyimpan aset statis dan mendukung mode *offline-first* untuk fitur draf tulisan:
- **StaleWhileRevalidate**: Untuk API katalog template dan data statis.
- **CacheFirst**: Untuk aset bundel JS/CSS dan font.
- **NetworkFirst**: Untuk endpoint dokumen aktif.

---

## 2. Backend Optimization (Express + Node.js - Self-Hosted / Render Free Tier)

### A. Database Indexing & Query Optimization (PostgreSQL / SQLite Free)
- **Compound Indexes**: Buat indeks gabungan pada kolom yang sering difilter bersamaan, misalnya `(user_id, project_id, created_at)`.
- **Selective Projection**: Selalu hanya ambil kolom yang dibutuhkan (`SELECT id, title, updated_at FROM projects`), hindari `SELECT *`.
- **Pagination Standard**: Gunakan *Cursor-based Pagination* dibanding `OFFSET / LIMIT` untuk dataset besar:
  ```sql
  SELECT id, title, created_at 
  FROM proposals 
  WHERE user_id = $1 AND id < $last_seen_id 
  ORDER BY id DESC 
  LIMIT 20;
  ```

### B. Connection Pooling & Asynchronous Processing
- Konfigurasi **Connection Pool** (misalnya PostgreSQL `pg.Pool` atau Supabase Free Pooler) agar reuse koneksi.
- Offload pemrosesan *CPU-bound* (seperti ekstraksi text dari PDF/Word) ke *In-Memory Queue* internal Node.js tanpa membutuhkan server Redis berbayar.

---

## 3. AI Service Optimization (Gemini Free Tier API)

Panggilan ke AI Model (seperti Gemini 2.5 Flash Free Tier) dioptimalkan dengan caching instan internal untuk menghemat penggunaan batas kuota harian.

### A. Response Caching (In-Memory / Upstash Free Tier Redis)
- **Exact Hash Caching**: Hitung SHA256 dari prompt input. Jika pernah dieksekusi, kembalikan hasil dari cache memori internal / Upstash Free Tier secara instan.
- **Cache Key Pattern**: `ai:cache:{prompt_hash}`

### B. Asynchronous Job Processing (Self-Hosted Queue)
Untuk tugas berat seperti **Generasi 1-Click Proposal** atau **Generate Presentasi PPTX**:
1. Request dari pengguna tidak langsung menunggu HTTP response dari AI (`timeout prevention`).
2. Server mengembalikan HTTP `202 Accepted` bersama `jobId`.
3. Worker memproses antrean di background menggunakan In-Memory Queue / Local Storage State.
4. Frontend menerima notifikasi saat proses selesai.

---

## 4. Database Architecture (Supabase / Neon / Self-Hosted PostgreSQL - 100% Gratis)

### A. Free Tier Database Setup
- Gunakan **Supabase Free Tier** / **Neon.tech Free Tier** (menyediakan PostgreSQL managed gratis) atau **Self-Hosted PostgreSQL via Docker** untuk nol biaya hosting.
- Semua data proyek, proposal, dan riwayat chat AI disimpan terstruktur dalam satu instance database gratis yang ter-indeks dengan baik.

---

## 5. Caching Strategy (In-Memory Node.js Cache & Upstash Free Tier)

### A. In-Memory & Free Redis Key Conventions

| Domain | Key Pattern | Contoh Key |
| :--- | :--- | :--- |
| **User Session** | `app:user:{userId}:session` | `app:user:usr_123:session` |
| **Proposal Cache**| `app:proposal:{projectId}` | `app:proposal:prj_889` |
| **AI Result** | `app:ai:{promptHash}` | `app:ai:a8f9b0c2...` |
| **Rate Limit** | `app:ratelimit:{ip}` | `app:ratelimit:192.168.1.1` |

---

## Summary Indikator Target Performa & Biaya (SLA)

- **Biaya Hosting & Server**: Rp 0,- (100% Gratis via Free Tier & Open Source)
- **Page Load Time (FCP)**: < 1.2 detik
- **API Response Time (Non-AI)**: < 80ms (P95)
- **AI Task Response (Via Cache)**: < 150ms
- **Uptime Target**: 99.9%
