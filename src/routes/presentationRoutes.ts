import { Router } from 'express';
import { generatePresentation, getGenerationStatus, downloadPresentation, getSavedPresentations } from '../controllers/presentationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/generate', generatePresentation);
router.get('/status/:job_id', getGenerationStatus);
router.get('/download/:presentation_id', downloadPresentation);
router.get('/:project_id', getSavedPresentations);

export default router;
