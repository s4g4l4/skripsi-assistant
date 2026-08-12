import { Router } from 'express';
import { register, login, socialLogin, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social-login', socialLogin);
router.get('/me', authenticate, getMe);

export default router;
