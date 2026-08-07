import { Router } from 'express';
import { 
  saveChapter, 
  getChapter, 
  rewriteText, 
  paraphraseText, 
  checkGrammar, 
  checkPlagiarism, 
  autoSave 
} from '../controllers/editorController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.put('/save', saveChapter);
router.get('/chapter/:project_id/:bab_ke', getChapter);
router.post('/rewrite', rewriteText);
router.post('/paraphrase', paraphraseText);
router.post('/grammar-check', checkGrammar);
router.post('/plagiarism-check', checkPlagiarism);
router.post('/auto-save', autoSave);

export default router;
