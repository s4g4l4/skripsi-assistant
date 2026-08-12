import { useState } from 'react';

export function ComparisonTable() {
  return null;
}

export function Testimonials() {
  return null;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { 
      q: "Model AI apa saja yang didukung oleh Dukun Skripsi AI?", 
      a: "Dukun Skripsi AI mendukung Multi-Engine AI Integration meliputi Google Gemini 2.5 Flash (bawaan sistem), NVIDIA NIM (DeepSeek-R1 & Llama 3.3 70B dengan 1000 Free Credits gratis), OpenRouter AI (akses 20+ model gratis), Groq Cloud (respon kilat), DeepSeek-R1/V3, Prism, dan GKS-Write. Anda dapat berpindah engine secara manual atau memilih mode Synergy Multi-AI." 
    },
    { 
      q: "Bagaimana cara sistem membaca Buku Panduan Skripsi dari kampus saya?", 
      a: "Cukup upload file PDF/DOCX Buku Panduan Skripsi kampus Anda pada modul Proposal Generator atau Auto-Format. Engine Google Gemini 2.5 Flash akan mengekstrak aturan margin (top, left, bottom, right), jenis & ukuran font, spasi baris, penomoran halaman, dan format sampul secara 100% presisi untuk langsung diterapkan pada dokumen Anda." 
    },
    { 
      q: "Bagaimana cara kerja pencarian literatur dan sitasi jurnal?", 
      a: "Sistem kami terhubung langsung secara real-time ke OpenAlex Open Science Index API (indeks sains terbuka global terbesar) dan registri DOI resmi. Semua sitasi, abstrak, tahun publikasi, dan metadata jurnal yang ditarik 100% nyata, terverifikasi, dan bebas dari halusinasi AI." 
    },
    { 
      q: "Bagaimana cara mengintegrasikan Server MCP Pertanian & Agribisnis (AgriBrain & LeafEngines)?", 
      a: "Server MCP (Model Context Protocol) untuk riset pertanian, agribisnis, data tanah USDA, dan citra satelit QGIS terhubung secara otomatis via protokol Open Data SSE tanpa perlu API Key. Jika Anda menjalankan server MCP di laptop/lokal, Anda tinggal memasukkan URL endpoint lokal Anda di menu Pengaturan." 
    },
    { 
      q: "Apakah draf buatan AI ini aman dari deteksi Turnitin & AI Detector?", 
      a: "Ya, sistem kami dilengkapi dengan fitur AI to Human Text Optimizer (Humanizer) dan Smart Paraphrase Akademis yang merestrukturisasi sintaksis kalimat menjadi ragam bahasa ilmiah manusia yang bervariasi dan alami, sehingga meminimalisir flag deteksi AI pada Turnitin edisi terbaru." 
    },
    { 
      q: "Apakah aplikasi Dukun Skripsi AI ini gratis?", 
      a: "Ya, seluruh 44 Tools AI, pencarian jurnal OpenAlex, server MCP pertanian, dan fitur dasar Google Gemini 2.5 Flash dapat digunakan 100% Gratis. Anda juga dapat mengklaim dan memasukkan API Key gratis resmi Anda sendiri dari NVIDIA NIM, OpenRouter, atau Groq untuk kuota pemrosesan tanpa batas." 
    }
  ];

  return (
    <div className="py-24 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
        <p className="text-center text-slate-500 mb-12 text-sm">Jawaban lengkap seputar teknologi, integrasi AI, panduan skripsi, dan fitur Dukun Skripsi AI.</p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-300 transition-colors shadow-xs">
              <button 
                className="w-full px-6 py-5 text-left font-bold text-slate-800 flex justify-between items-center focus:outline-none gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-base md:text-lg text-slate-900">{faq.q}</span>
                <span className={`transform transition-transform duration-300 text-emerald-600 bg-emerald-100 p-1.5 rounded-full shrink-0 ${openIndex === i ? 'rotate-180 bg-emerald-500 text-white' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

