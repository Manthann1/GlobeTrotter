import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Mount route modules
router.use('/health', healthRoutes);

export default router;
