export interface TimeEmissionData {
    date: string;
    totalCO2e: number;
  }
  
  // Correct typing for Prisma groupBy response
  export interface ServiceEmission {
    service: string;
    _sum: {
      co2e: number | null; // Prisma returns null if no records
    };
  }