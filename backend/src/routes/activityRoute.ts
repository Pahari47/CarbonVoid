import { Router } from "express";
import { ActivityController } from "../controllers/activityController";

const router = Router();

router.post("/activities", ActivityController.createActivity);
router.get("/activities/:userId/footprint", ActivityController.getCarbonFootprint);
router.get("/activities/:userId/breakdown", ActivityController.getEmissionsBreakdown);
router.get("/activities/:id", ActivityController.getActivity);

export default router;