import { Router } from 'express';
import multer from 'multer';
import {
  uploadAndIndexPdf,
  chatPdf,
  extractCitations,
  getHighlights,
  getDocuments,
  getDocumentDetails
} from '../controllers/pdfChatController.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/documents', getDocuments);
router.get('/documents/:id', getDocumentDetails);
router.post('/upload', upload.single('pdf'), uploadAndIndexPdf);
router.post('/chat', chatPdf);
router.post('/extract-citations', extractCitations);
router.get('/highlights/:docId', getHighlights);

export default router;
