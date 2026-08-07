import { Request, Response } from 'express';
import { generateProposal as aiGenerateProposal } from '../services/aiService.js';

const proposals: any[] = [];
const jobs: any = {};

export const saveWizardData = (req: Request, res: Response) => {
  const { projectId, ...data } = req.body;
  proposals.push({ projectId, ...data });
  res.status(201).json({ message: 'Wizard data saved' });
};

export const generateProposal = async (req: Request, res: Response) => {
  const { projectId } = req.body;
  const jobId = Date.now().toString();
  jobs[jobId] = { status: 'processing' };
  
  res.json({ message: 'Proposal generation started', jobId });

  try {
    const proposalData = proposals.find(p => p.projectId === projectId) || req.body;
    const generatedContent = await aiGenerateProposal(proposalData);
    
    // Update proposal with generated content
    const existingIndex = proposals.findIndex(p => p.projectId === projectId);
    if (existingIndex !== -1) {
      proposals[existingIndex].generatedContent = generatedContent;
    } else {
      proposals.push({ projectId, generatedContent });
    }
    
    jobs[jobId].status = 'completed';
    jobs[jobId].result = generatedContent;
  } catch (error) {
    console.error('Error generating proposal:', error);
    jobs[jobId].status = 'error';
    jobs[jobId].error = 'Gagal menghasilkan proposal dari AI';
  }
};

export const getGenerationStatus = (req: Request, res: Response) => {
  const job_id = req.params.job_id as string;
  const job = jobs[job_id];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ status: job.status, result: job.result, error: job.error });
};

export const getProposalData = (req: Request, res: Response) => {
  const project_id = req.params.project_id as string;
  const proposal = proposals.find(p => p.projectId === project_id);
  if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
  res.json({ proposal });
};
