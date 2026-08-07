import { Request, Response } from 'express';
import { generatePresentation as aiGeneratePresentation } from '../services/aiService.js';

const presentations: any[] = [];
const jobs: any = {};

export const generatePresentation = async (req: Request, res: Response) => {
  const { projectId, source, chapters, template } = req.body;
  const jobId = Date.now().toString();
  jobs[jobId] = { status: 'processing' };
  
  res.json({ message: 'Presentation generation started', jobId });

  try {
    const pptContent = await aiGeneratePresentation({ source, chapters }, chapters);
    
    jobs[jobId].status = 'completed';
    jobs[jobId].result = pptContent;
    
    const presentation = {
      id: Date.now().toString(),
      projectId,
      source,
      template,
      status: 'Generated',
      downloadUrl: `/api/presentation/download/${Date.now()}`
    };
    presentations.push(presentation);
  } catch (error) {
    jobs[jobId].status = 'error';
    jobs[jobId].error = 'Gagal menghasilkan presentasi';
  }
};

export const getGenerationStatus = (req: Request, res: Response) => {
  const job_id = req.params.job_id as string;
  const job = jobs[job_id];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ status: job.status, result: job.result, error: job.error });
};

export const downloadPresentation = (req: Request, res: Response) => {
  const { presentation_id } = req.params;
  res.setHeader('Content-disposition', `attachment; filename=presentation_${presentation_id}.pptx`);
  res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.send('Mock PPTX content'); // Still mock actual PPTX generation because we don't have officegen setup
};

export const getSavedPresentations = (req: Request, res: Response) => {
  const project_id = req.params.project_id as string;
  const projectPresentations = presentations.filter(p => p.projectId === project_id);
  res.json({ presentations: projectPresentations });
};
