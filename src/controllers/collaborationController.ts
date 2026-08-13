import { Request, Response } from 'express';

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: 'editor' | 'viewer' | 'commenter';
  avatar?: string;
  invitedAt: string;
  status: 'pending' | 'accepted';
}

export interface Comment {
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

export interface RevisionHistory {
  id: string;
  projectId: string;
  chapterId: string;
  chapterTitle: string;
  version: number;
  changesSummary: string;
  authorName: string;
  timestamp: string;
  statusAtVersion: string;
}

export interface ChapterApproval {
  chapterId: string;
  chapterTitle: string;
  status: 'Draft' | 'Dalam Review' | 'Disetujui Dosen' | 'Perlu Revisi';
  reviewedBy?: string;
  reviewedAt?: string;
  note?: string;
}

// In-memory mock database for collaboration features
const projectCollaborators: Record<string, Collaborator[]> = {
  'proj-demo-1': [
    {
      id: 'col-1',
      email: 'dosen.pembimbing@univ.ac.id',
      name: 'Dr. Ir. Hendra Wijaya, M.T.',
      role: 'editor',
      status: 'accepted',
      invitedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'col-2',
      email: 'rekan.skripsi@gmail.com',
      name: 'Siti Rahmawati',
      role: 'commenter',
      status: 'accepted',
      invitedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

const projectComments: Record<string, Comment[]> = {
  'proj-demo-1': [
    {
      id: 'comm-1',
      projectId: 'proj-demo-1',
      chapterId: 'bab1',
      selectedText: 'penurunan retensi pengguna secara drastis dalam 3 bulan terakhir',
      content: 'Tolong tambahkan data kuantitatif berupa persentase penurunan retensi dari laporan analytics.',
      authorName: 'Dr. Ir. Hendra Wijaya, M.T.',
      authorEmail: 'dosen.pembimbing@univ.ac.id',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      resolved: false,
      replies: [
        {
          id: 'rep-1',
          content: 'Siap Pak, data grafik Google Analytics bulan Mei-Juli sudah saya tambahkan di Bab IV.',
          authorName: 'Mahasiswa (Anda)',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ]
    },
    {
      id: 'comm-2',
      projectId: 'proj-demo-1',
      chapterId: 'bab3',
      selectedText: 'System Usability Scale (SUS)',
      content: 'Jelaskan juga kriteria responden dan teknik sampling yang digunakan (Purposive Sampling).',
      authorName: 'Dr. Ir. Hendra Wijaya, M.T.',
      authorEmail: 'dosen.pembimbing@univ.ac.id',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      resolved: false
    }
  ]
};

const projectRevisions: Record<string, RevisionHistory[]> = {
  'proj-demo-1': [
    {
      id: 'rev-3',
      projectId: 'proj-demo-1',
      chapterId: 'bab1',
      chapterTitle: 'Bab I: Pendahuluan',
      version: 3,
      changesSummary: 'Menambahkan rumusan masalah & batasan penelitian SUS',
      authorName: 'Mahasiswa (Anda)',
      timestamp: new Date().toISOString(),
      statusAtVersion: 'Dalam Review'
    },
    {
      id: 'rev-2',
      projectId: 'proj-demo-1',
      chapterId: 'bab1',
      chapterTitle: 'Bab I: Pendahuluan',
      version: 2,
      changesSummary: 'Memperbaiki tata bahasa latar belakang sesuai masukan dosen',
      authorName: 'Mahasiswa (Anda)',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      statusAtVersion: 'Perlu Revisi'
    },
    {
      id: 'rev-1',
      projectId: 'proj-demo-1',
      chapterId: 'bab1',
      chapterTitle: 'Bab I: Pendahuluan',
      version: 1,
      changesSummary: 'Draf awal Bab I',
      authorName: 'Mahasiswa (Anda)',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      statusAtVersion: 'Draft'
    }
  ]
};

const chapterApprovals: Record<string, Record<string, ChapterApproval>> = {
  'proj-demo-1': {
    'bab1': { chapterId: 'bab1', chapterTitle: 'Bab I: Pendahuluan', status: 'Dalam Review', reviewedBy: 'Dr. Ir. Hendra Wijaya, M.T.', note: 'Mohon rapikan tabel rumusan masalah.' },
    'bab2': { chapterId: 'bab2', chapterTitle: 'Bab II: Tinjauan Pustaka', status: 'Disetujui Dosen', reviewedBy: 'Dr. Ir. Hendra Wijaya, M.T.', note: 'ACC untuk lanjut ke seminar proposal.' },
    'bab3': { chapterId: 'bab3', chapterTitle: 'Bab III: Metodologi Penelitian', status: 'Perlu Revisi', reviewedBy: 'Dr. Ir. Hendra Wijaya, M.T.', note: 'Revisi jumlah sampel dan rumus Slovin.' },
    'bab4': { chapterId: 'bab4', chapterTitle: 'Bab IV: Hasil & Pembahasan', status: 'Draft' },
    'bab5': { chapterId: 'bab5', chapterTitle: 'Bab V: Kesimpulan', status: 'Draft' }
  }
};

// --- Controllers ---

export const getCollaborators = (req: Request, res: Response) => {
  const projectId = String(req.params.projectId || 'proj-demo-1');
  const collaborators = projectCollaborators[projectId] || [];
  res.json({ projectId, collaborators });
};

export const inviteCollaborator = async (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const { email, name, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email dan role (editor/viewer/commenter) wajib diisi.' });
  }

  if (!projectCollaborators[projectId]) {
    projectCollaborators[projectId] = [];
  }

  const newCol: Collaborator = {
    id: `col-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    role,
    status: 'pending',
    invitedAt: new Date().toISOString()
  };

  projectCollaborators[projectId].push(newCol);

  // Send Email using Brevo API if key is present
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@dukunskripsi.id';
    const appUrl = process.env.APP_URL || 'https://skripsi-assistant-jade.vercel.app';
    const reviewLink = `${appUrl}/collaboration?mode=review&guest=true&lecturer=${encodeURIComponent(newCol.name)}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`;
    
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Dukun Skripsi', email: senderEmail },
          to: [{ email, name: newCol.name }],
          subject: 'Undangan Peninjauan & Bimbingan Skripsi',
          htmlContent: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="color: #0f172a;">Halo ${newCol.name},</h2>
              <p>Anda telah diundang sebagai <strong>${role}</strong> untuk meninjau dan memberikan bimbingan pada sebuah proyek skripsi.</p>
              <p>Anda dapat langsung membaca naskah, memberikan catatan (inline feedback), dan menyetujui bab (ACC) secara online tanpa perlu mendaftar atau login.</p>
              
              <div style="margin: 32px 0; text-align: center;">
                <a href="${reviewLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Buka Portal Bimbingan
                </a>
              </div>
              
              <p style="font-size: 0.85em; color: #64748b;">Jika tombol di atas tidak berfungsi, Anda dapat menyalin tautan berikut ke browser Anda:</p>
              <p style="font-size: 0.85em; color: #64748b; word-break: break-all; background-color: #f8fafc; padding: 8px; border-radius: 4px;">${reviewLink}</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 32px; margin-bottom: 24px;" />
              <p style="font-size: 0.75em; color: #94a3b8; text-align: center;">Email ini dikirim secara otomatis oleh platform Dukun Skripsi.</p>
            </div>
          `
        })
      });

      if (!brevoRes.ok) {
        console.error('Brevo API Error:', await brevoRes.text());
      }
    } catch (err) {
      console.error('Failed to send email via Brevo:', err);
    }
  }

