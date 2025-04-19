import { Request, Response } from "express";
import { SuggestionService } from "../services/suggetionService";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const SuggestionController = {
  generateReport: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: "Invalid user ID format" });
      return;
    }
  
    try {
      const report = await SuggestionService.generateReport(userId);
      res.json(report);
    } catch (error: any) {
      console.error("Report generation failed:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({ 
        error: error.message || "Failed to generate report",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  getReports: async (req: Request, res: Response): Promise<void> => {
    try {
      const reports = await prisma.sustainabilityReport.findMany({
        where: { userId: req.params.userId },
        orderBy: { generatedAt: 'desc' }
      });
      res.json(reports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      res.status(500).json({ 
        error: "Failed to fetch reports",
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      });
    }
  }
};