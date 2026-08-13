import { Router } from 'express';
import { generateAIToolResult } from '../controllers/aiToolsController';

const router = Router();

router.post('/generate', generateAIToolResult);

export default router;
