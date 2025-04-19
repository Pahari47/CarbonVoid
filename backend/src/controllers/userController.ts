import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserCreateInput, UserUpdateInput } from "../models/userModel";
import asyncHandler from "../utils/asynHandler";

export const UserController = {
  // Sync Clerk user data
  syncUser: asyncHandler(async (req: Request, res: Response) => {
    const { userId, email, name, password } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    
    const user = await UserService.syncUser({ userId, email, name, password });
    res.json(user);
  }),

  // Create new user with password
  createUser: asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body as UserCreateInput;
    const user = await UserService.createUser(userData);
    res.status(201).json(user);
  }),

  // Get user
  getUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUser(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }),

  // Update user
  updateUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateUser(
      req.params.userId, 
      req.body as UserUpdateInput
    );
    res.json(user);
  }),

  // Delete user
  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteUser(req.params.userId);
    res.status(204).end();
  }),

  // Login with email/password
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserService.verifyCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email
    });
  })
};