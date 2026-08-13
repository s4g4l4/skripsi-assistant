import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Mail, Shield, MessageSquare, History, CheckCircle2, 
  Clock, AlertCircle, FileText, ArrowLeft, Send, Trash2, Check, Copy,
  ChevronRight, CornerDownRight, Filter, RefreshCw, Sparkles, BookOpen, UserCheck, GraduationCap, Share2, ExternalLink, MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ThesisRoadmap from '../components/ThesisRoadmap';

interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: 'editor' | 'viewer' | 'commenter';
  status: 'pending' | 'accepted';
  invitedAt: string;
}

interface CommentItem {
  id: string;
  projectId: string;
  chapterId: string;
  selectedText?: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  resolved: boolean;
  replies?: {
    id: string;
    content: string;
    authorName: string;
    createdAt: string;
  }[];
}

interface RevisionItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  version: number;
  changesSummary: string;
  authorName: string;
  timestamp: string;
  statusAtVersion: string;
}

interface ChapterApprovalItem {
  chapterId: string;
  chapterTitle: string;
  status: 'Draft' | 'Dalam Review' | 'Disetujui Dosen' | 'Perlu Revisi';
  reviewedBy?: string;
  reviewedAt?: string;
  note?: string;
}

const DEFAULT_CHAPTER_CONTENTS: Record<string, { title: string; subtitle: string; content: string }> = {
  bab1: {
    title: 'BAB I: PENDAHULUAN',
    subtitle: 'Latar Belakang, Rumusan Masalah, & Tujuan Penelitian',
    content: `1.1 Latar Belakang Penelitian
Perkembangan teknologi informasi dan kecerdasan buatan dalam kurun waktu lima tahun terakhir telah mengubah paradigma operasional secara signifikan. Efisiensi, kecepatan pemrosesan data, serta transparansi informasi menjadi tuntutan utama pada institusi modern. Namun, dalam penerapannya, masih ditemukan hambatan integrasi sistem dan rendahnya tingkat penerimaan teknologi oleh para pengguna akhir. Oleh karena itu, penelitian ini bertujuan untuk mengevaluasi dampak efektivitas implementasi sistem terhadap kepuasan dan kineja pengguna.

1.2 Rumusan Masalah
1. Bagaimana pengaruh kualitas sistem terhadap tingkat penerimaan pengguna?
2. Bagaimana efektivitas fitur otomatisasi dalam mempercepat penyelesaian tugas?
3. Faktor-faktor apa saja yang menjadi penghambat utama dalam proses adopsi sistem?

1.3 Tujuan Penelitian
1. Mengukur tingkat kepuasan pengguna terhadap antarmuka dan performa sistem.
2. Menganalisis faktor kritis keberhasilan integrasi teknologi dalam lingkungan akademik.`
  },
  bab2: {
    title: 'BAB II: TINJAUAN PUSTAKA',
    subtitle: 'Landasan Teori, Penelitian Terdahulu, & Kerangka Pemikiran',
    content: `2.1 Landasan Teori
Penelitian ini mengacu pada Technology Acceptance Model (TAM) yang dikembangkan oleh Davis (1989), yang menekankan dua variabel utama: Perceived Usefulness (Persepsi Kemanfaatan) dan Perceived Ease of Use (Persepsi Kemudahan Penggunaan). 

2.2 Penelitian Terdahulu
Pratama (2023) menunjukkan bahwa faktor kemudahan antarmuka berkontribusi sebesar 68% terhadap loyalitas pengguna pada aplikasi web produktivitas. Sementara itu, Wijaya & Rahma (2024) menemukan bahwa dukungan responsif real-time meningkatkan tingkat penyelesaian skripsi hingga 45%.

2.3 Kerangka Pemikiran
Model konseptual menghubungkan Variabel Bebas (X1: Kualitas Antarmuka, X2: Kecepatan Respon) dengan Variabel Terikat (Y: Kepuasan Pengguna & Efektivitas Penyelesaian Skripsi).`
  },
  bab3: {
    title: 'BAB III: METODOLOGI PENELITIAN',
    subtitle: 'Rancangan Penelitian, Populasi, Sampel, & Teknik Analisis Data',
    content: `3.1 Rancangan Penelitian
Penelitian ini menggunakan pendekatan kuantitatif deskriptif dengan metode survei kuesioner terpimpin.

3.2 Populasi dan Sampel
Populasi dalam penelitian ini adalah mahasiswa tingkat akhir yang sedang menyusun skripsi (N = 500). Pengambilan sampel dilakukan dengan teknik Purposive Sampling menggunakan rumus Slovin (e = 5%), sehingga diperoleh sampel sebanyak 222 responden.

3.3 Teknik Analisis Data
Data dianalisis menggunakan Regresi Linear Berganda dengan pengujian validitas, reliabilitas, serta uji asumsi klasik (normalitas, multikolinearitas, dan heteroskedastisitas) menggunakan paket statistik.`
  },
  bab4: {
    title: 'BAB IV: HASIL DAN PEMBAHASAN',
    subtitle: 'Deskripsi Data, Uji Hipotesis, & Pembahasan Analisis',
    content: `4.1 Hasil Uji Validitas dan Reliabilitas
Seluruh butir pernyataan kuesioner dinyatakan valid dengan nilai r-hitung > r-tabel (0,138) dan reliabel dengan nilai Cronbach's Alpha sebesar 0,892 (> 0,60).

4.2 Uji Hipotesis (Uji F dan Uji t)
Hasil uji F menunjukkan F-hitung (45,82) > F-tabel (3,04) dengan nilai signifikansi 0,000 < 0,05, artinya variabel kualitas sistem dan fitur pembimbingan berpengaruh simultan dan signifikan terhadap efektivitas pengerjaan skripsi.`
  },
  bab5: {
    title: 'BAB V: KESIMPULAN DAN SARAN',
    subtitle: 'Kesimpulan Akhir & Rekomendasi Manajerial / Akademik',
    content: `5.1 Kesimpulan
1. Kualitas antarmuka dan ketersediaan portal bimbingan dosen berpengaruh positif dan signifikan terhadap kelancaran proses revisi skripsi.
2. Fitur komentar dan approval bab real-time terbukti memangkas durasi bimbingan hingga 50%.

5.2 Saran
1. Bagi Institusi: Direkomendasikan untuk memfasilitasi integrasi portal bimbingan digital pada seluruh fakultas.
2. Bagi Peneliti Selanjutnya: Diharapkan memperluas variabel penelitian ke aspek gamifikasi dan kecerdasan buatan terapan.`
  }
};

