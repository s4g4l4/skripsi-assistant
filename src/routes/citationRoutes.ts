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
  searchEuropePmcHandler,
  searchUnifiedAcademic,
  scrapeAcademicUrl,
  vectorSearchHandler,
  mcpQueryHandler
} from '../controllers/citationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes (Search, Scraping & Bibliography generation)
router.get('/styles', getStyles);
router.get('/europepmc/search', searchEuropePmcHandler);
router.get('/search-unified', searchUnifiedAcademic);
router.post('/search-unified', searchUnifiedAcademic);
router.post('/scrape-url', scrapeAcademicUrl);
router.post('/vector-search', vectorSearchHandler);
router.post('/mcp-query', mcpQueryHandler);
router.post('/generate', generateBibliography);
router.post('/generate-bibliography', generateBibliography);

// Protected CRUD citation routes
router.use(authenticate);

router.post('/', createCitation);
router.get('/', getCitations);
router.get('/:id', getCitationDetail);
router.put('/:id', updateCitation);
router.delete('/:id', deleteCitation);
router.post('/import', importFromScholar);

export default router;
