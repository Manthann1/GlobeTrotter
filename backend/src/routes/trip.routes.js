import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getTripByShareToken } from '../controllers/trip.controller.js';
import { addStop } from '../controllers/stop.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public shared & public trip routes (No strict auth required)
router.get('/shared/:token', getTripByShareToken);
router.get('/public', getTrips);
router.get('/:id', optionalAuth, getTripById);

// Protect remaining trip write endpoints with authentication middleware
router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.patch('/:id', updateTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Stop management under trip
router.post('/:tripId/stops', addStop);

export default router;
