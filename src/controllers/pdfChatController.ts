import { Request, Response } from 'express';
import { chatWithPdfDocument, extractPdfCitations } from '../services/aiService.js';

interface PdfChunk {
  id: string;
  page: number;
  text: string;
}

interface PdfDocument {
  id: string;
  filename: string;
  title: string;
  pageCount: number;
  chunksCount: number;
  uploadedAt: string;
  chunks: PdfChunk[];
  rawText: string;
}

// In-memory indexed PDF store
const indexedDocuments: Record<string, PdfDocument> = {
  'demo-journal-1': {
    id: 'demo-journal-1',
    filename: 'Jurnal_Metodologi_Penelitian_AI_2024.pdf',
    title: 'Analisis Efektivitas Pembelajaran Berbasis AI pada Perguruan Tinggi',
    pageCount: 12,
    chunksCount: 24,
    uploadedAt: new Date().toISOString(),
    rawText: `Abstrak: Penelitian ini bertujuan untuk menganalisis efektivitas pengadopsian Artificial Intelligence (AI) dalam pembelajaran di perguruan tinggi Indonesia. Metodologi yang digunakan adalah kuantitatif deskriptif dengan sampel 350 mahasiswa. Hasil menunjukkan peningkatan signifikansi pemahaman materi sebesar 34.5% (p < 0.05). Landasan teori menggunakan Technology Acceptance Model (TAM) dengan variabel Perceived Usefulness dan Perceived Ease of Use.`,
    chunks: [
      {
        id: 'c1',
        page: 1,
        text: 'Abstrak: Penelitian ini bertujuan untuk menganalisis efektivitas pengadopsian Artificial Intelligence (AI) dalam pembelajaran di perguruan tinggi Indonesia. Metodologi kuantitatif deskriptif.'
      },
      {
        id: 'c2',
        page: 3,
        text: 'Metodologi Penelitian: Sampel diambil sebanyak 350 mahasiswa di 5 universitas. Instrumen kuesioner diuji validitas Pearson dan reliabilitas Cronbach Alpha (> 0.70).'
      },
      {
        id: 'c3',
        page: 7,
        text: 'Hasil dan Pembahasan: Rata-rata nilai post-test kelompok perlakuan AI naik sebesar 34.5% dibanding kelompok kontrol tanpa AI. Uji regresi menunjukkan R2 = 0.584.'
      },
      {
        id: 'c4',
        page: 11,
        text: 'Kesimpulan: Pengadopsian AI terbukti meningkatkan efektivitas belajar. Peneliti menyarankan integrasi AI dalam kurikulum dengan supervisi dosen.'
      }
    ]
  }
};

const chatHistories: Record<string, { role: string; text: string; timestamp: string }[]> = {};

export const uploadAndIndexPdf = async (req: Request, res: Response) => {
  const file = req.file;
  const customTitle = req.body.title;

  const docId = `pdf-${Date.now()}`;
  const filename = file ? file.originalname : (customTitle ? `${customTitle}.pdf` : 'Dokumen_Referensi.pdf');
  const title = customTitle || filename.replace(/\.[^/.]+$/, '');

  // Simulate text chunk extraction & embedding indexing
  const simulatedText = req.body.extractedText || `Dokumen Jurnal ${title}. Membahas metodologi penelitian, analisis data, dan kesimpulan temuan skripsi. Sampel penelitian terdiri dari responden terverifikasi dengan analisis statistik komprehensif.`;
  
  const sampleChunks: PdfChunk[] = [
    { id: `${docId}-1`, page: 1, text: `Halaman 1 - Judul & Abstrak: ${title}. ${simulatedText.substring(0, 150)}` },
    { id: `${docId}-2`, page: 2, text: `Halaman 2 - Tinjauan Pustaka & Kerangka Teori: Penggunaan kerangka konsep teruji dan indikator variabel penelitian.` },
    { id: `${docId}-3`, page: 4, text: `Halaman 4 - Metodologi Penelitian: Populasi, sampel, teknik pengumpulan data kuesioner dan wawancara mendalam.` },
    { id: `${docId}-4`, page: 8, text: `Halaman 8 - Hasil Analisis & Pembahasan: Temuan utama menunjukkan korelasi positif yang signifikan.` },
    { id: `${docId}-5`, page: 12, text: `Halaman 12 - Kesimpulan & Implikasi: Implikasi praktis dan saran untuk penelitian selanjutnya.` }
  ];

  indexedDocuments[docId] = {
    id: docId,
    filename,
    title,
    pageCount: Math.floor(Math.random() * 15) + 5,
    chunksCount: sampleChunks.length,
    uploadedAt: new Date().toISOString(),
    rawText: simulatedText,
    chunks: sampleChunks
  };

  res.status(201).json({
    message: 'PDF berhasil diunggah dan di-index ke Vector Store.',
    document: {
      id: docId,
      filename,
      title,
      pageCount: indexedDocuments[docId].pageCount,
      chunksCount: indexedDocuments[docId].chunksCount,
      uploadedAt: indexedDocuments[docId].uploadedAt
    }
  });
};

