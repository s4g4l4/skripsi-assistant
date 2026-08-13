const fs = require('fs');
let code = fs.readFileSync('src/pages/AIToolsHubPage.tsx', 'utf8');

const target = `  const handleRunTool = () => {
    if (!inputVal.trim() && !activeTool?.id.includes('kalkulator')) {
      setInputVal('Analisis Dampak Kecerdasan Buatan terhadap Pendidikan Tinggi');
    }
    
    setIsProcessing(true);
    setAiResult(null);

    setTimeout(() => {
      let mockRes = '';
      const toolId = activeTool?.id || '';
      const topic = inputVal || 'Analisis Dampak Artificial Intelligence pada Pendidikan Tinggi';

      if (toolId === 'kerangka-berpikir') {
        mockRes = \`DIAGRAM KERANGKA BERPIKIR (RESEARCH CONCEPTUAL FRAMEWORK)\\n\\n\` +
          \`[ VARIABEL INDEPENDEN (X) ]\\n\` +
          \`  ├── X1: Persepsi Kemudahan Penggunaan AI\\n\` +
          \`  └── X2: Dukungan Infrastruktur Kampus\\n\` +
          \`           │\\n\` +
          \`           ▼  (Dianalisis melalui Uji SEM-PLS)\\n\` +
          \`[ VARIABEL MEDIASI (M) ]\\n\` +
          \`  └── M: Motivasi Belajar Mandiri Mahasiswa\\n\` +
          \`           │\\n\` +
          \`           ▼\\n\` +
          \`[ VARIABEL DEPENDEN (Y) ]\\n\` +
          \`  └── Y: Efektivitas Penyusunan Karya Tulis Ilmiah\\n\\n\` +
          \`*Diagram di atas menggambarkan alur hubungan antar variabel sesuai hipotesis H1 s.d. H4.\`;
      } else if (toolId.includes('judul')) {
        mockRes = \`3 REKOMENDASI JUDUL SKRIPSI RELEVAN:\\n\\n\` +
          \`1. Analisis Pengaruh \${topic} terhadap Peningkatan Efisiensi Akademis Mahasiswa S1\\n\` +
          \`2. Implementasi Model SEM-PLS dalam Mengukur Adopsi \${topic} pada PTN & PTS di Indonesia\\n\` +
          \`3. Evaluasi Kritis dan Strategi Mitigasi Risiko Implementasi \${topic} di Sektor Pendidikan\`;
      } else if (toolId === 'kalkulator-sampel') {
        mockRes = \`HASIL PERHITUNGAN KEBUTUHAN SAMPEL PENELITIAN (RUMUS SLOVIN):\\n\\n\` +
          \`• Populasi Total (N): \${inputVal || '1000'} Responden\\n\` +
          \`• Tingkat Toleransi Error (e): 5% (0.05)\\n\` +
          \`• Formula: n = N / (1 + N(e)²)\\n\` +
          \`• Jumlah Sampel Minimal (n): 286 Responden\\n\\n\` +
          \`Saran Akademis: Tambahkan margin aman 10% (315 sampel) untuk mengantisipasi kuesioner yang gugur/tidak lengkap.\`;
      } else if (toolId === 'ai-to-human') {
        mockRes = \`HASIL OPTIMASI TEKS AI TO HUMAN (NATURAL ACADEMIC VOICE):\\n\\n\` +
          \`"Penelitian ini secara mendalam mengkaji bagaimana integrasi teknologi kecerdasan buatan mampu mentransformasi pola interaksi akademis mahasiswa. Berdasarkan hasil pengamatan di lapangan, fleksibilitas akses informasi menjadi faktor paling dominan yang mendorong percepatan penyelesaian tugas akhir."\`;
      } else {
        mockRes = \`HASIL GENERATOR AI UNTUK "\${activeTool?.name.toUpperCase()}":\\n\\n\` +
          \`Berdasarkan masukan "\${topic}", sistem AI Dukun Skripsi telah merumuskan draf akademis terstruktur:\\n\\n\` +
          \`1. Konteks Akademis: \${topic} memiliki urgensi tinggi untuk diteliti dalam konteks dinamika saat ini.\\n\` +
          \`2. Implikasi & Kebaruan: Mengisi kesenjangan riset terdahulu dengan menyajikan bukti empiris terbaru.\\n\` +
          \`3. Rekomendasi Lanjutan: Draf siap diterapkan ke dalam bab naskah utama atau disesuaikan dengan template perguruan tinggi Anda.\`;
      }

      setAiResult(mockRes);
      setIsProcessing(false);
    }, 1200);
  };`;

const replacement = `  const handleRunTool = async () => {
    let currentInput = inputVal;
    if (!currentInput.trim() && !activeTool?.id.includes('kalkulator')) {
      currentInput = 'Analisis Dampak Kecerdasan Buatan terhadap Pendidikan Tinggi';
      setInputVal(currentInput);
    }
    
    setIsProcessing(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai-tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: activeTool?.name,
          toolCategory: activeTool?.category,
          toolDescription: activeTool?.description,
          inputVal: currentInput
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setAiResult(data.result);
      } else {
        setAiResult(\`Error: \${data.error || 'Gagal menghasilkan teks.'}\`);
      }
    } catch (err: any) {
      console.error(err);
      setAiResult(\`Error: Terjadi kesalahan koneksi server. (\${err.message})\`);
    } finally {
      setIsProcessing(false);
    }
  };`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/pages/AIToolsHubPage.tsx', code);
  console.log('Successfully replaced handleRunTool');
} else {
  console.log('Target string not found in AIToolsHubPage.tsx');
}
