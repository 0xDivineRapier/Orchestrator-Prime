import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const getAI = () => {
    // NOTE: In a real app, never expose keys on client. This is for the demo context.
    // The prompt instructs the user that the key is in process.env.API_KEY
    if (!process.env.API_KEY) {
        console.warn("API Key not found");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeTransactionRisk = async (transaction: Transaction): Promise<{ analysis: string; recommendedAction: string; fraudProbability: number }> => {
  const ai = getAI();
  if (!ai) return { analysis: "API Key missing.", recommendedAction: "Check Config", fraudProbability: 0 };

  const prompt = `
    You are a Senior Risk Analyst for a global Payment Service Provider.
    Analyze the following JSON transaction data for potential fraud or compliance risks.
    Consider the amount, currency, risk score, and payment method.
    
    Transaction Data:
    ${JSON.stringify(transaction, null, 2)}
    
    Provide:
    1. A brief analysis of risk factors (max 2 sentences).
    2. A recommended action (Approve, Review, Decline).
    3. An estimated fraud probability percentage (0-100).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            fraudProbability: { type: Type.NUMBER }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { analysis: "AI Analysis unavailable.", recommendedAction: "Manual Review", fraudProbability: transaction.riskScore };
  }
};

export const suggestRoutingOptimization = async (rules: string): Promise<string> => {
    const ai = getAI();
    if (!ai) return "AI Service Unavailable";

    const prompt = `
      You are a Payment Orchestration Architect.
      Review these routing rules and suggest one optimization to increase authorization rates or reduce cost.
      
      Current Rules:
      ${rules}
      
      Keep the suggestion concise (max 30 words).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "No optimization found.";
    } catch (e) {
        return "Optimization service offline.";
    }
};