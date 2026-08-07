import { Router } from 'express';
import { saveWizardData, generateProposal, getGenerationStatus, getProposalData } from '../controllers/proposalController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/wizard', saveWizardData);
router.post('/generate', generateProposal);
router.get('/status/:job_id', getGenerationStatus);
router.get('/:project_id', getProposalData);

export default router;
