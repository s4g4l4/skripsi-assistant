import { Router } from 'express';
import { 
  getCharacters, 
  startSession, 
  submitAnswer, 
  getSessionDetails, 
  endSession 
} from '../controllers/simulationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/characters', getCharacters);

// Protected routes
router.use(authenticate);

router.post('/start', startSession);
router.post('/:session_id/answer', submitAnswer);
router.get('/:session_id', getSessionDetails);
router.post('/:session_id/end', endSession);

export default router;
