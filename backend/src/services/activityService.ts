import { PrismaClient } from "@prisma/client";
import { ActivityCreateInput, ActivityUpdateInput } from "../models/activityModel";

const prisma = new PrismaClient();

export const ActivityService = {
  async createActivity(data: ActivityCreateInput) {
    const activityData = {
      userId: data.userId,
      service: data.service,
      duration: data.duration,
      dataUsed: data.dataUsed,
      resolution: data.resolution || null,
    };

    return prisma.activity.create({
      data: activityData,
      include: { user: true }
    });
  },

  async getActivityById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: { user: true }
    });
  },

  async getActivitiesByUser(userId: string) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  async updateActivity(id: string, data: ActivityUpdateInput) {
    return prisma.activity.update({
      where: { id },
      data,
      include: { user: true }
    });
  },

  async deleteActivity(id: string) {
    return prisma.activity.delete({
      where: { id }
    });
  },

  async getUserActivitiesSummary(userId: string) {
    return prisma.activity.groupBy({
      by: ["service"],
      where: { userId },
      _sum: {
        duration: true,
        dataUsed: true
      },
      _count: {
        _all: true
      }
    });
  }
};