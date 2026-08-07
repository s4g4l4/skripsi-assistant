import { Router } from 'express';
import { analyzeData } from '../controllers/spssController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();
router.use(authenticate);

router.post('/analyze', uploadMiddleware, analyzeData);

export default router;
