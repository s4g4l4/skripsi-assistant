import { Request, Response } from 'express';

const history: any[] = [];

export const autoFormat = (req: Request, res: Response) => {
  const { univ, settings } = req.body;
  const file = req.file;
  
  if (!file) return res.status(400).json({ error: 'File is required' });
  
  const result = { id: Date.now().toString(), fileName: file.originalname, univ, status: 'Completed', date: new Date().toISOString() };
  history.push(result);
  
  res.json({ message: 'Document formatted successfully', result });
};

export const getHistory = (req: Request, res: Response) => {
  res.json({ history });
};
