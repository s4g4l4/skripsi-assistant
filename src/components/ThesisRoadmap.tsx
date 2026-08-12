import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Sparkles, Plus, Trash2, Calendar, FileText, Search, 
  Bot, Send, ExternalLink, Clock, BookOpen, Edit3, Award, GraduationCap, 
  ChevronDown, ChevronUp, RefreshCw, MessageSquare, Check, X, HelpCircle,
  FileCheck, Link2, Share2, Layers, AlertCircle, ArrowRight, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IndonesianPageStandards from './IndonesianPageStandards';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface StepInput {
  key: string;
  label: string;
  placeholder: string;
  value: string;
}

export interface ThesisStep {
  id: number;
  title: string;
  shortDesc: string;
  checklist: ChecklistItem[];
  inputs: StepInput[];
  aiButtons: {
    id: string;
    label: string;
    type: 'ai_advice' | 'search_journals' | 'agent_ai' | 'create_survey' | 'ask_ai' | 'schedule' | 'paraphrase' | 'tips';
    iconName?: string;
  }[];
  hasAccStatus?: boolean;
  accStatus?: 'Masih revisi' | 'Sudah di-ACC';
  finalFileLink?: string;
  completed: boolean;
}

const DEFAULT_STEPS: ThesisStep[] = [
  {
    id: 1,
    title: "1. Diskusi Awal dengan Dosen",
    shortDesc: "Diskusi awal dengan dosen, minta saran AI, buat checklist & catat ekspektasi & preferensi dosen.",
    checklist: [
      { id: "c1_1", label: "Buat janji temu dengan dosen pembimbing", completed: false },
      { id: "c1_2", label: "Siapkan daftar pertanyaan untuk dosen", completed: false },
      { id: "c1_3", label: "Catat ekspektasi & preferensi dosen", completed: false },
      { id: "c1_4", label: "Tanyakan ketersediaan jadwal bimbingan", completed: false },
    ],
    inputs: [
      { key: "ekspektasi", label: "Ekspektasi & arahan dari dosen", placeholder: "Contoh: Dosen ingin penelitian kuantitatif minimal 100 responden, variabel terukur presisi.", value: "" },
      { key: "preferensi", label: "Preferensi / batasan topik bidang yang disarankan atau dihindari dosen", placeholder: "Contoh: Disarankan fokus pada topik UX e-commerce, hindari bidang keamanan jaringan.", value: "" }
    ],
    aiButtons: [
      { id: "b1_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b1_2", label: "Tanya AI Dosen", type: "ask_ai" }
    ],
    completed: false
  },
  {
    id: 2,
    title: "2. Penentuan Topik Penelitian",
    shortDesc: "Tentukan topik dari dosen atau cari sendiri. Bisa melanjutkan proyek/arahan dosen atau mencari berdasarkan minat & research gap.",
    checklist: [
      { id: "c2_1", label: "Kumpulkan 3-5 alternatif topik", completed: false },
      { id: "c2_2", label: "Cek ketersediaan referensi & data tiap topik", completed: false },
      { id: "c2_3", label: "Diskusikan pilihan topik dengan dosen", completed: false },
      { id: "c2_4", label: "Tetapkan satu topik final", completed: false },
    ],
    inputs: [
      { key: "topik_kasar", label: "Topik / judul kasar yang dipilih", placeholder: "Misal: Analisis Performa Model AI dalam Deteksi Plagiarisme Skripsi", value: "" },
      { key: "alasan_gap", label: "Alasan & Research Gap", placeholder: "Belum banyak riset yang membandingkan efisiensi model lokal vs cloud...", value: "" }
    ],
    aiButtons: [
      { id: "b2_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b2_2", label: "Cari Jurnal", type: "search_journals" },
      { id: "b2_3", label: "Agent AI Skripsi", type: "agent_ai" }
    ],
    hasAccStatus: true,
    accStatus: "Masih revisi",
    finalFileLink: "",
    completed: false
  },
  {
    id: 3,
    title: "3. Menyusun Latar Belakang",
    shortDesc: "Susun latar belakang masalah: mulai dari fenomena umum, persempit ke masalah spesifik, tunjukkan research gap, rumuskan masalah & tujuan penelitian.",
    checklist: [
      { id: "c3_1", label: "Kumpulkan data & fakta pendukung fenomena", completed: false },
      { id: "c3_2", label: "Identifikasi research gap dari jurnal", completed: false },
      { id: "c3_3", label: "Rumuskan masalah penelitian", completed: false },
      { id: "c3_4", label: "Tetapkan tujuan & manfaat penelitian", completed: false },
    ],
    inputs: [
      { key: "fenomena", label: "Fenomena / masalah utama", placeholder: "Jelaskan singkat masalah aktual yang melatarbelakangi penelitian Anda", value: "" },
      { key: "rumusan", label: "Rumusan masalah", placeholder: "Pertanyaan penelitian spesifik yang ingin dijawab dalam skripsi", value: "" }
    ],
    aiButtons: [
      { id: "b3_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b3_2", label: "Agent AI Skripsi", type: "agent_ai" },
      { id: "b3_3", label: "Cari Jurnal", type: "search_journals" }
    ],
    hasAccStatus: true,
    accStatus: "Masih revisi",
    finalFileLink: "",
    completed: false
  },
  {
    id: 4,
    title: "4. Pengambilan Data",
    shortDesc: "Laksanakan pengumpulan data: sebar kuesioner, wawancara, observasi, atau eksperimen. Pantau jumlah & kualitas data yang masuk.",
    checklist: [
      { id: "c4_1", label: "Sebar instrumen / mulai pengumpulan data", completed: false },
      { id: "c4_2", label: "Pantau jumlah data yang terkumpul", completed: false },
      { id: "c4_3", label: "Cek kualitas & kelengkapan data", completed: false },
      { id: "c4_4", label: "Rapikan & simpan data mentah", completed: false },
    ],
    inputs: [
      { key: "status_data", label: "Status pengumpulan data", placeholder: "Mis. 80 dari 100 responden terkumpul / 5 dari 5 narasumber diwawancarai", value: "" }
    ],
    aiButtons: [
      { id: "b4_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b4_2", label: "Buat Survei", type: "create_survey" },
      { id: "b4_3", label: "Tanya AI", type: "ask_ai" }
    ],
    completed: false
  },
  {
    id: 5,
    title: "5. Olah dan Analisis Data",
    shortDesc: "Olah data sesuai teknik analisis (statistik/tematik). Tampilkan hasil dalam tabel/grafik, uji hipotesis bila ada, dan interpretasikan temuan.",
    checklist: [
      { id: "c5_1", label: "Bersihkan & input data", completed: false },
      { id: "c5_2", label: "Jalankan analisis sesuai metode", completed: false },
      { id: "c5_3", label: "Buat tabel & visualisasi hasil", completed: false },
      { id: "c5_4", label: "Interpretasikan temuan", completed: false },
    ],
    inputs: [
      { key: "ringkasan_temuan", label: "Ringkasan temuan utama", placeholder: "Apa hasil/temuan penting dari analisis statistik atau kualitatif Anda?", value: "" }
    ],
    aiButtons: [
      { id: "b5_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b5_2", label: "Tanya AI (Olah Data)", type: "ask_ai" }
    ],
    completed: false
  },
  {
    id: 6,
    title: "6. Tulis BAB 4 (Hasil & Pembahasan)",
    shortDesc: "Sajikan hasil penelitian secara sistematis lalu bahas maknanya. Kaitkan temuan dengan rumusan masalah, teori, dan penelitian terdahulu.",
    checklist: [
      { id: "c6_1", label: "Sajikan hasil penelitian", completed: false },
      { id: "c6_2", label: "Bahas & interpretasi temuan", completed: false },
      { id: "c6_3", label: "Kaitkan dengan teori & studi terdahulu", completed: false },
      { id: "c6_4", label: "Konsultasikan BAB 4 ke dosen", completed: false },
    ],
    inputs: [
      { key: "status_bab4", label: "Status penulisan BAB 4", placeholder: "Mis. Hasil analisis selesai, pembahasan masih dalam bentuk draf awal", value: "" }
    ],
    aiButtons: [
      { id: "b6_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b6_2", label: "Agent AI Skripsi", type: "agent_ai" }
    ],
    hasAccStatus: true,
    accStatus: "Masih revisi",
    finalFileLink: "",
    completed: false
  },
  {
    id: 7,
    title: "7. Tulis BAB 5 (Kesimpulan & Saran)",
    shortDesc: "Tarik kesimpulan yang menjawab rumusan masalah secara ringkas, sebutkan keterbatasan penelitian, dan berikan saran praktis & penelitian selanjutnya.",
    checklist: [
      { id: "c7_1", label: "Tulis kesimpulan (jawab rumusan masalah)", completed: false },
      { id: "c7_2", label: "Sebutkan keterbatasan penelitian", completed: false },
      { id: "c7_3", label: "Rumuskan saran praktis & akademik", completed: false },
      { id: "c7_4", label: "Lengkapi abstrak & daftar pustaka", completed: false },
    ],
    inputs: [
      { key: "poin_kesimpulan", label: "Poin kesimpulan utama", placeholder: "Ringkas poin-poin utama jawaban atas pertanyaan rumusan masalah Anda", value: "" }
    ],
    aiButtons: [
      { id: "b7_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b7_2", label: "Agent AI Skripsi", type: "agent_ai" }
    ],
    hasAccStatus: true,
    accStatus: "Masih revisi",
    finalFileLink: "",
    completed: false
  },
  {
    id: 8,
    title: "8. Seminar Hasil (Semhas)",
    shortDesc: "Presentasikan keseluruhan hasil penelitian di seminar hasil. Siapkan slide, latihan, dan catat masukan penguji untuk revisi.",
    checklist: [
      { id: "c8_1", label: "Buat slide seminar hasil", completed: false },
      { id: "c8_2", label: "Latihan presentasi & kelola waktu", completed: false },
      { id: "c8_3", label: "Daftar & jadwalkan seminar hasil", completed: false },
      { id: "c8_4", label: "Catat masukan penguji", completed: false },
    ],
    inputs: [
      { key: "masukan_semhas", label: "Masukan dari seminar hasil", placeholder: "Catat poin-poin revisi dari dosen penguji seminar hasil", value: "" }
    ],
    aiButtons: [
      { id: "b8_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b8_2", label: "Atur Jadwal + Reminder", type: "schedule" },
      { id: "b8_3", label: "Tanya AI", type: "ask_ai" },
      { id: "b8_4", label: "Tips & Trik Persiapan", type: "tips" }
    ],
    completed: false
  },
  {
    id: 9,
    title: "9. Revisi Seminar Hasil",
    shortDesc: "Tindak lanjuti semua masukan seminar hasil. Perbaiki naskah bab demi bab, perkuat argumen, rapikan tabel & sitasi, lalu mintakan ACC dosen.",
    checklist: [
      { id: "c9_1", label: "Daftar semua poin revisi", completed: false },
      { id: "c9_2", label: "Perbaiki naskah sesuai masukan", completed: false },
      { id: "c9_3", label: "Mintakan ACC dosen untuk maju sidang", completed: false },
    ],
    inputs: [
      { key: "revisi_status", label: "Daftar revisi & statusnya", placeholder: "Poin 1: Tambah sampel (Selesai), Poin 2: Perbaiki Bab 4 (Selesai)", value: "" }
    ],
    aiButtons: [
      { id: "b9_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b9_2", label: "Parafrase AI", type: "paraphrase" },
      { id: "b9_3", label: "Tanya AI", type: "ask_ai" }
    ],
    completed: false
  },
  {
    id: 10,
    title: "10. Sidang Skripsi",
    shortDesc: "Hadapi sidang skripsi. Kuasai seluruh isi naskah, siapkan slide & jawaban atas potensi pertanyaan, kelola waktu presentasi, dan jaga ketenangan.",
    checklist: [
      { id: "c10_1", label: "Daftar & jadwalkan sidang", completed: false },
      { id: "c10_2", label: "Siapkan slide & berkas sidang", completed: false },
      { id: "c10_3", label: "Latihan presentasi & tanya-jawab", completed: false },
      { id: "c10_4", label: "Siapkan mental & logistik hari-H", completed: false },
    ],
    inputs: [
      { key: "catatan_sidang", label: "Hasil & catatan sidang", placeholder: "Lulus dengan revisi minor? Catatan utama penguji sidang?", value: "" }
    ],
    aiButtons: [
      { id: "b10_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b10_2", label: "Atur Jadwal + Reminder", type: "schedule" },
      { id: "b10_3", label: "Tanya AI", type: "ask_ai" },
      { id: "b10_4", label: "Tips & Trik Persiapan", type: "tips" }
    ],
    completed: false
  },
  {
    id: 11,
    title: "11. Revisi Sidang & Cek Plagiasi",
    shortDesc: "Selesaikan revisi pasca-sidang sesuai catatan penguji, lalu pastikan naskah lolos batas kemiripan (Turnitin). Lengkapi lembar pengesahan.",
    checklist: [
      { id: "c11_1", label: "Selesaikan semua revisi sidang", completed: false },
      { id: "c11_2", label: "Cek tingkat plagiasi (di bawah batas kampus)", completed: false },
      { id: "c11_3", label: "Lengkapi lembar pengesahan & tanda tangan", completed: false },
    ],
    inputs: [
      { key: "skor_plagiasi", label: "Skor kemiripan & status revisi", placeholder: "Mis. Similarity Turnitin 11%, seluruh tanda tangan penguji lengkap", value: "" }
    ],
    aiButtons: [
      { id: "b11_1", label: "Minta Saran AI", type: "ai_advice" },
      { id: "b11_2", label: "Parafrase AI", type: "paraphrase" }
    ],
    completed: false
  },
  {
    id: 12,
    title: "12. Selesai: Publikasi & Wisuda 🎉",
    shortDesc: "Tahap akhir! Submit skripsi & artikel ke perpustakaan/repositori kampus, urus administrasi kelulusan, dan persiapkan wisuda. Selamat!",
    checklist: [
      { id: "c12_1", label: "Submit naskah final ke perpustakaan/repositori", completed: false },
      { id: "c12_2", label: "Urus administrasi kelulusan & yudisium", completed: false },
      { id: "c12_3", label: "Daftar wisuda", completed: false },
    ],
    inputs: [],
    aiButtons: [
      { id: "b12_1", label: "Minta Saran AI", type: "ai_advice" }
    ],
    completed: false
  }
];

