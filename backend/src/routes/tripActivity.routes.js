import { Router } from 'express';
import { deleteActivity } from '../controllers/tripActivity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all trip-activity endpoints with authentication middleware
router.use(authenticateToken);

router.delete('/:id', deleteActivity);

export default router;
