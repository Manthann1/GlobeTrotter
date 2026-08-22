import { Router } from 'express';
import { deleteStop } from '../controllers/stop.controller.js';
import { addActivity } from '../controllers/tripActivity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all stop endpoints with authentication middleware
router.use(authenticateToken);

router.delete('/:id', deleteStop);

// Activity management under stop
router.post('/:stopId/activities', addActivity);

export default router;
