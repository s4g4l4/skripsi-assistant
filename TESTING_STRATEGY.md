# Strategi Testing Komprehensif (Dukun Skripsi Platform)

Dokumen ini menjelaskan strategi pengujian (*testing strategy*) secara menyeluruh untuk memastikan kualitas kode, keandalan fungsional, performa, serta keamanan platform **Dukun Skripsi**.

---

## 1. Unit Testing (Vitest / Jest)

Unit testing difokuskan pada pengujian komponen terkecil dari kode secara terisolasi tanpa merujuk pada *external service* aktual.

### A. Komponen yang Diuji
- **Utility Functions**: Pemformat teks, pembuat prompt, utilitas ekstraksi JSON.
- **AI Service Helper**: Pengecekan penanganan error dan fallback ketika Gemini API tidak merespons.
- **Validation Schemas**: Validasi input form (email, password, parameter proposal).

### B. Contoh Kode Unit Test (`src/services/aiService.test.ts`)
```typescript
import { describe, it, expect, vi } from 'vitest';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';

describe('Prompt Templates Test Suite', () => {
  it('harus menghasilkan prompt proposal yang valid dengan input lengkap', () => {
    const mockData = {
      judul: 'Analisis Sentimen Opini Publik',
      latarBelakang: 'Penggunaan media sosial meningkat',
      rumusanMasalah: 'Bagaimana akurasi algoritma Naive Bayes?',
      metode: 'Kuantitatif'
    };

    const prompt = PROMPT_TEMPLATES.GENERATE_PROPOSAL(mockData);

    expect(prompt).toContain('Analisis Sentimen Opini Publik');
    expect(prompt).toContain('BAB I PENDAHULUAN');
    expect(prompt).toContain('DAFTAR PUSTAKA');
  });

  it('harus menghasilkan prompt simulasi dosen sesuai persona galak', () => {
    const prompt = PROMPT_TEMPLATES.SIMULATION_CHARACTER('galak', 'Metode Penelitian', 'Saya menggunakan 10 sampel');
    
    expect(prompt).toContain('Prof. Galak');
    expect(prompt).toContain('kritis');
  });
});
```

---

## 2. Integration Testing (Supertest + Vitest)

Integration testing memverifikasi interaksi antar modul internal, yaitu rute API Express, middleware autentikasi JWT, serta controller.

### A. Cakupan Pengujian
- **Authentication Flow**: Register -> Login -> Mendapatkan JWT Token -> Mengakses Protected Route.
- **API Endpoints**: Pengujian return status HTTP (`200`, `201`, `400`, `401`, `403`, `500`).
- **Middleware Validation**: Memastikan endpoint bertanda `(protected)` menolak request tanpa header `Authorization: Bearer <token>`.

### B. Contoh Kode Integration Test (`src/routes/authAndProposal.test.ts`)
```typescript
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import express from 'express';
import authRoutes from './authRoutes';
import proposalRoutes from './proposalRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/proposal', proposalRoutes);

describe('Integration Test: Auth & Proposal Flow', () => {
  let authToken = '';

  it('POST /api/auth/register - harus berhasil mendaftarkan user baru', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mahasiswa Test',
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('GET /api/proposal/sessions - harus menolak request tanpa token JWT', async () => {
    const res = await request(app).get('/api/proposal/data/proj_123');
    expect(res.status).toBe(401);
  });

  it('GET /api/proposal/data/:project_id - harus diizinkan dengan token valid', async () => {
    const res = await request(app)
      .get('/api/proposal/data/proj_123')
      .set('Authorization', `Bearer ${authToken}`);

    // Diharapkan merespons 200 atau 404 jika project belum ada, bukan 401 Unauthorized
    expect(res.status).not.toBe(401);
  });
});
```

---

## 3. End-to-End (E2E) Testing (Playwright)

E2E testing Mensimulasikan alur pengguna nyata (*real user journey*) di dalam browser headless.

### A. Skenario Utama E2E
1. **User Onboarding**: Registrasi akun -> Masuk ke Dashboard.
2. **Proposal Generation**: Mengisi wizard proposal -> Menekan tombol Generate -> Memastikan halaman hasil memuat draf proposal.
3. **Simulasi Sidang**: Memilih karakter dosen -> Mengirim jawaban -> Menerima tanggapan dosen AI.
4. **Pembayaran Pro**: Navigasi ke Halaman Langganan -> Memilih paket Pro -> Redirect checkout.

