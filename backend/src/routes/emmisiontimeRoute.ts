import { Router } from 'express';
import { getTimeBasedEmissions, getServiceWiseEmissions } from '../controllers/emissiontimeController';

const router = Router();

// Correct route registration
router.get('/:userId/emissions/services', getServiceWiseEmissions);
router.get('/:userId/emissions/:timeframe', getTimeBasedEmissions);


export default router;
