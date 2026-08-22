import { Router } from 'express';
import { getCities, getCityById } from '../controllers/cities.controller.js';

const router = Router();

router.get('/', getCities);
router.get('/:id', getCityById);

export default router;
