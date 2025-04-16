import { PrismaClient } from "@prisma/client";
import { ActivityCreateInput, ActivityUpdateInput } from "../models/activityModel";
import { calculateEmissions } from "../utils/emissionFactor";

const prisma = new PrismaClient();

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export class ActivityService {
  async createActivity(data: ActivityCreateInput) {
    const co2e = calculateEmissions(data);
    const activity = await prisma.activity.create({
      data: { ...data, co2e, resolution: data.resolution || null },
      include: { user: true }
    });
    await this.updateUserFootprintCache(data.userId);
    return activity;
  }

  async getActivityById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async getUserCarbonFootprint(userId: string) {
    const cached = await prisma.userFootprintCache.findUnique({ where: { userId } });
    return cached ? {
      totalCO2e: cached.totalCO2e,
      activityCount: cached.activityCount,
      lastUpdated: cached.updatedAt,
      isCached: true
    } : this.calculateFreshFootprint(userId);
  }

  async getEmissionsBreakdown(userId: string, range: TimeRange = 'all') {
    const results = await prisma.activity.groupBy({
      by: ['service'],
      where: { userId, createdAt: this.getDateFilter(range) },
      _sum: { co2e: true, duration: true, dataUsed: true }
    });

    const total = results.reduce((sum, item) => sum + (item._sum.co2e || 0), 0);
    return results.map(item => ({
      service: item.service,
      co2e: item._sum.co2e || 0,
      duration: item._sum.duration || 0,
      dataUsed: item._sum.dataUsed || 0,
      percentage: total > 0 ? (item._sum.co2e || 0) / total * 100 : 0
    }));
  }

  private async updateUserFootprintCache(userId: string) {
    const footprint = await this.calculateFreshFootprint(userId);
    await prisma.userFootprintCache.upsert({
      where: { userId },
      update: footprint,
      create: { userId, ...footprint }
    });
  }

  private async calculateFreshFootprint(userId: string) {
    const result = await prisma.activity.aggregate({
      where: { userId },
      _sum: { co2e: true },
      _count: { _all: true }
    });
    return {
      totalCO2e: result._sum.co2e || 0,
      activityCount: result._count._all,
      lastUpdated: new Date(),
      isCached: false
    };
  }

  private getDateFilter(range: TimeRange) {
    const now = new Date();
    const filters = {
      day: () => new Date(now.setDate(now.getDate() - 1)),
      week: () => new Date(now.setDate(now.getDate() - 7)),
      month: () => new Date(now.setMonth(now.getMonth() - 1)),
      year: () => new Date(now.setFullYear(now.getFullYear() - 1)),
      all: () => new Date(0)
    };
    return { gte: filters[range]() };
  }
}

export const activityService = new ActivityService();