export default function CollaborationPage() {
  // Parse URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const isGuestMode = searchParams.get('mode') === 'review' || searchParams.get('guest') === 'true' || searchParams.get('review') === 'true';
  const guestLecturerName = searchParams.get('lecturer') || 'Dr. Ir. Hendra Wijaya, M.T.';
  const guestLecturerEmail = searchParams.get('email') || 'dosen@univ.ac.id';
  const guestLecturerRole = searchParams.get('role') || 'Dosen Pembimbing Utama';

  const [activeTab, setActiveTab] = useState<'roadmap' | 'draft' | 'approvals' | 'comments' | 'collaborators' | 'history'>(
    isGuestMode ? 'draft' : 'roadmap'
  );
  const [projectId] = useState('proj-demo-1');

  // Draft Reader Chapter State
  const [activeDraftChapter, setActiveDraftChapter] = useState<string>('bab1');

  // Data states
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [approvals, setApprovals] = useState<ChapterApprovalItem[]>([]);

  // Generator Link Bimbingan Dosen State
  const [lecturerNameInput, setLecturerNameInput] = useState(guestLecturerName);
  const [lecturerRoleInput, setLecturerRoleInput] = useState('Dosen Pembimbing Utama');
  const [copiedDirectLink, setCopiedDirectLink] = useState(false);
  const [copiedTemplateMsg, setCopiedTemplateMsg] = useState(false);

  // Email Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Dosen Pembimbing Utama');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');

  const [colToDelete, setColToDelete] = useState<Collaborator | null>(null);

  // Comment State
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('bab1');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedTextForComment, setSelectedTextForComment] = useState('Latar Belakang & Rumusan Masalah');
  const [newReplyTexts, setNewReplyTexts] = useState<Record<string, string>>({});

  // Approval Modal/Action State
  const [editingApprovalChapter, setEditingApprovalChapter] = useState<ChapterApprovalItem | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'Draft' | 'Dalam Review' | 'Disetujui Dosen' | 'Perlu Revisi'>('Disetujui Dosen');
  const [approvalNote, setApprovalNote] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [projectId]);

  const fetchAllData = async () => {
    try {
      const [colRes, commRes, revRes, appRes] = await Promise.all([
        fetch(`/api/collaboration/collaborators/${projectId}`),
        fetch(`/api/collaboration/comments/${projectId}`),
        fetch(`/api/collaboration/revisions/${projectId}`),
        fetch(`/api/collaboration/approvals/${projectId}`)
      ]);

      if (colRes.ok) {
        const d = await colRes.json();
        const apiCols: Collaborator[] = d.collaborators || [];
        const localRaw = localStorage.getItem(`dukun_skripsi_collabs_${projectId}`);
        if (localRaw) {
          try {
            setCollaborators(JSON.parse(localRaw));
          } catch {
            setCollaborators(apiCols);
          }
        } else {
          setCollaborators(apiCols);
          localStorage.setItem(`dukun_skripsi_collabs_${projectId}`, JSON.stringify(apiCols));
        }
      }

      // Local comments backup
      const localCommentsRaw = localStorage.getItem(`dukun_skripsi_comments_${projectId}`);
      if (localCommentsRaw) {
        try {
          setComments(JSON.parse(localCommentsRaw));
        } catch {
          if (commRes.ok) {
            const d = await commRes.json();
            setComments(d.comments || []);
          }
        }
      } else if (commRes.ok) {
        const d = await commRes.json();
        setComments(d.comments || []);
      }

      if (revRes.ok) {
        const d = await revRes.json();
        setRevisions(d.revisions || []);
      }

      // Local approvals backup
      const localApprovalsRaw = localStorage.getItem(`dukun_skripsi_approvals_${projectId}`);
      if (localApprovalsRaw) {
        try {
          setApprovals(JSON.parse(localApprovalsRaw));
        } catch {
          if (appRes.ok) {
            const d = await appRes.json();
            setApprovals(d.approvals || []);
          }
        }
      } else if (appRes.ok) {
        const d = await appRes.json();
        setApprovals(d.approvals || []);
      }
    } catch {
      // Fallback handled by initialized state
    }
  };

  // Generate public review link
  const getPublicReviewUrl = () => {
    const baseUrl = 'https://skripsi-assistant-jade.vercel.app';
    const params = new URLSearchParams({
      mode: 'review',
      guest: 'true',
      lecturer: lecturerNameInput || 'Dosen Pembimbing',
      role: lecturerRoleInput || 'Dosen Pembimbing Utama'
    });
    return `${baseUrl}/collaboration?${params.toString()}`;
  };

  const handleCopyDirectLink = () => {
    const url = getPublicReviewUrl();
    navigator.clipboard.writeText(url);
    setCopiedDirectLink(true);
    setTimeout(() => setCopiedDirectLink(false), 3000);
  };

  const handleCopyMessageTemplate = () => {
    const url = getPublicReviewUrl();
    const msg = `Yth. Bapak/Ibu ${lecturerNameInput || 'Dosen Pembimbing'},\n\nBerikut adalah tautan bimbingan dan peninjauan draft skripsi saya (Akses Langsung Tanpa Login):\n👉 ${url}\n\nMohon bimbingan, catatan revisi, dan saran dari Bapak/Ibu. Terima kasih.`;
    navigator.clipboard.writeText(msg);
    setCopiedTemplateMsg(true);
    setTimeout(() => setCopiedTemplateMsg(false), 3000);
  };

  const handleSendWhatsApp = () => {
    const url = getPublicReviewUrl();
    const msg = `Yth. Bapak/Ibu ${lecturerNameInput || 'Dosen Pembimbing'},\n\nBerikut adalah tautan bimbingan dan peninjauan draft skripsi saya (Akses Langsung Tanpa Login):\n👉 ${url}\n\nMohon bimbingan, catatan revisi, dan saran dari Bapak/Ibu. Terima kasih.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const confirmRemoveCollaborator = async () => {
    if (!colToDelete) return;
    const targetId = colToDelete.id;

    const updated = collaborators.filter(c => c.id !== targetId);
    setCollaborators(updated);
    localStorage.setItem(`dukun_skripsi_collabs_${projectId}`, JSON.stringify(updated));

    try {
      await fetch(`/api/collaboration/collaborators/${projectId}/${targetId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend API delete failed, local state updated:', e);
    } finally {
      setColToDelete(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const author = isGuestMode 
      ? `${guestLecturerName} (${guestLecturerRole})` 
      : 'Mahasiswa / Penulis';

    const newCommentItem: CommentItem = {
      id: 'comm-' + Date.now(),
      projectId,
      chapterId: selectedChapterFilter === 'all' ? 'bab1' : selectedChapterFilter,
      selectedText: selectedTextForComment,
      content: newCommentText,
      authorName: author,
      authorEmail: isGuestMode ? guestLecturerEmail : 'mahasiswa@dukunskripsi.id',
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    const updatedComments = [newCommentItem, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`dukun_skripsi_comments_${projectId}`, JSON.stringify(updatedComments));

    setNewCommentText('');

    try {
      await fetch('/api/collaboration/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentItem)
      });
    } catch {
      // Handled by local state
    }
  };

  const handleReplyComment = async (commentId: string) => {
    const replyText = newReplyTexts[commentId];
    if (!replyText || !replyText.trim()) return;

    const author = isGuestMode 
      ? `${guestLecturerName}` 
      : 'Mahasiswa (Anda)';

    const newReply = {
      id: 'rep-' + Date.now(),
      content: replyText,
      authorName: author,
      createdAt: new Date().toISOString()
    };

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    });

    setComments(updatedComments);
    localStorage.setItem(`dukun_skripsi_comments_${projectId}`, JSON.stringify(updatedComments));
    setNewReplyTexts(prev => ({ ...prev, [commentId]: '' }));

    try {
      await fetch('/api/collaboration/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          commentId,
          content: replyText,
          authorName: author
        })
      });
    } catch {
      // Handled by local state
    }
  };

  const handleResolveComment = async (commentId: string) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, resolved: true } : c);
    setComments(updated);
    localStorage.setItem(`dukun_skripsi_comments_${projectId}`, JSON.stringify(updated));

    try {
      await fetch(`/api/collaboration/comments/${commentId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
    } catch {
      // Handled by local state
    }
  };

  const handleUpdateApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApprovalChapter) return;

    const reviewer = isGuestMode ? `${guestLecturerName}` : 'Dr. Ir. Hendra Wijaya, M.T.';

    const updatedApprovals = approvals.map(app => {
      if (app.chapterId === editingApprovalChapter.chapterId) {
        return {
          ...app,
          status: approvalStatus,
          note: approvalNote,
          reviewedBy: reviewer,
          reviewedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApprovals(updatedApprovals);
    localStorage.setItem(`dukun_skripsi_approvals_${projectId}`, JSON.stringify(updatedApprovals));
    setEditingApprovalChapter(null);
    setApprovalNote('');

    try {
      await fetch('/api/collaboration/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chapterId: editingApprovalChapter.chapterId,
          chapterTitle: editingApprovalChapter.chapterTitle,
          status: approvalStatus,
          note: approvalNote,
          reviewedBy: reviewer
        })
      });
    } catch {
      // Handled by local state
    }
  };

  const handleInviteCollaboratorEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setIsInviting(true);
    setInviteSuccessMsg('');

    try {
      const res = await fetch('/api/collaboration/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          email: inviteEmail,
          name: inviteName,
          role: inviteRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update state
        const updatedCols = [data.collaborator, ...collaborators];
        setCollaborators(updatedCols);
        localStorage.setItem(`dukun_skripsi_collabs_${projectId}`, JSON.stringify(updatedCols));
        
        // Reset form
        setInviteEmail('');
        setInviteName('');
        setInviteRole('Dosen Pembimbing Utama');
        
        if (data.emailSent) {
          setInviteSuccessMsg(`Berhasil! Email undangan telah dikirim ke ${data.collaborator.email} via Brevo.`);
        } else {
          setInviteSuccessMsg(`Berhasil ditambahkan ke daftar, namun email tidak terkirim (API Key Brevo belum dikonfigurasi).`);
        }
        
        setTimeout(() => setInviteSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Disetujui Dosen':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Dalam Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Perlu Revisi':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const currentChapterObj = DEFAULT_CHAPTER_CONTENTS[activeDraftChapter] || DEFAULT_CHAPTER_CONTENTS.bab1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white">Pusat Kolaborasi Skripsi & Bimbingan Dosen</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Sharing, Review Bab, Komentar, & Riwayat Revisi</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
            <span>Alur & Roadmap</span>
          </button>
          
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'draft' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>📖 Baca Naskah Bab 1-5</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'approvals' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Persetujuan Bab (ACC)
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'comments' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Komentar & Catatan
          </button>

          <button
            onClick={() => setActiveTab('collaborators')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'collaborators' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Link Akses Dosen</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Riwayat Revisi
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* Guest Lecturer Welcome Banner */}
        {isGuestMode && (
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    MODE BIMBINGAN DOSEN • TANPA LOGIN
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-sm md:text-base">
                  Selamat Datang, {guestLecturerName} ({guestLecturerRole})
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Anda memiliki akses langsung untuk membaca naskah Bab 1-5, memberikan catatan koreksi, dan menentukan status ACC Bab.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setActiveTab('draft')} 
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <BookOpen className="w-4 h-4" /> Baca Naskah
              </button>
              <button 
                onClick={() => setActiveTab('comments')} 
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Tulis Catatan
              </button>
            </div>
          </div>
        )}

        {/* Project Info Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROYEK AKTIF
              </span>
              <span className="text-xs text-slate-400">• ID: proj-demo-1</span>
            </div>
            <h2 className="text-lg font-extrabold text-white">Analisis Sentimen Pengguna Twitter Terhadap Layanan Publik</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dosen Pembimbing Utama: <span className="text-slate-200 font-semibold">{guestLecturerName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <div className="text-right text-xs">
              <p className="text-slate-400">Kemajuan Bab:</p>
              <p className="font-bold text-emerald-400">1 / 5 Bab ACC Dosen</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              20%
            </div>
          </div>
        </div>

        {/* TAB 0: ALUR BIMBINGAN & ROADMAP SKRIPSI */}
        {activeTab === 'roadmap' && <ThesisRoadmap />}

        {/* TAB NEW: BACA & KOREKSI NASKAH BAB 1 - 5 */}
        {activeTab === 'draft' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Peninjauan Draft Naskah Skripsi
                </h3>
                <p className="text-xs text-slate-400">Bisa dibaca langsung oleh Dosen untuk koreksi dan masukan</p>
              </div>

              {/* Chapter Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {Object.keys(DEFAULT_CHAPTER_CONTENTS).map((chapKey, idx) => (
                  <button
                    key={chapKey}
                    onClick={() => setActiveDraftChapter(chapKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeDraftChapter === chapKey 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Bab {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Reader Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
              <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-wide">{currentChapterObj.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{currentChapterObj.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedChapterFilter(activeDraftChapter);
                      setActiveTab('comments');
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <MessageSquare className="w-4 h-4" /> Beri Catatan Bab Ini
                  </button>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Status ACC
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800/80 text-slate-200 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                {currentChapterObj.content}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Dosen dapat langsung mengeklik <strong>Beri Catatan Bab Ini</strong> untuk mengirimkan koreksi spesifik.
                </span>
                <span className="font-semibold text-slate-300">Format Standard Akademik</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CHAPTER APPROVAL WORKFLOW */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Workflow Approval Bab Skripsi
                </h3>
                <p className="text-xs text-slate-400">Alur persetujuan revisi bab oleh Dosen Pembimbing</p>
              </div>
              <button onClick={fetchAllData} className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvals.map((app) => (
                <div key={app.chapterId} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-white">{app.chapterTitle}</h4>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    {app.note && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Catatan Dosen:</p>
                        <p className="italic">"{app.note}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      {app.reviewedBy && (
                        <p className="text-[11px]">Ditinjau: <span className="text-slate-300 font-medium">{app.reviewedBy}</span></p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEditingApprovalChapter(app);
                        setApprovalStatus(app.status);
                        setApprovalNote(app.note || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-indigo-300 transition-colors"
                    >
                      Ubah Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INLINE COMMENTS & DISCUSSION */}
        {activeTab === 'comments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: New Comment Input */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Tulis Catatan / Feedback
              </h3>
              
              <form onSubmit={handleAddComment} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Pilih Bab Target</label>
                  <select
                    value={selectedChapterFilter}
                    onChange={(e) => setSelectedChapterFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="bab1">Bab I: Pendahuluan</option>
                    <option value="bab2">Bab II: Tinjauan Pustaka</option>
                    <option value="bab3">Bab III: Metodologi Penelitian</option>
                    <option value="bab4">Bab IV: Hasil & Pembahasan</option>
                    <option value="bab5">Bab V: Kesimpulan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Teks / Bagian yang Disorot</label>
                  <input
                    type="text"
                    value={selectedTextForComment}
                    onChange={(e) => setSelectedTextForComment(e.target.value)}
                    placeholder="Contoh: Metodologi Purposive Sampling"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Isi Catatan / Feedback</label>
                  <textarea
                    rows={4}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Tuliskan instruksi revisi atau pertanyaan diskusi..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Catatan
                </button>
              </form>
            </div>

            {/* Right: Comments List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Daftar Catatan & Diskusi Bimbingan</h3>
                <span className="text-xs text-slate-400">{comments.length} Komentar Aktif</span>
              </div>

              <div className="space-y-3">
                {comments.map((comm) => (
                  <div 
                    key={comm.id}
                    className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                      comm.resolved ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{comm.authorName}</span>
                          <span className="text-[10px] text-slate-500">• {new Date(comm.createdAt).toLocaleDateString()}</span>
                          {comm.resolved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Bab: <span className="text-indigo-300 font-semibold uppercase">{comm.chapterId}</span></p>
                      </div>

                      {!comm.resolved && (
                        <button
                          onClick={() => handleResolveComment(comm.id)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/30 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Selesai
                        </button>
                      )}
                    </div>

                    {comm.selectedText && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border-l-2 border-indigo-500 text-xs italic text-slate-300">
                        "{comm.selectedText}"
                      </div>
                    )}

                    <p className="text-xs text-slate-200 leading-relaxed">{comm.content}</p>

                    {/* Replies */}
                    {comm.replies && comm.replies.length > 0 && (
                      <div className="pl-4 border-l border-slate-800 space-y-2 pt-2">
                        {comm.replies.map((rep) => (
                          <div key={rep.id} className="p-2.5 rounded-lg bg-slate-900/80 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-bold text-indigo-300">{rep.authorName}</span>
                              <span>{new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-200">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {!comm.resolved && (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newReplyTexts[comm.id] || ''}
                          onChange={(e) => setNewReplyTexts(prev => ({ ...prev, [comm.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleReplyComment(comm.id)}
                          placeholder="Tulis balasan..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleReplyComment(comm.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                        >
                          Balas
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: GENERATOR LINK AKSES DOSEN (TANPA LOGIN) & ANGGOTA */}
        {activeTab === 'collaborators' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Generator Link Akses Dosen (Tanpa Login) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/40 border border-indigo-500/30 space-y-5 h-fit shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Link Akses Dosen (Tanpa Login)
                  </h3>
                  <p className="text-[11px] text-slate-400">Dosen bisa langsung buka, baca bab, & beri catatan</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    Nama & Gelar Dosen Pembimbing / Peninjau
                  </label>
                  <input
                    type="text"
                    value={lecturerNameInput}
                    onChange={(e) => setLecturerNameInput(e.target.value)}
                    placeholder="Dr. Ir. Hendra Wijaya, M.T."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    Peran / Jabatan
                  </label>
                  <select
                    value={lecturerRoleInput}
                    onChange={(e) => setLecturerRoleInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Dosen Pembimbing Utama">Dosen Pembimbing Utama</option>
                    <option value="Dosen Pembimbing 2">Dosen Pembimbing 2</option>
                    <option value="Dosen Penguji">Dosen Penguji</option>
                    <option value="Rekan Mahasiswa">Rekan Mahasiswa / Reviewer</option>
                  </select>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5 text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dosen Tanpa Registrasi / Tanpa Login</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tautan publik ini dapat langsung dibuka oleh Dosen tanpa perlu membuat akun atau login terlebih dahulu.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyDirectLink}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {copiedDirectLink ? (
                      <>
                        <Check className="w-4 h-4 text-white" /> Tautan Berhasil Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Salin Link Akses Dosen (Tanpa Login)
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> Bagikan via WhatsApp ke Dosen
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessageTemplate}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    {copiedTemplateMsg ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Teks Pesan Formal Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" /> Salin Template Pesan Chat Formal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Email Invite & Collaborator List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Form Undang via Email */}
              <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Kirim Undangan via Email (Brevo)</h3>
                    <p className="text-[11px] text-slate-400">Otomatis mengirim tautan akses unik ke email tujuan</p>
                  </div>
                </div>

                {inviteSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{inviteSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleInviteCollaboratorEmail} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nama Lengkap & Gelar</label>
                    <input 
                      type="text" 
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Dr. Hendra Wijaya, M.T."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Alamat Email</label>
                    <input 
                      type="email" 
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="dosen@kampus.ac.id"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-slate-400">Peran</label>
                    <div className="flex items-center gap-3">
                      <select 
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Dosen Pembimbing Utama">Dosen Pembimbing Utama</option>
                        <option value="Dosen Pembimbing 2">Dosen Pembimbing 2</option>
                        <option value="Dosen Penguji">Dosen Penguji</option>
                        <option value="Rekan Mahasiswa">Rekan Mahasiswa / Reviewer</option>
                      </select>
                      <button 
                        type="submit"
                        disabled={isInviting || !inviteEmail || !inviteName}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        {isInviting ? 'Mengirim...' : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Kirim Undangan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Daftar Kolaborator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Daftar Dosen & Kolaborator Terhubung</h3>
                  <span className="text-xs text-slate-400">{collaborators.length} Kolaborator</span>
                </div>

              <div className="space-y-3">
                {collaborators.map((col) => (
                  <div key={col.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {col.name ? col.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{col.name}</h4>
                        <p className="text-[11px] text-slate-400">{col.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700 capitalize">
                        Role: {col.role}
                      </span>
                      <button
                        onClick={() => setColToDelete(col)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Hapus / Batalkan Akses"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

          </div>
        )}

        {/* TAB 4: REVISION HISTORY / TRACK CHANGES */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" /> Track Changes & Riwayat Revisi Versi Bab
            </h3>

            <div className="space-y-3">
              {revisions.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                      v{rev.version}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{rev.chapterTitle}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{rev.changesSummary}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Oleh: {rev.authorName} • {new Date(rev.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(rev.statusAtVersion)}`}>
                    {rev.statusAtVersion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Approval Edit Modal */}
      <AnimatePresence>
        {editingApprovalChapter && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">
                  Update Persetujuan {editingApprovalChapter.chapterTitle}
                </h3>
                <button
                  onClick={() => setEditingApprovalChapter(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateApprovalSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Status Persetujuan Dosen</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Disetujui Dosen">Disetujui Dosen (ACC)</option>
                    <option value="Dalam Review">Dalam Review Dosen</option>
                    <option value="Perlu Revisi">Perlu Revisi</option>
                    <option value="Draft">Masih Draft Mahasiswa</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Catatan Bimbingan / Instruksi Dosen</label>
                  <textarea
                    rows={3}
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Contoh: Bab 1 sudah baik, silakan lanjut ke Bab 2..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingApprovalChapter(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Collaborator Confirmation Modal */}
      <AnimatePresence>
        {colToDelete && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-white">Hapus Akses Kolaborator?</h3>
                <p className="text-xs text-slate-400">
                  Apakah Anda yakin ingin membatalkan/menghapus akses untuk <strong className="text-slate-200">{colToDelete.name || colToDelete.email}</strong>?
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Pengguna ini tidak akan dapat lagi mengakses atau memberikan masukan pada proyek skripsi Anda.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setColToDelete(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmRemoveCollaborator}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus Akses
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
