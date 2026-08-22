import { Router } from 'express';
import { getUsers, getStats } from '../controllers/admin.controller.js';

const router = Router();

router.get('/users', getUsers);
router.get('/stats', getStats);

export default router;
