import { Router } from 'express';
import { getUsers, getStats } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/stats', getStats);

export default router;
