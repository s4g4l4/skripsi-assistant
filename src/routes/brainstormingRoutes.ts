import { Router } from 'express';
import { generateIdeas, chatWithAI, getSessions, saveJudul } from '../controllers/brainstormingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/generate', generateIdeas);
router.post('/chat', chatWithAI);
router.get('/sessions', getSessions);
router.post('/save-judul', saveJudul);

export default router;
