import { Router } from 'express';
import { ReportController } from '../controllers/reportController';

const router = Router();

router.get('/:userId', ReportController.getCarbonReport);
router.get('/:userId/pdf', ReportController.downloadPDFReport);

export default router;