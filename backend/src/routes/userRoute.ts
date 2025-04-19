import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// Clerk sync endpoint
router.post("/users/sync", UserController.syncUser);

// Standard CRUD endpoints
router.get("/users/:userId", UserController.getUser);
router.put("/users/:userId", UserController.updateUser);
router.delete("/users/:userId", UserController.deleteUser);

export default router;