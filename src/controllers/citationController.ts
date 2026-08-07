import { Request, Response } from 'express';
import { generateBibliography as aiGenerateBibliography } from '../services/aiService.js';

const citations: any[] = [];

export const createCitation = (req: Request, res: Response) => {
  const citation = { id: Date.now().toString(), ...req.body };
  citations.push(citation);
  res.status(201).json({ message: 'Citation added', citation });
};

export const getCitations = (req: Request, res: Response) => {
  res.json({ citations });
};

export const getCitationDetail = (req: Request, res: Response) => {
  const citation = citations.find(c => c.id === req.params.id);
  if (!citation) return res.status(404).json({ error: 'Citation not found' });
  res.json({ citation });
};

export const updateCitation = (req: Request, res: Response) => {
  const index = citations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Citation not found' });
  citations[index] = { ...citations[index], ...req.body };
  res.json({ message: 'Citation updated', citation: citations[index] });
};

export const deleteCitation = (req: Request, res: Response) => {
  const index = citations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Citation not found' });
  citations.splice(index, 1);
  res.json({ message: 'Citation deleted' });
};

export const generateBibliography = async (req: Request, res: Response) => {
  const { style, sources, citationIds } = req.body;
  const sourcesToFormat = sources && sources.length > 0
    ? sources
    : citations.filter(c => citationIds?.includes(c.id));
  
  if (!sourcesToFormat || sourcesToFormat.length === 0) {
    return res.status(400).json({ error: 'Tidak ada sumber referensi yang dipilih' });
  }

  const result = await aiGenerateBibliography(sourcesToFormat, style || 'APA 7th Edition');
  res.json({ message: 'Daftar Pustaka berhasil dibuat', ...result });
};

export const importFromScholar = (req: Request, res: Response) => {
  const { query } = req.body;
  // Mock Google Scholar import
  const imported = {
    id: Date.now().toString(),
    title: `Imported paper for query: ${query}`,
    authors: 'John Doe',
    year: 2023,
    source: 'Google Scholar'
  };
  citations.push(imported);
  res.status(201).json({ message: 'Citation imported from Google Scholar', citation: imported });
};

export const getStyles = (req: Request, res: Response) => {
  const styles = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'];
  res.json({ styles });
};
