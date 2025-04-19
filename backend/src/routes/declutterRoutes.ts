import express from 'express';
import { getDeclutterSuggestions } from '../controllers/declutterController';

const router = express.Router();

router.get('/declutter', getDeclutterSuggestions);

export default router;
