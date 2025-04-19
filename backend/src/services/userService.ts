import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UserData = {
  userId: string;
  email?: string | null;
  name?: string | null;
};

export const UserService = {
  async syncUser({ userId, email, name }: UserData) {
    const data = {
      userId,
      // Use empty string as fallback for required fields
      email: email || "",
      name: name || ""
    };
    
    return prisma.user.upsert({
      where: { userId },
      update: data,
      create: data
    });
  },

  async getUser(userId: string) {
    return prisma.user.findUnique({ 
      where: { userId },
      include: { activities: true }
    });
  },

  async updateUser(userId: string, data: { email?: string | null; name?: string | null }) {
    return prisma.user.update({
      where: { userId },
      data: {
        email: data.email || undefined, // Will skip update if undefined
        name: data.name || undefined
      }
    });
  },

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (user) {
      await prisma.activity.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { userId } });
    }
  }
};