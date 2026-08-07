import { Router } from 'express';
import { autoFormat, getHistory } from '../controllers/formatController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);

router.post('/auto-format', uploadMiddleware, autoFormat);
router.get('/history', getHistory);

export default router;
