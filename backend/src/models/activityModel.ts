import { z } from "zod";
import { ACTIVITY_SERVICES } from "../utils/emissionFactor";

export const ResolutionEnum = z.enum(["SD", "HD", "4K"]);
export type ResolutionType = z.infer<typeof ResolutionEnum>;
export const ServiceEnum = z.enum(ACTIVITY_SERVICES);
export type ServiceType = z.infer<typeof ServiceEnum>;

export const ActivityBaseSchema = z.object({
  userId: z.string().uuid(),
  service: ServiceEnum,
  duration: z.number().int().positive().max(1440),
  dataUsed: z.number().positive().max(10240),
  resolution: ResolutionEnum.optional()
});

export const ActivityCreateSchema = ActivityBaseSchema.refine(data => 
  ["youtube", "netflix"].includes(data.service) ? !!data.resolution : true, {
    message: "Resolution required for streaming services",
    path: ["resolution"]
});

export const ActivityUpdateSchema = z.object({
  duration: z.number().int().positive().max(1440).optional(),
  dataUsed: z.number().positive().max(10240).optional(),
  resolution: ResolutionEnum.optional()
});

export type ActivityCreateInput = z.infer<typeof ActivityCreateSchema>;
export type ActivityUpdateInput = z.infer<typeof ActivityUpdateSchema>;

export type ActivityResponse = {
  id: string;
  userId: string;
  service: ServiceType;
  duration: number;
  dataUsed: number;
  resolution?: ResolutionType;
  co2e: number;
  createdAt: Date;
  updatedAt?: Date;
  carbonEquivalent?: {
    trees: number;
    kilometers: number;
  };
};

export function toActivityResponse(activity: ActivityCreateInput & { 
  id: string; co2e: number; createdAt: Date 
}): ActivityResponse {
  return {
    ...activity,
    carbonEquivalent: {
      trees: parseFloat((activity.co2e / 21000).toFixed(3)),
      kilometers: parseFloat((activity.co2e / 404).toFixed(2))
    }
  };
}