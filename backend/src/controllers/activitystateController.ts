import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import asyncHandler from '../utils/asynHandler';

const prisma = new PrismaClient();

// Input validation schema
const userIdSchema = z.object({
  userId: z.string().uuid(),
});

// Type for the response
type ActivityStatsResponse = {
  success: boolean;
  data?: {
    totalCO2e: number;
    totalDuration: number;
    totalDataUsed: number;
    activityCount: number;
    lastUpdated?: string;
  };
  error?: string;
};

/**
 * @route GET /api/activity-stats/:userId
 * @desc Get activity statistics (CO2e, duration, data usage) for a specific user
 * @access Private (assuming this needs authentication)
 */
export const getActivityStats = asyncHandler(async (req: Request, res: Response<ActivityStatsResponse>) => {
  // Validate the userId parameter
  const { userId } = userIdSchema.parse({
    userId: req.params.userId,
  });

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExists) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Try to get data from cache first
  const cachedData = await prisma.userFootprintCache.findUnique({
    where: { userId },
  });

  if (cachedData) {
    // For cached data, we only have CO2e and count, so we need to get duration and data usage separately
    const activityAggregates = await prisma.activity.aggregate({
      where: { userId },
      _sum: {
        duration: true,
        dataUsed: true,
      },
    });

    return res.json({
      success: true,
      data: {
        totalCO2e: cachedData.totalCO2e,
        totalDuration: activityAggregates._sum.duration || 0,
        totalDataUsed: activityAggregates._sum.dataUsed || 0,
        activityCount: cachedData.activityCount,
        lastUpdated: cachedData.updatedAt.toISOString(),
      },
    });
  }

  // If no cache, calculate everything from activities
  const activityAggregates = await prisma.activity.aggregate({
    where: { userId },
    _sum: {
      co2e: true,
      duration: true,
      dataUsed: true,
    },
    _count: true,
  });

  res.json({
    success: true,
    data: {
      totalCO2e: activityAggregates._sum.co2e || 0,
      totalDuration: activityAggregates._sum.duration || 0,
      totalDataUsed: activityAggregates._sum.dataUsed || 0,
      activityCount: activityAggregates._count || 0,
    },
  });
});

// Error handling middleware should be added at the app level