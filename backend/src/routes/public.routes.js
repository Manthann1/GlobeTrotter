import { Router } from 'express';
import { getTripByShareToken, copyTrip } from '../controllers/trip.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public read-only itinerary view (No auth required)
router.get('/trips/:shareToken', getTripByShareToken);

// Transactional deep-copy into requester's account (Auth required)
router.post('/trips/:shareToken/copy', authenticateToken, copyTrip);

export default router;