  res.status(201).json({
    message: `Undangan kolaborasi berhasil dikirimkan ke ${email} dengan role ${role}.`,
    collaborator: newCol,
    emailSent: !!brevoApiKey
  });
};

export const removeCollaborator = (req: Request, res: Response) => {
  const projectId = String(req.params.projectId || 'proj-demo-1');
  const collaboratorId = req.params.colId;

  if (projectCollaborators[projectId]) {
    projectCollaborators[projectId] = projectCollaborators[projectId].filter(c => c.id !== collaboratorId);
  }

  res.json({ message: 'Kolaborator berhasil dihapus dari proyek.' });
};

export const getComments = (req: Request, res: Response) => {
  const projectId = String(req.params.projectId || 'proj-demo-1');
  const comments = projectComments[projectId] || [];
  res.json({ projectId, comments });
};

export const addComment = (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const { chapterId, selectedText, content, authorName, authorEmail } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Isi komentar tidak boleh kosong.' });
  }

  if (!projectComments[projectId]) {
    projectComments[projectId] = [];
  }

  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    projectId,
    chapterId: chapterId || 'bab1',
    selectedText: selectedText || '',
    content,
    authorName: authorName || 'Dosen Pembimbing',
    authorEmail: authorEmail || 'dosen@univ.ac.id',
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: []
  };

  projectComments[projectId].unshift(newComment);

  res.status(201).json({ message: 'Komentar berhasil ditambahkan.', comment: newComment });
};

