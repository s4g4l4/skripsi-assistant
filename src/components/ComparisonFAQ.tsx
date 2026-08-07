import { Check, Minus, MessageCircle, Star } from 'lucide-react';
import { useState } from 'react';

export function ComparisonTable() {
  return (
    <div className="py-24 bg-white" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Mengapa Beralih ke Dukun Skripsi?</h2>
          <p className="text-lg text-slate-600">Perbandingan head-to-head dengan alat yang biasa kamu gunakan.</p>
        </div>
        
        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-6 border-b border-slate-200 text-slate-900 font-bold w-2/5 text-lg">Fitur & Kapabilitas</th>
                <th className="p-6 border-b border-emerald-200 bg-emerald-50 text-emerald-700 font-extrabold text-center text-lg border-x border-emerald-100">Dukun Skripsi</th>
                <th className="p-6 border-b border-slate-200 text-slate-600 font-bold text-center text-lg">Ms. Word</th>
                <th className="p-6 border-b border-slate-200 text-slate-600 font-bold text-center text-lg">QuillBot</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                { name: "Template Format Kampus Lokal (Margin, Spasi, Font)", us: true, word: false, qb: false },
                { name: "Parafrase Akademis Bahasa Indonesia Natural", us: true, word: false, qb: true },
                { name: "Integrasi Langsung SINTA & Garuda", us: true, word: false, qb: false },
                { name: "Manajemen Daftar Pustaka & Metadata", us: true, word: true, qb: false },
                { name: "Auto Generate Kerangka Proposal (AI)", us: true, word: false, qb: false },
                { name: "Simulasi Sidang dengan Dosen Pembimbing AI", us: true, word: false, qb: false },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 text-sm font-medium text-slate-700 leading-relaxed">{row.name}</td>
                  <td className="p-6 bg-emerald-50/30 text-center border-x border-emerald-50">
                    {row.us ? <Check className="w-6 h-6 text-emerald-500 mx-auto" /> : <Minus className="w-6 h-6 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-6 text-center">
                    {row.word ? <Check className="w-6 h-6 text-slate-400 mx-auto" /> : <Minus className="w-6 h-6 text-slate-300 mx-auto" />}
                  </td>
                  <td className="p-6 text-center">
                    {row.qb ? <Check className="w-6 h-6 text-slate-400 mx-auto" /> : <Minus className="w-6 h-6 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const reviews = [
    { name: "Budi Santoso", univ: "Universitas Indonesia", text: "Format margin dan penomoran halaman UI itu ribet banget buat saya yang gaptek. Dukun Skripsi ngurusin itu semua otomatis. Saya bisa fokus nulis dan lulus tepat waktu!" },
    { name: "Siti Aisyah", univ: "Universitas Gadjah Mada", text: "Fitur parafrasenya ngebantu banget pas mentok nulis Bab 2 dan tinjauan pustaka. Index similarity Turnitin saya turun drastis dari 45% ke 12%." },
    { name: "Rizky Pratama", univ: "Institut Teknologi Bandung", text: "Brainstorming AI-nya ngasih ide judul penelitian yang bener-bener fresh dan disetujui dospem di pengajuan pertama karena ada novelty-nya." }
  ];

  return (
    <div className="py-24 bg-slate-50 border-t border-slate-200" id="testimoni">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">Apa Kata Mereka yang Sudah Wisuda?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm relative hover:shadow-xl transition-shadow duration-300">
              <MessageCircle className="absolute top-8 right-8 w-10 h-10 text-emerald-100" />
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-emerald-400 text-emerald-400" />)}
              </div>
              <p className="text-slate-700 mb-8 italic leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{r.univ}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "Apakah ini aman dari deteksi AI (Turnitin AI Detection)?", a: "Ya, engine kami disetel untuk menghasilkan struktur kalimat yang variatif dan natural (Humanized AI), menghindari pola repetitif, sehingga meminimalisir flag deteksi AI pada Turnitin edisi terbaru." },
    { q: "Apakah format kampus saya pasti tersedia?", a: "Kami memiliki database 100+ template universitas terkemuka di Indonesia. Jika kampus Anda belum ada, Anda bisa mengunggah file PDF Pedoman Skripsi kampus Anda, dan sistem kami akan mempelajarinya secara otomatis untuk menghasilkan template kustom." },
    { q: "Bagaimana sistem pembayarannya?", a: "Kami menyediakan paket Maba (Gratis selamanya dengan batasan kredit per bulan) dan paket Kating (Pro) untuk akses tanpa batas. Pembayaran bisa dilakukan mudah via QRIS, Gopay, OVO, ShopeePay, atau transfer bank." },
    { q: "Apakah daftar pustaka yang dihasilkan AI valid?", a: "Sangat valid dan nyata. Sistem RAG (Retrieval-Augmented Generation) kami menarik metadata langsung dari database jurnal resmi (Crossref, SINTA, Garuda), bukan mengarang sitasi sembarangan (halusinasi)." }
  ];

  return (
    <div className="py-24 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12">Pertanyaan yang Sering Diajukan</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors">
              <button 
                className="w-full px-6 py-5 text-left font-bold text-slate-800 flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg">{faq.q}</span>
                <span className={`transform transition-transform duration-300 text-emerald-500 bg-emerald-100 p-1 rounded-full ${openIndex === i ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
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
