import { PrismaClient, User } from "@prisma/client";
import { hashPassword, verifyPassword } from "../models/userModel";
import { UserCreateInput, UserUpdateInput } from "../models/userModel";

const prisma = new PrismaClient();

type UserData = {
  userId: string;
  email?: string | null;
  name?: string | null;
  password?: string | null;
};

export const UserService = {
  async syncUser({ userId, email, name, password }: UserData): Promise<User> {
    // Create base data without password
    const baseData = {
      userId,
      email: email || "",
      name: name || ""
    };

    // Use type assertion for the create/update data
    const operationData = {
      ...baseData,
      ...(password && { password: await hashPassword(password) })
    } as unknown as User; // Type assertion to bypass strict typing

    return prisma.user.upsert({
      where: { userId },
      update: operationData,
      create: operationData
    });
  },

  async createUser(data: UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        userId: data.email,
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password)
      }
    });
  },

  async getUser(userId: string): Promise<User | null> {
    return prisma.user.findUnique({ 
      where: { userId },
      include: { activities: true }
    });
  },

  async updateUser(userId: string, data: UserUpdateInput): Promise<User> {
    // Prepare update data with proper typing
    const updateData: Partial<User> & {
      password?: string;
    } = {
      ...(data.email && { email: data.email }),
      ...(data.name && { name: data.name }),
      ...(data.password && { password: await hashPassword(data.password) })
    };

    return prisma.user.update({
      where: { userId },
      data: updateData
    });
  },

  async deleteUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (user) {
      await prisma.activity.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { userId } });
    }
  },

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;
    
    const isValid = await verifyPassword(password, user.password);
    return isValid ? user : null;
  }
};