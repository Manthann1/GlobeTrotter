import { Router } from 'express';
import {
  getTrips,
  getTripById,
  getTripByShareToken,
  createTrip,
  deleteTrip,
} from '../controllers/trips.controller.js';

const router = Router();

router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);
router.get('/shared/:token', getTripByShareToken);

export default router;
