import { Router } from 'express';
import { 
  createCitation, 
  getCitations, 
  getCitationDetail,
  updateCitation, 
  deleteCitation,
  generateBibliography,
  importFromScholar,
  getStyles
} from '../controllers/citationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/styles', getStyles);

// Protected routes
router.use(authenticate);

router.post('/', createCitation);
router.get('/', getCitations);
router.get('/:id', getCitationDetail);
router.put('/:id', updateCitation);
router.delete('/:id', deleteCitation);
router.post('/generate', generateBibliography);
router.post('/import', importFromScholar);

export default router;
