import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getTimeRange } from '../utils/time';
import asyncHandler from '../utils/asynHandler';

const prisma = new PrismaClient();

export const getTimeBasedEmissions = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const { timeframe } = req.query as { timeframe: 'week' | 'month' | 'year' };
  const { start, end } = getTimeRange(timeframe);

  console.log('Query Parameters:', {
    userId,
    timeframe,
    start: start.toISOString(),
    end: end.toISOString()
  });

  try {
    const emissions = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt" AT TIME ZONE 'UTC') as date,
        SUM("co2e") as "totalCO2e"
      FROM "Activity"
      WHERE 
        "userId"::text = ${userId} AND
        "createdAt" BETWEEN ${start.toISOString()}::timestamp AND ${end.toISOString()}::timestamp
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    console.log('Query Results:', emissions);
    res.json(emissions);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Database Error:', errorMessage);
    res.status(500).json({ 
      error: 'Internal server error',
      details: errorMessage 
    });
  }
});

export const getServiceWiseEmissions = asyncHandler(async (req, res) => {
  console.log('--- EXECUTING SERVICE WISE FUNCTION ---'); // Unique marker
  
  const { userId } = req.params;
  console.log('Service-wise userId:', userId); // Verify parameter
  
  const result = await prisma.activity.groupBy({
    by: ['service'],
    where: { userId },
    _sum: { co2e: true },
  });
  
  console.log('Raw service-wise results:', result); // Verify raw data
  
  res.json({
    endpoint: 'service-wise', // Unique identifier
    data: result.map(r => ({
      service: r.service,
      co2e: r._sum.co2e
    }))
  });
});