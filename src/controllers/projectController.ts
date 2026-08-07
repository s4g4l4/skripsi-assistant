import { Request, Response } from 'express';

// Mock database
const projects: any[] = [];

export const createProject = (req: Request, res: Response) => {
  const project = { id: Date.now().toString(), ...req.body };
  projects.push(project);
  res.status(201).json({ message: 'Project created', project });
};

export const getProjects = (req: Request, res: Response) => {
  res.json({ projects });
};

export const getProjectDetail = (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
};

export const updateProject = (req: Request, res: Response) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  projects[index] = { ...projects[index], ...req.body };
  res.json({ message: 'Project updated', project: projects[index] });
};

export const deleteProject = (req: Request, res: Response) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  projects.splice(index, 1);
  res.json({ message: 'Project deleted' });
};
