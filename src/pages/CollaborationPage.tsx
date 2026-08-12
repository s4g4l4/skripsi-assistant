import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Mail, Shield, MessageSquare, History, CheckCircle2, 
  Clock, AlertCircle, FileText, ArrowLeft, Send, Trash2, Check, Copy,
  ChevronRight, CornerDownRight, Filter, RefreshCw, Sparkles, BookOpen, UserCheck, GraduationCap
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

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'approvals' | 'comments' | 'collaborators' | 'history'>('roadmap');
  const [projectId] = useState('proj-demo-1');

  // Data states
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [approvals, setApprovals] = useState<ChapterApprovalItem[]>([]);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer' | 'commenter'>('editor');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');

  // Comment State
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
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
        setCollaborators(d.collaborators || []);
      }
      if (commRes.ok) {
        const d = await commRes.json();
        setComments(d.comments || []);
      }
      if (revRes.ok) {
        const d = await revRes.json();
        setRevisions(d.revisions || []);
      }
      if (appRes.ok) {
        const d = await appRes.json();
        setApprovals(d.approvals || []);
      }
    } catch {
      // Fallback handled by initialized state
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleInviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviting(true);
    setInviteSuccessMsg('');
    setCopiedLink(false);

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
        setInviteSuccessMsg(data.message);
        await fetchAllData();
      }
    } catch {
      alert('Gagal mengirimkan undangan.');
    } finally {
      setInviting(false);
    }
  };

  const handleCopyInviteLink = (usePublicDomain = true) => {
    const baseUrl = usePublicDomain ? 'https://skripsi-assistant-jade.vercel.app' : window.location.origin;
    const inviteUrl = `${baseUrl}/login?email=${encodeURIComponent(inviteEmail)}&project=${projectId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleRemoveCollaborator = async (colId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akses kolaborator ini?')) return;
    try {
      const res = await fetch(`/api/collaboration/collaborators/${projectId}/${colId}`, { method: 'DELETE' });
      if (res.ok) {
        setCollaborators(prev => prev.filter(c => c.id !== colId));
      }
    } catch {
      alert('Gagal menghapus kolaborator.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await fetch('/api/collaboration/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chapterId: selectedChapterFilter === 'all' ? 'bab1' : selectedChapterFilter,
          selectedText: selectedTextForComment,
          content: newCommentText,
          authorName: 'Dr. Ir. Hendra Wijaya, M.T.',
          authorEmail: 'dosen.pembimbing@univ.ac.id'
        })
      });

      if (res.ok) {
        setNewCommentText('');
        await fetchAllData();
      }
    } catch {
      alert('Gagal menambahkan komentar.');
    }
  };

  const handleReplyComment = async (commentId: string) => {
    const replyText = newReplyTexts[commentId];
    if (!replyText || !replyText.trim()) return;

    try {
      const res = await fetch('/api/collaboration/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          commentId,
          content: replyText,
          authorName: 'Mahasiswa (Anda)'
        })
      });

      if (res.ok) {
        setNewReplyTexts(prev => ({ ...prev, [commentId]: '' }));
        await fetchAllData();
      }
    } catch {
      alert('Gagal mengirimkan balasan.');
    }
  };

  const handleResolveComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/collaboration/comments/${commentId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      if (res.ok) {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, resolved: true } : c));
      }
    } catch {
      alert('Gagal memperbarui status komentar.');
    }
  };

  const handleUpdateApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApprovalChapter) return;

    try {
      const res = await fetch('/api/collaboration/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chapterId: editingApprovalChapter.chapterId,
          chapterTitle: editingApprovalChapter.chapterTitle,
          status: approvalStatus,
          note: approvalNote,
          reviewedBy: 'Dr. Ir. Hendra Wijaya, M.T.'
        })
      });

      if (res.ok) {
        setEditingApprovalChapter(null);
        setApprovalNote('');
        await fetchAllData();
      }
    } catch {
      alert('Gagal memperbarui status persetujuan.');
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
            <span>Alur Bimbingan & Roadmap (12 Langkah)</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'approvals' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Persetujuan Bab
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
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'collaborators' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anggota & Role
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
            <p className="text-xs text-slate-400 mt-0.5">Dosen Pembimbing Utama: <span className="text-slate-200 font-semibold">Dr. Ir. Hendra Wijaya, M.T.</span></p>
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
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Tambah Catatan Revisi Dosen
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
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Komentar Dosen
                </button>
              </form>
            </div>

            {/* Right: Comments List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Daftar Komentar & Diskusi Terintegrasi</h3>
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
                          placeholder="Balas saran dosen..."
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

        {/* TAB 3: COLLABORATORS & ACCESS ROLES */}
        {activeTab === 'collaborators' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Invite Form */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" /> Undang Kolaborator / Dosen
              </h3>

              {inviteSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold">{inviteSuccessMsg}</span>
                  </div>

                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-amber-300">
                      ⚠️ Mengapa Muncul Error 403 Google saat Dosen Buka Link?
                    </p>
                    <p className="text-[10px] leading-relaxed text-amber-100/90">
                      Link preview internal AI Studio (<code className="bg-black/30 px-1 py-0.5 rounded">ais-dev-...</code> atau <code className="bg-black/30 px-1 py-0.5 rounded">aistudio.google.com</code>) bersifat privat khusus pemilik akun. Dosen akan terkena <strong>Error 403 Forbidden</strong> jika membuka link preview tersebut.
                    </p>
                    <p className="text-[10px] font-bold text-emerald-300 mt-1">
                      ✅ Solusi: Gunakan Tautan Publik Web Utama di bawah ini:
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyInviteLink(true)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-white" /> Tautan Publik Web Utama Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Salin Tautan Akses Dosen (Publik Vercel)
                      </>
                    )}
                  </button>
                </div>
              )}

              <form onSubmit={handleInviteCollaborator} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Kolaborator / Dosen</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="dosen@univ.ac.id"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Nama Lengkap & Gelar (Opsional)</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Dr. Hendra Wijaya, M.T."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Role Hak Akses</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="editor">Editor (Bisa mengedit teks & approve bab)</option>
                    <option value="commenter">Commenter (Bisa memberi komentar & feedback)</option>
                    <option value="viewer">Viewer (Hanya membaca / view-only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={inviting || !inviteEmail}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inviting ? 'Mengirim Undangan...' : 'Kirim Undangan Email'}
                </button>
              </form>
            </div>

            {/* Right: Collaborator List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-white">Anggota Berbagikan Proyek</h3>

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
                        onClick={() => handleRemoveCollaborator(col.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Hapus Akses"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                      v{rev.version}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{rev.chapterTitle}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{rev.changesSummary}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Oleh {rev.authorName} • {new Date(rev.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(rev.statusAtVersion)}`}>
                    Status: {rev.statusAtVersion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Approval Status Modal */}
      <AnimatePresence>
        {editingApprovalChapter && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <h3 className="font-bold text-base text-white">Ubah Status Approval Dosen</h3>
              <p className="text-xs text-slate-400">{editingApprovalChapter.chapterTitle}</p>

              <form onSubmit={handleUpdateApprovalSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Status Terbaru</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Draft">Draft (Dalam Pengerjaan)</option>
                    <option value="Dalam Review">Dalam Review (Menunggu Masukan Dosen)</option>
                    <option value="Disetujui Dosen">Disetujui Dosen (ACC Bab)</option>
                    <option value="Perlu Revisi">Perlu Revisi (Perlu Perbaikan)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Catatan / Feedback Dosen</label>
                  <textarea
                    rows={3}
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Masukkan instruksi khusus atau pujian..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingApprovalChapter(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Simpan Approval
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
