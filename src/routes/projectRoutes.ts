import { Router } from 'express';
import { createProject, getProjects, getProjectDetail, updateProject, deleteProject } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectDetail);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
