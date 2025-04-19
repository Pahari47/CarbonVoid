export interface SustainabilityMetrics {
    totalCO2e: number;
    videoHours: number;
    cloudStorageGB: number;
    activityBreakdown: Record<string, {
      hours: number;
      dataGB: number;
      sessions: number;
    }>;
  }
  
  export interface SustainabilityReport {
    id: string;
    userId: string;
    generatedAt: Date;
    suggestions: string[];
    metrics: SustainabilityMetrics;
  }