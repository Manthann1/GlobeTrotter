import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getTripByShareToken, getTripBudget, shareTrip } from '../controllers/trip.controller.js';
import { addStop, updateStop } from '../controllers/stop.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public shared & public trip routes (No strict auth required)
router.get('/shared/:token', getTripByShareToken);
router.get('/public', getTrips);
router.get('/:id', optionalAuth, getTripById);
router.get('/:id/budget', optionalAuth, getTripBudget);

// Protect remaining trip write endpoints with authentication middleware
router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.patch('/:id', updateTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/share', shareTrip);

// Stop management under trip
router.post('/:tripId/stops', addStop);
router.patch('/:tripId/stops/:stopId', updateStop);

export default router;

