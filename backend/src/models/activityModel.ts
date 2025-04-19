import { z } from "zod";
import { ACTIVITY_SERVICES, STREAMING_SERVICES, EMISSION_FACTORS } from "../utils/emissionFactor";

export const ResolutionEnum = z.enum(["SD", "HD", "4K"]);
export type ResolutionType = z.infer<typeof ResolutionEnum>;
export const ServiceEnum = z.enum(ACTIVITY_SERVICES);
export type ServiceType = z.infer<typeof ServiceEnum>;

export const ActivityBaseSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  service: ServiceEnum,
  duration: z.number().int("Must be whole minutes")
            .positive("Must be positive")
            .max(1440, "Cannot exceed 24 hours"),
  dataUsed: z.number().positive("Must be positive")
             .max(10240, "Cannot exceed 10TB"),
  resolution: ResolutionEnum.optional()
            .describe("Required for video streaming services")
});

export const ActivityCreateSchema = ActivityBaseSchema.refine(data => 
  STREAMING_SERVICES.includes(data.service as any) ? !!data.resolution : true, 
  {
    message: "Resolution required for video streaming services",
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
  emissionsDetails?: {
    factorUsed: number;
    calculationMethod: string;
  };
};

export function toActivityResponse(activity: ActivityCreateInput & { 
  id: string; co2e: number; createdAt: Date 
}): ActivityResponse {
  const isStreaming = STREAMING_SERVICES.includes(activity.service as any);
  const factorUsed = isStreaming 
    ? EMISSION_FACTORS.streaming[activity.service as 'youtube' | 'netflix'][activity.resolution || 'HD']
    : activity.service === 'spotify'
      ? EMISSION_FACTORS.streaming.spotify.audio
      : EMISSION_FACTORS.dataTransfer;

  return {
    ...activity,
    carbonEquivalent: {
      trees: parseFloat((activity.co2e / 21000).toFixed(3)),
      kilometers: parseFloat((activity.co2e / 404).toFixed(2))
    },
    ...(process.env.NODE_ENV === 'development' && {
      emissionsDetails: {
        factorUsed,
        calculationMethod: isStreaming 
          ? 'video-streaming' 
          : activity.service === 'spotify'
            ? 'audio-streaming'
            : 'data-transfer'
      }
    })
  };
}