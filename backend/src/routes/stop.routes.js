import { Router } from 'express';
import { deleteStop } from '../controllers/stop.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all stop endpoints with authentication middleware
router.use(authenticateToken);

router.delete('/:id', deleteStop);

export default router;
