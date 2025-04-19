import { Router } from 'express';
import { getActivityStats } from '../controllers/activitystateController';

const router = Router();

router.get('/activity-stats/:userId', getActivityStats);

export default router;