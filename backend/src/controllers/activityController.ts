import { Request, Response } from "express";
import { ActivityService } from "../services/activityService";
import { ActivityCreateSchema, ActivityUpdateSchema } from "../models/activityModel";
import { z } from "zod";

// Define the proper async handler type
type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const ActivityController = {
  createActivity: (async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = ActivityCreateSchema.parse(req.body);
      const activity = await ActivityService.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  getActivity: (async (req: Request, res: Response): Promise<void> => {
    try {
      const activity = await ActivityService.getActivityById(req.params.id);
      if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return;
      }
      res.json(activity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  updateActivity: (async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = ActivityUpdateSchema.parse(req.body);
      const activity = await ActivityService.updateActivity(req.params.id, validatedData);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  deleteActivity: (async (req: Request, res: Response): Promise<void> => {
    try {
      await ActivityService.deleteActivity(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,

  // by user id
  getActivitiesByUser: (async (req: Request, res: Response): Promise<void> => {
    try {
      const activities = await ActivityService.getActivitiesByUser(req.params.userId);
      res.json(activities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as AsyncRequestHandler,
};