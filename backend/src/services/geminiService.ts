import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GeminiRequest {
  totalCO2e: number;
  videoHours: number;
  cloudStorageGB: number;
  activityBreakdown: Record<string, {
    hours: number;
    dataGB: number;
    sessions: number;
  }>;
}

function buildPrompt(data: GeminiRequest): string {
  return JSON.stringify({
    systemInstruction: "Generate 3-5 specific, actionable sustainability suggestions as a JSON string array.",
    userData: {
      totalCO2e: data.totalCO2e,
      videoHours: data.videoHours,
      cloudStorageGB: data.cloudStorageGB,
      activityBreakdown: data.activityBreakdown
    },
    requirements: {
      responseFormat: "array",
      maxItems: 5
    }
  });
}

function parseResponse(text: string): string[] {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response");
  }
}

function getFallbackSuggestions(data: GeminiRequest): string[] {
  const suggestions: string[] = [];
  
  if (data.videoHours > 5) {
    suggestions.push(`Reduce video streaming from ${data.videoHours.toFixed(1)} to 3 hours weekly`);
  }
  
  if (data.cloudStorageGB > 10) {
    suggestions.push(`Clean up ${Math.min(5, data.cloudStorageGB/2).toFixed(1)}GB of unused cloud files`);
  }
  
  return suggestions.length > 0 ? suggestions : 
    ["Your digital habits are environmentally friendly!"];
}

export const GeminiService = {
  async generateSuggestions(data: GeminiRequest): Promise<string[]> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest"
      });
      
      const result = await model.generateContent(buildPrompt(data));
      const response = await result.response;
      return parseResponse(response.text());
    } catch (error) {
      console.error("Gemini API Error:", error);
      return getFallbackSuggestions(data);
    }
  }
};