import { Prisma, PrismaClient } from "@prisma/client";
import { ActivityCreateInput, ActivityUpdateInput } from "../models/activityModel";
import { calculateEmissions, validateStreamingResolution } from "../utils/emissionFactor";

const prisma = new PrismaClient();

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export class ActivityService {
  private prisma: PrismaClient;
  
  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  async createActivity(data: ActivityCreateInput) {
    try {
      validateStreamingResolution(data.service, data.resolution || undefined);
      
      const co2e = calculateEmissions({
        service: data.service,
        duration: data.duration,
        dataUsed: data.dataUsed,
        resolution: data.resolution as 'SD' | 'HD' | '4K' | undefined
      });

      return await this.prisma.$transaction(async (prisma) => {
        const activity = await prisma.activity.create({
          data: { 
            ...data, 
            co2e,
            resolution: data.resolution || null
          },
          include: { user: true }
        });

        await this.updateUserFootprintCache(data.userId, prisma);
        return activity;
      });
    } catch (error) {
      console.error('Activity creation failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create activity'
      );
    }
  }

  async getActivityById(id: string) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async getUserCarbonFootprint(userId: string) {
    try {
      const cached = await this.prisma.userFootprintCache.findUnique({ 
        where: { userId } 
      });
      
      return cached ? {
        totalCO2e: cached.totalCO2e,
        activityCount: cached.activityCount,
        lastUpdated: cached.updatedAt,
        isCached: true
      } : await this.calculateFreshFootprint(userId);
    } catch (error) {
      console.error('Failed to get carbon footprint:', error);
      throw new Error('Failed to calculate footprint');
    }
  }

  async getEmissionsBreakdown(userId: string, range: TimeRange = 'all') {
    try {
      const results = await this.prisma.activity.groupBy({
        by: ['service'],
        where: { 
          userId, 
          createdAt: this.getDateFilter(range) 
        },
        _sum: { 
          co2e: true, 
          duration: true, 
          dataUsed: true 
        }
      });

      const total = results.reduce((sum, item) => sum + (item._sum.co2e || 0), 0);
      
      return results.map(item => ({
        service: item.service,
        co2e: item._sum.co2e || 0,
        duration: item._sum.duration || 0,
        dataUsed: item._sum.dataUsed || 0,
        percentage: total > 0 ? (item._sum.co2e || 0) / total * 100 : 0
      }));
    } catch (error) {
      console.error('Failed to get emissions breakdown:', error);
      throw new Error('Failed to get breakdown');
    }
  }

  private async updateUserFootprintCache(
    userId: string, 
    prisma: Prisma.TransactionClient = this.prisma
  ) {
    const footprint = await this.calculateFreshFootprint(userId, prisma);
    await prisma.userFootprintCache.upsert({
      where: { userId },
      update: {
        totalCO2e: footprint.totalCO2e,
        activityCount: footprint.activityCount,
        updatedAt: new Date()
      },
      create: {
        userId,
        totalCO2e: footprint.totalCO2e,
        activityCount: footprint.activityCount
      }
    });
  }

  private async calculateFreshFootprint(
    userId: string, 
    prisma: Prisma.TransactionClient = this.prisma
  ) {
    const result = await prisma.activity.aggregate({
      where: { userId },
      _sum: { co2e: true },
      _count: { _all: true }
    });

    return {
      totalCO2e: result._sum.co2e || 0,
      activityCount: result._count._all,
      updatedAt: new Date(),
      isCached: false
    };
  }

  private getDateFilter(range: TimeRange): { gte: Date } {
    const now = new Date();
    const date = new Date(now);

    switch (range) {
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
      case 'all':
        return { gte: new Date(0) };
    }

    return { gte: date };
  }
}

export const activityService = new ActivityService();