### B. Contoh Script Playwright (`e2e/proposal-wizard.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E: Proposal Wizard Flow', () => {
  test('User dapat mengisi wizard dan menghasilkan draf proposal', async ({ page }) => {
    // 1. Buka halaman utama
    await page.goto('http://localhost:3000');

    // 2. Navigasi ke Wizard Proposal
    await page.click('text=Buat Proposal');
    await expect(page).toHaveURL(/.*wizard/);

    // 3. Isi Form Langkah 1: Topik & Judul
    await page.fill('input[name="judul"]', 'Analisis Dampak AI terhadap Mahasiswa');
    await page.fill('textarea[name="latarBelakang"]', 'Perkembangan AI sangat pesat di perguruan tinggi.');
    await page.click('button:has-text("Lanjut")');

    // 4. Isi Form Langkah 2: Metode
    await page.selectOption('select[name="metode"]', 'Kuantitatif');
    await page.click('button:has-text("Generate Proposal")');

    // 5. Verifikasi Halaman Loading & Hasil Generasi
    await expect(page.locator('text=Proposal Berhasil Dibuat')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.markdown-body')).toContainText('BAB I PENDAHULUAN');
  });
});
```

---

## 4. User Acceptance Testing (UAT)

UAT difokuskan pada pengujian kriteria penerimaan pengguna (*acceptance criteria*) berdasarkan spesifikasi fitur.

### Tabel Matriks Skenario UAT

| ID Fitur | Skenario Pengujian | Langkah Pengujian | Ekspektasi Hasil | Status |
| :--- | :--- | :--- | :--- | :--- |
| **UAT-01** | Generate Proposal (1-Click) | Isi judul, latar belakang, & metode -> Klik Generate | Menghasilkan Cover, Abstrak, Bab 1-3, & Daftar Pustaka format PUEBI. | ✅ Pass |
| **UAT-02** | AI Rewrite & Parafrase | Input teks -> Pilih gaya 'Formal Akademik' / Level 'Tinggi' | Teks diperbaiki tanpa mengubah arti asli & lulus cek struktur. | ✅ Pass |
| **UAT-03** | Brainstorming Judul | Input bidang studi & kata kunci -> Klik Sumbang Ide | Menampilkan 10 ide judul beserta skor relevansi & alasan. | ✅ Pass |
| **UAT-04** | Simulasi Sidang Dosen | Pilih karakter 'Prof. Galak' -> Jawab pertanyaan | Dosen AI merespons dengan pertanyaan kritis sesuai konteks. | ✅ Pass |
| **UAT-05** | Interpretasi Output SPSS | Unggah/input data hasil regresi SPSS -> Klik Analisis | Menghasilkan penjelasan naratif Bab 4 (Validitas, Regresi, Hipotesis).| ✅ Pass |
| **UAT-06** | Subscription Payment | Pilih Paket Pro -> Klik Subscribe | Menghasilkan link pembayaran & mengubah status langganan saat webhook sukses. | ✅ Pass |

---

## 5. Security Testing (Pengujian Keamanan)

Pengujian keamanan dilakukan untuk memastikan aplikasi tahan terhadap kerentanan umum OWASP Top 10.

### A. SQL Injection (SQLi)
- **Mitigasi**: Selalu gunakan *parameterized queries* / *prepared statements* via ORM (seperti Drizzle/Prisma/Knex) atau sintaks `$1, $2` pada driver postgres.
- **Pengujian**: Kirimkan muatan SQLi pada input formulir: `' OR '1'='1` atau `; DROP TABLE users; --`. Pastikan divalidasi sebagai string biasa atau ditolak oleh parser.

### B. Cross-Site Scripting (XSS)
- **Mitigasi**:
  - Sanitasi semua konten Markdown / HTML liar sebelum dirender menggunakan library `DOMPurify` / `sanitize-html`.
  - Atur HTTP Header `Content-Security-Policy (CSP)`.
- **Pengujian**: Masukkan input `<script>alert('XSS')</script>` atau `<img src=x onerror=alert(1)>` pada judul proyek/chat AI. Pastikan script tidak dieksekusi oleh browser.

### C. Cross-Site Request Forgery (CSRF)
- **Mitigasi**:
  - Gunakan mekanisme autentikasi Stateless JWT pada Header `Authorization: Bearer <token>`.
  - Jika menggunakan Cookie, tetapkan atribut `SameSite=Strict` dan `HttpOnly; Secure`.

### D. JWT Vulnerability (Token Security)
- **Mitigasi**:
  - Hindari penggunaan algoritma `none` (`alg: "none"`).
  - Gunakan secret key acak yang kuat (minimal 256-bit).
  - Tetapkan durasi kadaluarsa (*expiration time*) yang rasional (misalnya `24h` untuk Access Token).
- **Pengujian**:
  1. Coba ubah payload JWT tanpa memperbarui signature -> Harus ditolak (`401 Unauthorized`).
  2. Coba kirim token yang sudah expired -> Harus ditolak (`401 Token Expired`).

### E. Rate Limiting & Denial of Service Protection
- Gunakan `express-rate-limit` pada endpoint sensitif (seperti `/api/auth/login` dan `/api/proposal/generate`) untuk membatasi maksimal 5-10 request per menit per IP guna mencegah brute force & serangan biaya AI API spam.