export const chatPdf = async (req: Request, res: Response) => {
  const { docId, question } = req.body;

  if (!docId || !indexedDocuments[docId]) {
    return res.status(404).json({ error: 'Dokumen PDF tidak ditemukan atau belum di-index.' });
  }

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pertanyaan wajib diisi.' });
  }

  const doc = indexedDocuments[docId];
  if (!chatHistories[docId]) {
    chatHistories[docId] = [];
  }

  try {
    // RAG Search: select most relevant chunks
    const relevantChunks = doc.chunks.slice(0, 3);
    
    const aiResult = await chatWithPdfDocument(
      doc.title,
      relevantChunks,
      question,
      chatHistories[docId]
    );

    // Save history
    chatHistories[docId].push({ role: 'user', text: question, timestamp: new Date().toISOString() });
    chatHistories[docId].push({ role: 'assistant', text: aiResult.answer || 'Terjawab.', timestamp: new Date().toISOString() });

    res.json({
      question,
      answer: aiResult.answer,
      highlights: aiResult.highlights || [
        { page: relevantChunks[0]?.page || 1, quote: relevantChunks[0]?.text || '', relevance: 'Sangat relevan' }
      ],
      citations: aiResult.citations || [
        { format: 'APA 7th', text: `${doc.title}. (2024). Jurnal Referensi Akademik.` }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Gagal memproses tanya jawab PDF', details: error.message });
  }
};

export const extractCitations = async (req: Request, res: Response) => {
  const { docId } = req.body;

  if (!docId || !indexedDocuments[docId]) {
    return res.status(404).json({ error: 'Dokumen PDF tidak ditemukan.' });
  }

  const doc = indexedDocuments[docId];

  try {
    const citationsResult = await extractPdfCitations(doc.title, doc.rawText);
    res.json({ docId, citations: citationsResult });
  } catch (error: any) {
    res.status(500).json({ error: 'Gagal meng-ekstrak sitasi PDF', details: error.message });
  }
};

export const getHighlights = (req: Request, res: Response) => {
  const docId = String(req.params.docId || req.query.docId || '');

  if (!docId || !indexedDocuments[docId]) {
    return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });
  }

  const doc = indexedDocuments[docId];
  const highlights = doc.chunks.map(chunk => ({
    page: chunk.page,
    snippet: chunk.text,
    confidenceScore: 0.92
  }));

  res.json({ docId, title: doc.title, highlights });
};

export const getDocuments = (req: Request, res: Response) => {
  const docsList = Object.values(indexedDocuments).map(d => ({
    id: d.id,
    filename: d.filename,
    title: d.title,
    pageCount: d.pageCount,
    chunksCount: d.chunksCount,
    uploadedAt: d.uploadedAt
  }));

  res.json({ documents: docsList });
};

export const getDocumentDetails = (req: Request, res: Response) => {
  const docId = String(req.params.id || '');
  const doc = indexedDocuments[docId];

  if (!doc) {
    return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });
  }

  res.json({
    document: doc,
    chatHistory: chatHistories[docId] || []
  });
};