export const replyComment = (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const { commentId, content, authorName } = req.body;

  const comments = projectComments[projectId] || [];
  const comment = comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
  }

  if (!comment.replies) {
    comment.replies = [];
  }

  const reply = {
    id: `rep-${Date.now()}`,
    content,
    authorName: authorName || 'Mahasiswa',
    createdAt: new Date().toISOString()
  };

  comment.replies.push(reply);

  res.json({ message: 'Balasan komentar berhasil dikirim.', reply });
};

export const resolveComment = (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const commentId = req.params.commentId;

  const comments = projectComments[projectId] || [];
  const comment = comments.find(c => c.id === commentId);

  if (comment) {
    comment.resolved = true;
  }

  res.json({ message: 'Komentar ditandai selesai (resolved).' });
};

export const getRevisions = (req: Request, res: Response) => {
  const projectId = String(req.params.projectId || 'proj-demo-1');
  const revisions = projectRevisions[projectId] || [];
  res.json({ projectId, revisions });
};

export const addRevision = (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const { chapterId, chapterTitle, changesSummary, authorName, statusAtVersion } = req.body;

  if (!projectRevisions[projectId]) {
    projectRevisions[projectId] = [];
  }

  const nextVer = (projectRevisions[projectId].length || 0) + 1;

  const newRev: RevisionHistory = {
    id: `rev-${Date.now()}`,
    projectId,
    chapterId: chapterId || 'bab1',
    chapterTitle: chapterTitle || 'Bab I: Pendahuluan',
    version: nextVer,
    changesSummary: changesSummary || 'Pembaruan isi bab.',
    authorName: authorName || 'Mahasiswa',
    timestamp: new Date().toISOString(),
    statusAtVersion: statusAtVersion || 'Draft'
  };

  projectRevisions[projectId].unshift(newRev);

  res.status(201).json({ message: 'Riwayat versi berhasil disimpan.', revision: newRev });
};

export const getApprovals = (req: Request, res: Response) => {
  const projectId = String(req.params.projectId || 'proj-demo-1');
  const approvals = chapterApprovals[projectId] || {};
  res.json({ projectId, approvals: Object.values(approvals) });
};

export const updateApproval = (req: Request, res: Response) => {
  const projectId = String(req.body.projectId || 'proj-demo-1');
  const { chapterId, chapterTitle, status, reviewedBy, note } = req.body;

  if (!chapterApprovals[projectId]) {
    chapterApprovals[projectId] = {};
  }

  chapterApprovals[projectId][chapterId] = {
    chapterId,
    chapterTitle: chapterTitle || chapterId,
    status,
    reviewedBy: reviewedBy || 'Dr. Ir. Hendra Wijaya, M.T.',
    reviewedAt: new Date().toISOString(),
    note: note || ''
  };

  res.json({
    message: `Status ${chapterTitle} berhasil diubah menjadi "${status}".`,
    approval: chapterApprovals[projectId][chapterId]
  });
};
