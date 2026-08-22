import { Router } from 'express';
import healthRoutes from './health.routes.js';
import tripsRoutes from './trips.routes.js';
import citiesRoutes from './cities.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Mount route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripsRoutes);
router.use('/cities', citiesRoutes);

export default router;
