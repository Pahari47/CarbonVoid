import { PrismaClient } from "@prisma/client";
import { UserCreateInput, UserUpdateInput, SafeUser } from "../models/userModel";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const UserService = {
  async createUser(data: UserCreateInput): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
    
    // Return user without password
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async getUserById(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { activities: true } // Include activities relationship
    });
    
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async updateUser(id: string, data: UserUpdateInput): Promise<SafeUser> {
    const updateData = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async deleteUser(id: string): Promise<void> {
    // Delete user's activities first (due to foreign key constraint)
    await prisma.activity.deleteMany({
      where: { userId: id }
    });
    
    await prisma.user.delete({
      where: { id }
    });
  },

  async getUserWithActivities(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Last 10 activities
        }
      }
    });
    
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
};