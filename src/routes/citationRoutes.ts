import { Router } from 'express';
import { 
  createCitation, 
  getCitations, 
  getCitationDetail,
  updateCitation, 
  deleteCitation,
  generateBibliography,
  importFromScholar,
  getStyles,
  searchEuropePmcHandler
} from '../controllers/citationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/styles', getStyles);
router.get('/europepmc/search', searchEuropePmcHandler);

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
