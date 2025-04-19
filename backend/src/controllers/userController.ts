import { Request, Response } from "express";
import { UserService } from "../services/userService";
import asyncHandler from "../utils/asynHandler";

export const UserController = {
  // Sync Clerk user data
  syncUser: asyncHandler(async (req: Request, res: Response) => {
    const { userId, email, name } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    
    const user = await UserService.syncUser({ userId, email, name });
    res.json(user);
  }),

  // Standard CRUD
  getUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUser(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateUser(req.params.userId, req.body);
    res.json(user);
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteUser(req.params.userId);
    res.status(204).end();
  })
};