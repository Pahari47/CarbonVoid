export const ACTIVITY_SERVICES = [
  "youtube",
  "netflix", 
  "spotify",
  "google_drive",
  "web_browsing"
] as const;

export const STREAMING_SERVICES = ["youtube", "netflix"] as const;

type ActivityService = typeof ACTIVITY_SERVICES[number];
type StreamingQuality = 'SD' | 'HD' | '4K';

interface ActivityInput {
  service: ActivityService;
  duration: number;
  dataUsed?: number;
  resolution?: StreamingQuality;
}

export const EMISSION_FACTORS = {
  streaming: {
    youtube: { HD: 0.46, SD: 0.23, "4K": 1.52 },
    netflix: { HD: 0.42, SD: 0.21, "4K": 1.38 },
    spotify: { audio: 0.025 },
  },
  dataTransfer: 0.39,
  browsing: {
    average: 0.18,
    socialMedia: 0.25,
    search: 0.2,
  }
} as const;

export function calculateEmissions(activity: ActivityInput): number {
  if (STREAMING_SERVICES.includes(activity.service as any)) {
    if (!activity.resolution) {
      throw new Error(`Resolution required for ${activity.service}`);
    }
  }

  let co2e = 0;
  
  switch (activity.service) {
    case 'youtube':
    case 'netflix':
      const quality = activity.resolution || 'HD';
      co2e = EMISSION_FACTORS.streaming[activity.service][quality] * activity.duration;
      break;
    case 'spotify':
      co2e = EMISSION_FACTORS.streaming.spotify.audio * activity.duration;
      break;
    case 'google_drive':
      co2e = (activity.dataUsed || 0) * EMISSION_FACTORS.dataTransfer;
      break;
    case 'web_browsing':
      co2e = EMISSION_FACTORS.browsing.average * activity.duration;
      break;
  }
  
  return parseFloat(co2e.toFixed(2));
}

export function validateStreamingResolution(
  service: string, 
  resolution?: string
): asserts resolution is 'SD' | 'HD' | '4K' {
  if (STREAMING_SERVICES.includes(service as any) && !resolution) {
    throw new Error(`Resolution required for ${service}`);
  }
}