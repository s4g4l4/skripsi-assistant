import { Router } from 'express';
import { getStatistics, getUsers, updateUser, getTemplates, getLogs } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Middleware to check if user is admin should be added here
router.use(authenticate); 

router.get('/statistics', getStatistics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/templates', getTemplates);
router.get('/logs', getLogs);

export default router;
