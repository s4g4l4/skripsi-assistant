import { Request, Response } from 'express';

const users = [
  { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'User', email: 'user@example.com', role: 'user' }
];

export const getStatistics = (req: Request, res: Response) => {
  res.json({
    totalUsers: 1500,
    activeProjects: 340,
    generatedProposals: 1200
  });
};

export const getUsers = (req: Request, res: Response) => {
  res.json({ users });
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users[index] = { ...users[index], ...req.body };
  res.json({ message: 'User updated', user: users[index] });
};

export const getTemplates = (req: Request, res: Response) => {
  res.json({ 
    templates: [
      { id: '1', name: 'Template Standar', type: 'proposal' },
      { id: '2', name: 'Template Jurnal', type: 'format' }
    ] 
  });
};

export const getLogs = (req: Request, res: Response) => {
  res.json({ 
    logs: [
      { id: '1', action: 'User login', time: new Date().toISOString() },
      { id: '2', action: 'Generate proposal', time: new Date().toISOString() }
    ] 
  });
};
