import { Router } from "express";
import { ActivityController } from "../controllers/activityController";

const router = Router();

router.post("/goingon", ActivityController.createActivity);
router.get("/activities/:id", ActivityController.getActivity);
router.get("/users/:userId/activities", ActivityController.getActivitiesByUser);
router.put("/activities/:id", ActivityController.updateActivity);
router.delete("/activities/:id", ActivityController.deleteActivity);

export default router;