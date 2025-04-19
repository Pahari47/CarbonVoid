import { PrismaClient } from "@prisma/client";
import { GeminiService } from "./geminiService";

const prisma = new PrismaClient();

async function analyzeUserData(userId: string) {
  // Verify user exists first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const [activities, footprint] = await Promise.all([
    prisma.activity.findMany({ where: { userId } }),
    prisma.userFootprintCache.findUnique({ where: { userId } })
  ]);

  const videoHours = activities
    .filter(a => ['youtube', 'netflix'].includes(a.service))
    .reduce((sum, a) => sum + (a.duration / 60), 0);

  const cloudStorageGB = activities
    .filter(a => a.service === 'google_drive')
    .reduce((sum, a) => sum + (a.dataUsed || 0), 0) / 1024;

  const activityBreakdown = activities.reduce((acc, a) => {
    if (!acc[a.service]) acc[a.service] = { hours: 0, dataGB: 0, sessions: 0 };
    acc[a.service].hours += a.duration / 60;
    acc[a.service].dataGB += (a.dataUsed || 0) / 1024;
    acc[a.service].sessions += 1;
    return acc;
  }, {} as Record<string, { hours: number; dataGB: number; sessions: number }>);

  const suggestions = await GeminiService.generateSuggestions({
    totalCO2e: footprint?.totalCO2e || 0,
    videoHours,
    cloudStorageGB,
    activityBreakdown
  });

  return {
    suggestions,
    metrics: {
      totalCO2e: footprint?.totalCO2e,
      videoHours,
      cloudStorageGB,
      activityBreakdown
    }
  };
}

export const SuggestionService = {
  async generateReport(userId: string) {
    const { metrics, suggestions } = await analyzeUserData(userId);
    
    return await prisma.sustainabilityReport.create({
      data: {
        userId,
        suggestions,
        metrics
      }
    });
  }
};