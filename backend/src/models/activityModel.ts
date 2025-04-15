import { z } from "zod";

export const ActivityCreateSchema = z.object({
  userId: z.string().uuid(),
  service: z.enum(["youtube", "netflix", "spotify", "google_drive", "web_browsing"]),
  duration: z.number().int().positive(),
  dataUsed: z.number().positive(), // Made required here
  resolution: z.enum(["SD", "HD", "4K"]).optional(),
});

export const ActivityUpdateSchema = z.object({
  duration: z.number().int().positive().optional(),
  dataUsed: z.number().positive().optional(),
  resolution: z.enum(["SD", "HD", "4K"]).optional(),
});

export type ActivityCreateInput = z.infer<typeof ActivityCreateSchema>;
export type ActivityUpdateInput = z.infer<typeof ActivityUpdateSchema>;