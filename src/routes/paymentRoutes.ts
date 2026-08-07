import { Router } from 'express';
import { getPlans, subscribe, webhook, getInvoices } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getPlans);
router.post('/webhook', webhook);

router.use(authenticate);
router.post('/subscribe', subscribe);
router.get('/invoice', getInvoices);

export default router;
