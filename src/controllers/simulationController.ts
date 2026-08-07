import { Request, Response } from 'express';
import { simulateExaminer } from '../services/aiService.js';

const sessions: any = {};

const CHARACTERS = [
  { id: 'galak', name: 'Prof. Galak', role: 'Penguji Utama', desc: 'Pertanyaan sulit, tekanan tinggi, fokus pada kelemahan.' },
  { id: 'santai', name: 'Dr. Santai', role: 'Penguji Pendukung', desc: 'Supportive, pertanyaan mendasar, memberi arahan.' },
  { id: 'detail', name: 'Prof. Detail', role: 'Pakar Metodologi', desc: 'Sangat teliti pada metode penelitian dan validitas data.' },
  { id: 'kritis', name: 'Dr. Kritis', role: 'Penguji Hasil', desc: 'Fokus pada temuan, kontribusi, dan signifikansi hasil.' },
  { id: 'pakar', name: 'Dr. Pakar', role: 'Penguji Implikasi', desc: 'Fokus pada implikasi praktis dan penerapan di industri.' },
];

export const getCharacters = (req: Request, res: Response) => {
  res.json({ characters: CHARACTERS });
};

export const startSession = (req: Request, res: Response) => {
  const { characterId, topic } = req.body;
  const sessionId = Date.now().toString();
  sessions[sessionId] = { 
    id: sessionId,
    characterId, 
    topic, 
    messages: [], 
    score: 0 
  };
  res.json({ sessionId, message: 'Simulation started', session: sessions[sessionId] });
};

export const submitAnswer = async (req: Request, res: Response) => {
  const session_id = req.params.session_id as string;
  const { text } = req.body;
  
  if (!sessions[session_id]) return res.status(404).json({ error: 'Session not found' });
  
  const scoreGain = Math.floor(Math.random() * 20) + 70; // Mock score for now
  sessions[session_id].messages.push({ id: Date.now().toString(), sender: 'user', text });
  sessions[session_id].score += scoreGain;
  
  try {
    const aiResponse = await simulateExaminer(sessions[session_id].characterId, sessions[session_id].topic, text);
    const aiMsg = { id: Date.now().toString(), sender: 'ai', text: aiResponse };
    sessions[session_id].messages.push(aiMsg);
    
    res.json({ reply: aiMsg, feedback: { score: scoreGain, comment: 'Berdasarkan respons Anda.' } });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan respons AI' });
  }
};

export const getSessionDetails = (req: Request, res: Response) => {
  const session_id = req.params.session_id as string;
  if (!sessions[session_id]) return res.status(404).json({ error: 'Session not found' });
  res.json({ session: sessions[session_id] });
};

export const endSession = (req: Request, res: Response) => {
  const session_id = req.params.session_id as string;
  if (!sessions[session_id]) return res.status(404).json({ error: 'Session not found' });
  
  const msgCount = sessions[session_id].messages.filter((m: any) => m.sender === 'user').length;
  const finalScore = msgCount > 0 ? Math.round(sessions[session_id].score / msgCount) : 0;
  
  sessions[session_id].status = 'completed';
  sessions[session_id].finalScore = finalScore;
  
  res.json({ 
    finalScore, 
    report: 'Evaluasi akhir selesai.' 
  });
};
