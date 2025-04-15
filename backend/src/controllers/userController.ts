import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserCreateSchema, UserUpdateSchema } from "../models/userModel";
import { z } from "zod";

// Create explicit types for request handlers
type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const UserController = {
  createUser: (async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = UserCreateSchema.parse(req.body);
      const user = await UserService.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  getUser: (async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await UserService.getUserWithActivities(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  updateUser: (async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = UserUpdateSchema.parse(req.body);
      const user = await UserService.updateUser(req.params.id, validatedData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  deleteUser: (async (req: Request, res: Response): Promise<void> => {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,
};