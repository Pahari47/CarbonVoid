import { z } from "zod";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Enhanced schema with password requirements
export const UserCreateSchema = z.object({
  userId: z.string().optional(), // Made optional for flexibility
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;

export type SafeUser = Omit<UserCreateInput, 'password'> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Enhanced password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};