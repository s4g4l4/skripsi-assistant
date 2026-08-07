import { Request, Response } from 'express';
import { brainstormJudul, chatConsultation } from '../services/aiService.js';

const sessions: any[] = [];
const savedJuduls: any[] = [];

export const generateIdeas = async (req: Request, res: Response) => {
  try {
    const { topic, keywords, field } = req.body;
    
    const suggestions = await brainstormJudul(topic, keywords, field);
    
    const session = { id: Date.now().toString(), topic, date: new Date().toISOString() };
    sessions.push(session);
    
    res.json({ suggestions, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat ide judul' });
  }
};

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    const reply = await chatConsultation(history, message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Gagal berkonsultasi' });
  }
};

export const getSessions = (req: Request, res: Response) => {
  res.json({ sessions });
};

export const saveJudul = (req: Request, res: Response) => {
  const { title } = req.body;
  savedJuduls.push({ id: Date.now().toString(), title });
  res.json({ message: 'Judul berhasil disimpan', title });
};
