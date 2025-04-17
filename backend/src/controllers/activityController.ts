import { Request, Response } from "express";
import { activityService } from "../services/activityService";
import { ActivityCreateSchema } from "../models/activityModel";
import { z } from "zod";

export const ActivityController = {
  async createActivity(req: Request, res: Response) {
    try {
      const data = ActivityCreateSchema.parse(req.body);
      const activity = await activityService.createActivity(data);
      res.status(201).json(activity);
    } catch (error) {
      error instanceof z.ZodError 
        ? res.status(400).json({ error: "Validation failed", details: error.errors })
        : res.status(500).json({ error: "Failed to create activity" });
    }
  },

  async getCarbonFootprint(req: Request, res: Response) {
    try {
      res.json(await activityService.getUserCarbonFootprint(req.params.userId));
    } catch {
      res.status(500).json({ error: "Failed to calculate footprint" });
    }
  },

  async getEmissionsBreakdown(req: Request, res: Response) {
    try {
      const range = req.query.range as 'day' | 'week' | 'month' | 'year' | 'all' || 'all';
      res.json(await activityService.getEmissionsBreakdown(req.params.userId, range));
    } catch {
      res.status(500).json({ error: "Failed to get breakdown" });
    }
  },

  async getActivity(req: Request, res: Response) {
    try {
      const activity = await activityService.getActivityById(req.params.id);
      activity ? res.json(activity) : res.status(404).json({ error: "Not found" });
    } catch {
      res.status(500).json({ error: "Failed to get activity" });
    }
  }
};