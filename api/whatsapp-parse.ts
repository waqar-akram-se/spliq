import { Type, GoogleGenAI } from "@google/genai";
import { getGeminiClient, parseRequestBody } from "./utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = parseRequestBody(req);
  if (!message) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  try {
    const ai: GoogleGenAI = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parse this expense description from a WhatsApp message and extract the transaction amount (as a raw floating point number, default to 0 if not specified), category, and a friendly clean item title. Standardize capitalization and correct minor spelling.

Message: "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "Transaction value as a number (e.g. 15.5)" },
            category: {
              type: Type.STRING,
              description: "Must be exactly one of: Groceries, Dining, Travel, Entertainment, Utilities, Shopping, Family, Miscellaneous",
            },
            description: { type: Type.STRING, description: "A elegant clean label like 'Starbucks Coffee' or 'Uber Ride'" },
          },
          required: ["amount", "category", "description"],
        },
      },
    });

    const text = response.text?.trim() || "{}";
    const parsedData = JSON.parse(text);
    res.json({ success: true, data: parsedData });
  } catch (e: any) {
    console.warn("AI parsing fell back to standard heuristic parsing:", e?.message || e);

    const cleanMessage = String(message).trim();
    const amountMatch = cleanMessage.match(/\$?(\d+(\.\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 25.0;

    let category = "Miscellaneous";
    const normalized = cleanMessage.toLowerCase();
    if (normalized.includes("grocer") || normalized.includes("market") || normalized.includes("food") || normalized.includes("whole foods")) {
      category = "Groceries";
    } else if (normalized.includes("lunch") || normalized.includes("dinner") || normalized.includes("cafe") || normalized.includes("coffee") || normalized.includes("uber eat") || normalized.includes("starbucks") || normalized.includes("restaurant") || normalized.includes("beer")) {
      category = "Dining";
    } else if (normalized.includes("uber") || normalized.includes("taxi") || normalized.includes("gas") || normalized.includes("flight") || normalized.includes("train") || normalized.includes("travel")) {
      category = "Travel";
    } else if (normalized.includes("movie") || normalized.includes("netflix") || normalized.includes("spotify") || normalized.includes("gaming") || normalized.includes("concert")) {
      category = "Entertainment";
    } else if (normalized.includes("bill") || normalized.includes("rent") || normalized.includes("power") || normalized.includes("electric") || normalized.includes("wifi")) {
      category = "Utilities";
    } else if (normalized.includes("clothes") || normalized.includes("shoe") || normalized.includes("amazon") || normalized.includes("shopping") || normalized.includes("gift")) {
      category = "Shopping";
    } else if (normalized.includes("family") || normalized.includes("kid") || normalized.includes("wife") || normalized.includes("daughter") || normalized.includes("household")) {
      category = "Family";
    }

    let desc = cleanMessage
      .replace(/\$?(\d+(\.\d{1,2})?)/g, "")
      .replace(/spent|for|on|bought|paid|dollar|bucks/gi, "")
      .replace(/[\s\-,]+/g, " ")
      .trim();

    if (!desc || desc.length < 2) {
      desc = category !== "Miscellaneous" ? `${category} Purchase` : "WhatsApp Expense";
    } else {
      desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }

    res.json({
      success: false,
      fallback: true,
      error: e?.message || "Unknown error",
      data: { amount, category, description: desc },
    });
  }
}
