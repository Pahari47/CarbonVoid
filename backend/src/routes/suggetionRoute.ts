import { Router } from "express";
import { SuggestionController } from "../controllers/suggetionController";

const router = Router();

// Fix: Wrap controller methods in proper middleware functions
router.post("/users/:userId/reports", (req, res) => SuggestionController.generateReport(req, res));
router.get("/users/:userId/reports", (req, res) => SuggestionController.getReports(req, res));

export default router;