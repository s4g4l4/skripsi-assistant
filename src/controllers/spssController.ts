import { Request, Response } from 'express';
import { interpretSPSS } from '../services/aiService.js';

export const analyzeData = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Data file required' });
  
  const { analysisType } = req.body;
  
  // Here we'd typically parse the file to extract statistics,
  // Since we are mocking file parsing, we will pass a placeholder string to AI.
  const dummyResultData = `Hasil simulasi parsing file ${file.originalname} untuk analisis ${analysisType}.`;
  
  try {
    const interpretation = await interpretSPSS(dummyResultData);
    
    res.json({
      result: {
        type: analysisType,
        summary: interpretation,
        tables: [{ name: 'Extracted Statistics', data: [] }]
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menginterpretasi data' });
  }
};
