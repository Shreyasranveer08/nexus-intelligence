import { GoogleGenerativeAI } from "@google/generative-ai";

export class QuotaExhaustedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExhaustedError";
  }
}

export async function generateWithFallback(
  modelName: string,
  prompt: string,
  responseMimeType: string = "text/plain"
): Promise<{ text: string, provider: string }> {
  
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_BACKUP;
  
  // 1. Primary Attempt
  if (primaryKey) {
    try {
      const genAI = new GoogleGenerativeAI(primaryKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), provider: "GEMINI_PRIMARY" };
    } catch (error: any) {
      if (error.message && (error.message.includes("429") || error.message.includes("503"))) {
        console.warn("[llmFallback] Primary Gemini key hit rate limit or 503. Attempting Backup Key...");
      } else {
        throw error;
      }
    }
  }

  // 2. Backup Attempt
  if (backupKey) {
    try {
      const genAI = new GoogleGenerativeAI(backupKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), provider: "GEMINI_BACKUP" };
    } catch (error: any) {
      if (error.message && (error.message.includes("429") || error.message.includes("503"))) {
        console.warn("[llmFallback] Backup Gemini key ALSO hit rate limit or 503.");
      } else {
        throw error;
      }
    }
  }

  // 3. Complete Failure
  throw new QuotaExhaustedError("All available Gemini API keys have exhausted their daily quota limit or returned temporary errors.");
}
