import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import stopRoutes from './stop.routes.js';
import tripActivityRoutes from './tripActivity.routes.js';
import citiesRoutes from './cities.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Mount route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', stopRoutes);
router.use('/trip-activities', tripActivityRoutes);
router.use('/cities', citiesRoutes);
router.use('/admin', adminRoutes);

export default router;