export default function ThesisRoadmap() {
  const [steps, setSteps] = useState<ThesisStep[]>(() => {
    const saved = localStorage.getItem('dukun_skripsi_steps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STEPS;
      }
    }
    return DEFAULT_STEPS;
  });

  const [expandedStepId, setExpandedStepId] = useState<number | null>(1);
  const [activeAiModal, setActiveAiModal] = useState<{
    step: ThesisStep;
    btnType: string;
    btnLabel: string;
  } | null>(null);

  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [userCustomQuestion, setUserCustomQuestion] = useState<string>('');

  // Add custom step state
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newStepChecklist, setNewStepChecklist] = useState('');
  const [newStepInputLabel, setNewStepInputLabel] = useState('');

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState('');

  // Page standards modal state
  const [showStandardsModal, setShowStandardsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('dukun_skripsi_steps', JSON.stringify(steps));
  }, [steps]);

  const toggleChecklist = (stepId: number, checkId: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const updatedChecklist = s.checklist.map(c => 
          c.id === checkId ? { ...c, completed: !c.completed } : c
        );
        const allCompleted = updatedChecklist.length > 0 && updatedChecklist.every(c => c.completed);
        return {
          ...s,
          checklist: updatedChecklist,
          completed: allCompleted ? true : s.completed
        };
      }
      return s;
    }));
  };

  const toggleStepCompleted = (stepId: number) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const nextState = !s.completed;
        return {
          ...s,
          completed: nextState,
          checklist: s.checklist.map(c => ({ ...c, completed: nextState }))
        };
      }
      return s;
    }));
  };

  const handleInputChange = (stepId: number, inputKey: string, newValue: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          inputs: s.inputs.map(inp => inp.key === inputKey ? { ...inp, value: newValue } : inp)
        };
      }
      return s;
    }));
  };

  const handleAccStatusChange = (stepId: number, status: 'Masih revisi' | 'Sudah di-ACC') => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        return { ...s, accStatus: status };
      }
      return s;
    }));
  };

  const handleFileLinkChange = (stepId: number, linkValue: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        return { ...s, finalFileLink: linkValue };
      }
      return s;
    }));
  };

  const handleAddNewStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;

    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    const items = newStepChecklist
      .split('\n')
      .map(x => x.trim())
      .filter(x => x.length > 0)
      .map((label, idx) => ({
        id: `c_custom_${newId}_${idx}`,
        label,
        completed: false
      }));

    const inputs: StepInput[] = newStepInputLabel.trim() ? [
      {
        key: `input_custom_${newId}`,
        label: newStepInputLabel.trim(),
        placeholder: "Tuliskan catatan atau hasil tahap ini...",
        value: ""
      }
    ] : [];

    const newStepObj: ThesisStep = {
      id: newId,
      title: `${newId}. ${newStepTitle}`,
      shortDesc: newStepDesc || "Langkah kustom bimbingan & pengerjaan skripsi Anda.",
      checklist: items.length > 0 ? items : [{ id: `c_custom_${newId}_0`, label: "Selesaikan aktivitas ini", completed: false }],
      inputs,
      aiButtons: [
        { id: `b_custom_${newId}_1`, label: "Minta Saran AI", type: "ai_advice" },
        { id: `b_custom_${newId}_2`, label: "Tanya AI", type: "ask_ai" }
      ],
      completed: false
    };

    setSteps(prev => [...prev, newStepObj]);
    setNewStepTitle('');
    setNewStepDesc('');
    setNewStepChecklist('');
    setNewStepInputLabel('');
    setShowAddStepModal(false);
    setExpandedStepId(newId);
  };

  const handleDeleteStep = (stepId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus langkah ini dari alur skripsi Anda?")) {
      setSteps(prev => prev.filter(s => s.id !== stepId));
    }
  };

  const handleOpenAiModal = (step: ThesisStep, btnType: string, btnLabel: string) => {
    setActiveAiModal({ step, btnType, btnLabel });
    setAiResponse('');
    setUserCustomQuestion('');

    if (btnType === 'schedule') {
      setShowScheduleModal(true);
      return;
    }

    // Trigger AI Advice generation
    generateAiGuidance(step, btnType, btnLabel);
  };

  const generateAiGuidance = async (step: ThesisStep, btnType: string, btnLabel: string, customQ?: string) => {
    setIsAiLoading(true);
    setAiResponse('');

    const contextInputs = step.inputs.map(i => `${i.label}: ${i.value || '(Belum diisi)'}`).join('\n');

    let systemPrompt = `Anda adalah Dukun Skripsi AI, Asisten & Mentor Bimbingan Skripsi S1/S2 yang cerdas, praktis, dan suportif.
Langkah saat ini: "${step.title}"
Deskripsi: ${step.shortDesc}
Isian Mahasiswa saat ini:
${contextInputs}
`   ;

    if (customQ) {
      systemPrompt += `\nMahasiswa bertanya khusus: "${customQ}"`;
    } else if (btnType === 'ai_advice') {
      systemPrompt += `\nBerikan 3-4 rekomendasi taktis, saran konkret, dan poin pembicaraan yang efektif untuk langkah ini agar skripsi cepat di-ACC dosen.`;
    } else if (btnType === 'search_journals') {
      systemPrompt += `\nRekomendasikan 3-5 kata kunci pencarian jurnal SINTA/Scopus yang sangat relevan dengan langkah ini, serta cara mencari research gap secara cepat.`;
    } else if (btnType === 'agent_ai') {
      systemPrompt += `\nBuatkan draf naskah awal yang terstruktur dan akademik untuk membantu penyusunan langkah ini secara komprehensif.`;
    } else if (btnType === 'create_survey') {
      systemPrompt += `\nBuatkan struktur kuesioner / instrumen pengambilan data lengkap (Skala Likert / Pertanyaan Wawancara) yang siap disebar untuk penelitian ini.`;
    } else if (btnType === 'ask_ai') {
      systemPrompt += `\nBerikan penjelasan mendalam dan panduan langkah demi langkah tentang cara menyelesaikan tahapan ini dengan efisien.`;
    } else if (btnType === 'paraphrase') {
      systemPrompt += `\nBerikan contoh teknik parafrase akademik dan cara menurunkan skor plagiasi Turnitin secara efektif tanpa mengubah makna asli.`;
    } else if (btnType === 'tips') {
      systemPrompt += `\nBerikan 5 Tips Rahasia & Trik Mental/Teknis untuk menghadapi presentasi/sidang di hadapan dosen penguji agar lulus nilai A.`;
    }

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text || data.result || "AI siap membantu! Silakan gunakan saran di atas.");
      } else {
        // Fallback simulated response if backend fails
        setAiResponse(getFallbackAiText(step, btnType));
      }
    } catch {
      setAiResponse(getFallbackAiText(step, btnType));
    } finally {
      setIsAiLoading(false);
    }
  };

  const getFallbackAiText = (step: ThesisStep, btnType: string) => {
    switch (btnType) {
      case 'ai_advice':
        return `💡 **Saran Taktis Dukun Skripsi AI untuk ${step.title}:**\n\n1. **Persiapan Mental & Konsep:** Pastikan argumen utama Anda didukung oleh minimal 3 referensi jurnal terindeks SINTA 2 / Scopus.\n2. **Trik Bimbingan:** Kirimkan draf H-2 sebelum bimbingan agar dosen sempat membaca.\n3. **Catatan Penting:** Tuliskan setiap revisi dalam logbook agar tidak ada masukan dosen yang terlewat!`;
      case 'search_journals':
        return `📚 **Rekomendasi Kata Kunci & Pencarian Jurnal:**\n\n- Gunakan Google Scholar / ResearchGate dengan operator: \`"topik utama" AND "metode" AND "2023..2026"\`\n- Cari artikel *Literature Review* atau *Meta-Analysis* untuk menemukan Research Gap tercepat.\n- Simpan file RIS/BibTeX untuk diimpor langsung ke Citation Manager Dukun Skripsi AI!`;
      case 'agent_ai':
        return `🤖 **Agent AI Skripsi - Draf Awal:**\n\nSistem telah menganalisis topik Anda. Anda dapat menyalin draf dasar ini ke Editor Skripsi AI untuk dikembangkan lebih lanjut menjadi naskah utuh.`;
      case 'create_survey':
        return `📋 **Panduan & Struktur Kuesioner:**\n\n1. **Bagian 1:** Demografi Responden (Nama/Inisial, Usia, Jenis Kelamin, Pendidikan).\n2. **Bagian 2:** Variabel X (Skala Likert 1-5: Sangat Tidak Setuju s/d Sangat Setuju).\n3. **Bagian 3:** Variabel Y (Skala Likert 1-5).\n\n*Gunakan Google Forms / Typeform untuk mempermudah ekspor data ke Excel/SPSS.*`;
      case 'tips':
        return `🎯 **5 Tips Lulus Sidang Nilai A:**\n\n1. Kuasai Metodologi & Alasan pemilihan sampel.\n2. Jangan membantah penguji secara emosional, gunakan kalimat: *"Terima kasih Prof/Bapak/Ibu, masukan yang sangat berharga untuk perbaikan naskah saya."*\n3. Fokus pada Bab 4 (Hasil & Pembahasan).\n4. Siapkan Slide Presentasi maksimal 10-12 slide ringkas.\n5. Berdoa & jaga kondisi fisik!`;
      default:
        return `✨ AI siap mendampingi perjalanan skripsi Anda sampai wisuda!`;
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSavedMsg('Jadwal & Pengingat berhasil disimpan di Kalender Bimbingan!');
    setTimeout(() => {
      setScheduleSavedMsg('');
      setShowScheduleModal(false);
    }, 2000);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Progress */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Alur & Roadmap Skripsi Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Panduan 12 Langkah Skripsi Sampai ACC & Wisuda
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Pantau progres bimbingan, catat ekspektasi dosen, kelola checklist tiap bab, simpan draf final, dan manfaatkan kecerdasan AI di setiap tahap.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowStandardsModal(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-emerald-100" />
                <span>Aturan Minimal & Maksimal Halaman RI (Proposal, Semhas, Skripsi, Tesis, Jurnal)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-w-[200px] shrink-0 shadow-inner">
            <span className="text-xs text-slate-400 font-medium">Progres Kelulusan</span>
            <div className="text-3xl font-black text-indigo-400 my-1">{progressPercent}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700 my-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400">{completedCount} dari {steps.length} Langkah Selesai</span>
          </div>
        </div>
      </div>

      {/* Main Steps Accordion List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isExpanded = expandedStepId === step.id;
          const completedChecklists = step.checklist.filter(c => c.completed).length;
          const totalChecklists = step.checklist.length;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-2xl transition-all overflow-hidden ${
                step.completed 
                  ? 'bg-slate-900/60 border-emerald-500/30 shadow-sm' 
                  : isExpanded 
                    ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/30' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Accordion Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none" onClick={() => setExpandedStepId(isExpanded ? null : step.id)}>
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.id);
                    }}
                    className={`mt-0.5 sm:mt-0 p-1 rounded-full transition-colors ${
                      step.completed ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={step.completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className={`font-extrabold text-base sm:text-lg ${step.completed ? 'text-emerald-300 line-through decoration-emerald-500/50' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      {step.completed && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          SELESAI
                        </span>
                      )}
                      {step.hasAccStatus && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          step.accStatus === 'Sudah di-ACC' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {step.accStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span>Checklist:</span>
                    <span className={completedChecklists === totalChecklists ? 'text-emerald-400' : 'text-indigo-400'}>
                      {completedChecklists}/{totalChecklists}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {step.id > 12 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStep(step.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Hapus Langkah Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-800 bg-slate-950/50 p-4 sm:p-6 space-y-6"
                  >
                    
                    {/* 1. AI Action Toolbar */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Bantuan AI Spesifik untuk Tahap Ini
                      </label>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {step.aiButtons.map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleOpenAiModal(step, btn.type, btn.label)}
                            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-200 text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Checklist items */}
                    <div className="space-y-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          CHECKLIST TAHAPAN ({completedChecklists}/{totalChecklists})
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {step.checklist.map((item) => (
                          <label
                            key={item.id}
                            onClick={() => toggleChecklist(step.id, item.id)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              item.completed 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                                : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => {}}
                              className="mt-0.5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                            />
                            <span className={`text-xs font-medium leading-tight ${item.completed ? 'line-through text-emerald-400/80' : ''}`}>
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 3. User Inputs (Isian Kamu) */}
                    {step.inputs.length > 0 && (
                      <div className="space-y-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                        <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-amber-400" />
                          ISIAN KAMU (Ekspektasi, Arahan, & Catatan Mahasiswa)
                        </label>

                        <div className="space-y-3">
                          {step.inputs.map((inp) => (
                            <div key={inp.key} className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-300">{inp.label}</label>
                              <textarea
                                value={inp.value}
                                onChange={(e) => handleInputChange(step.id, inp.key, e.target.value)}
                                placeholder={inp.placeholder}
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Hasil Agent AI & Status ACC Dosen */}
                    {step.hasAccStatus && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-indigo-400" />
                          HASIL AGENT AI — PERLU DI-ACC DOSEN PEMBIMBING
                        </label>
                        <p className="text-xs text-slate-400">
                          Draf dari Agent AI biasanya masih perlu revisi & persetujuan dosen pembimbing sebelum dipakai. Tandai statusnya dan catat file final yang akan digunakan.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                          {/* Radio Status ACC */}
                          <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <label className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                              step.accStatus === 'Masih revisi' 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}>
                              <input
                                type="radio"
                                name={`acc_${step.id}`}
                                checked={step.accStatus === 'Masih revisi'}
                                onChange={() => handleAccStatusChange(step.id, 'Masih revisi')}
                                className="hidden"
                              />
                              <Clock className="w-3.5 h-3.5" /> Masih revisi
                            </label>

                            <label className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                              step.accStatus === 'Sudah di-ACC' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}>
                              <input
                                type="radio"
                                name={`acc_${step.id}`}
                                checked={step.accStatus === 'Sudah di-ACC'}
                                onChange={() => handleAccStatusChange(step.id, 'Sudah di-ACC')}
                                className="hidden"
                              />
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sudah di-ACC
                            </label>
                          </div>

                          {/* File / Link Drive Input */}
                          <div className="flex-1 w-full space-y-1">
                            <label className="text-[11px] font-semibold text-slate-400">File / draf final yang dipakai (Nama file / Google Drive link)</label>
                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                              <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
                              <input
                                type="text"
                                value={step.finalFileLink || ''}
                                onChange={(e) => handleFileLinkChange(step.id, e.target.value)}
                                placeholder="Misal: Bab_2_Final_ACC_Dosen.docx atau https://drive.google.com/..."
                                className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Completion Footer Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {step.completed ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Tahap ini telah Anda tandai selesai.
                          </span>
                        ) : (
                          <span>Pastikan seluruh kriteria & bimbingan tahap ini sudah terpenuhi.</span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleStepCompleted(step.id)}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          step.completed
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{step.completed ? 'Batalkan Tandai Selesai' : 'Tandai Selesai'}</span>
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Button to Add Custom Step (Langkah 13 + Tambah Langkah) */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => setShowAddStepModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/20 text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Langkah Baru Kustom
        </button>
      </div>

      {/* AI Assistant Interactive Modal */}
      <AnimatePresence>
        {activeAiModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      Dukun Skripsi AI Copilot
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mode: <span className="text-indigo-300 font-semibold">{activeAiModal.btnLabel}</span> ({activeAiModal.step.title})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAiModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {isAiLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-slate-300 animate-pulse">
                      Dukun Skripsi AI sedang menganalisis & menyusun rekomendasi akademis...
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                    {aiResponse}
                  </div>
                )}
              </div>

              {/* Custom Ask AI Input Box */}
              <div className="pt-3 border-t border-slate-800 shrink-0 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userCustomQuestion}
                    onChange={(e) => setUserCustomQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        generateAiGuidance(activeAiModal.step, activeAiModal.btnType, activeAiModal.btnLabel, userCustomQuestion);
                      }
                    }}
                    placeholder="Tanyakan hal spesifik tentang tahap ini kepada AI..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => generateAiGuidance(activeAiModal.step, activeAiModal.btnType, activeAiModal.btnLabel, userCustomQuestion)}
                    disabled={isAiLoading}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Step Modal */}
      <AnimatePresence>
        {showAddStepModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" /> Tambah Langkah Skripsi Kustom
                </h3>
                <button
                  onClick={() => setShowAddStepModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewStep} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Judul Langkah / Tahap</label>
                  <input
                    type="text"
                    required
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    placeholder="Misal: Uji Coba Lapangan & Pilot Study"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={newStepDesc}
                    onChange={(e) => setNewStepDesc(e.target.value)}
                    placeholder="Instruksi singkat tentang apa yang perlu dikerjakan..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Daftar Checklist (Pisahkan dengan baris baru)</label>
                  <textarea
                    rows={3}
                    value={newStepChecklist}
                    onChange={(e) => setNewStepChecklist(e.target.value)}
                    placeholder="Siapkan alat uji&#10;Sebar ke 10 responden awal&#10;Evaluasi feedback instrumen"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Label Isian Mahasiswa (Opsional)</label>
                  <input
                    type="text"
                    value={newStepInputLabel}
                    onChange={(e) => setNewStepInputLabel(e.target.value)}
                    placeholder="Misal: Hasil evaluasi pilot study"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStepModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                  >
                    Simpan Langkah
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule / Reminder Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" /> Atur Jadwal & Reminder
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {scheduleSavedMsg ? (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-center text-xs font-bold text-emerald-300 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                  <p>{scheduleSavedMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Tanggal Agenda / Bimbingan</label>
                    <input
                      type="date"
                      required
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Jam / Waktu</label>
                    <input
                      type="time"
                      required
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Catatan Agendamu</label>
                    <input
                      type="text"
                      value={scheduleNotes}
                      onChange={(e) => setScheduleNotes(e.target.value)}
                      placeholder="Misal: Bimbingan Bab 4 di Ruang Dosen Gd. A"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                    >
                      Simpan Reminder
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INDONESIAN PAGE STANDARDS MODAL */}
      <AnimatePresence>
        {showStandardsModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Aturan Batas Halaman Akademik Indonesia</h3>
                    <p className="text-xs text-slate-400">Permendikbudristek & Konsensus PTN/PTS se-Indonesia (Proposal, Semhas, Skripsi, Tesis, Disertasi, Jurnal)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStandardsModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <IndonesianPageStandards />

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowStandardsModal(false)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl"
                >
                  Tutup Pedoman
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
