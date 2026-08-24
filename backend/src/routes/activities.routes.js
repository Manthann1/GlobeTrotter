import { Router } from 'express';
import { getActivities } from '../controllers/activities.controller.js';

const router = Router();

router.get('/', getActivities);

export default router;
