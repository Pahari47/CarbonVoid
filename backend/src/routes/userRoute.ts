import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// Now these will work perfectly with TypeScript
router.post("/create", UserController.createUser);
router.get("/users/:id", UserController.getUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;