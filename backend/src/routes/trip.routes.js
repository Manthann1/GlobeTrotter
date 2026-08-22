import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getTripByShareToken } from '../controllers/trip.controller.js';
import { addStop } from '../controllers/stop.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public shared trip route (No auth required)
router.get('/shared/:token', getTripByShareToken);

// Protect all following trip endpoints with authentication middleware
router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.patch('/:id', updateTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Stop management under trip
router.post('/:tripId/stops', addStop);

export default router;
