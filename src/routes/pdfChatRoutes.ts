import { Router } from 'express';
import { upload } from '../config/multer.js';
import {
  uploadAndIndexPdf,
  parseGuidebook,
  chatPdf,
  extractCitations,
  getHighlights,
  getDocuments,
  getDocumentDetails
} from '../controllers/pdfChatController.js';

const router = Router();

router.get('/documents', getDocuments);
router.get('/documents/:id', getDocumentDetails);
router.post('/upload', upload.single('pdf'), uploadAndIndexPdf);
router.post('/parse-guidebook', upload.single('guidebook'), parseGuidebook);
router.post('/chat', chatPdf);
router.post('/extract-citations', extractCitations);
router.get('/highlights/:docId', getHighlights);

export default router;
