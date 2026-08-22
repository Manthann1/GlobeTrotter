import { Router } from 'express';
import healthRoutes from './health.routes.js';
import tripRoutes from './trip.routes.js';

const router = Router();

// Mount route modules
router.use('/health', healthRoutes);
router.use('/trips', tripRoutes);

export default router;
