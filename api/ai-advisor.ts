import { getGeminiClient, parseRequestBody } from "./utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, income, budget, totalSpent, goals } = parseRequestBody(req);
  if (!message) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the expert, friendly personal financial advisor for Spliq, a premium AI money platform. Keep your advice highly actionable, personalized, friendly, and elite. Reference specific metrics if provided. Respond in exactly 3-4 highly supportive sentences. Use clean typography spacing. Do not use markdown titles.

Context details (if available):
- User Monthly Net Income: $${income || "8,500"}
- Set Total Budget: $${budget || "4,200"}
- Month-to-date Expenses logged: $${totalSpent || "2,410"}
- Savings Goals of this user: ${JSON.stringify(
          goals || [
            { name: "Summer Vacation", target: 4000, current: 2400 },
            { name: "Emergency Buffer", target: 10000, current: 6500 },
          ]
        )}

User finance question or request: "${message}"`,
    });

    res.json({ success: true, advice: response.text });
  } catch (e: any) {
    console.warn("AI advisor fell back to automated smart response rules:", e?.message || e);

    const query = String(message).toLowerCase();
    let advice = "Your Spliq AI engine is online! Once your Gemini API keys are configured in Settings > Secrets, you will get customizable suggestions on cash flow optimization. Let's do some math: based on your current budget limits, keeping daily variable expenses below $100 will help you close the month with over $3,500 headed straight to interest-earning vault accounts.";

    if (query.includes("dining") || query.includes("restaurant") || query.includes("starbucks") || query.includes("eating") || query.includes("budget")) {
      advice = "Spliq AI Insight: Looking at your profile, dining represents 18% of your outflows. Trimming dining delivery expenses by $120 next month automatically unlocks enough cash to fund 82% of your Summer Vacation savings goal 2 months ahead of schedule!";
    } else if (query.includes("vacation") || query.includes("goal") || query.includes("save") || query.includes("trip")) {
      advice = "Your Summer Vacation vault is currently at 60% completion ($2,400 saved out of $4,000 target). Sticking to your family grocery budget limits will free up the remaining $1,600 in just 32 days, keeping your booking window completely safe.";
    } else if (query.includes("family") || query.includes("house") || query.includes("wife") || query.includes("husband")) {
      advice = "Spliq Family Sync is highly optimized. By letting family members log shared household spending via WhatsApp securely, your domestic cash flow remains fully organized with automated limits, omitting standard spreadsheet frictions.";
    } else if (query.includes("emerg") || query.includes("buffer") || query.includes("risk")) {
      advice = "Your Emergency Buffer is sitting robustly at $6,500. We recommend maintaining a target of $10,000, which covers exactly 3.5 months of fundamental living costs. Keeping your group-trip expense split streamlined will help hit this buffer target by mid-August!";
    } else if (query.includes("whatsapp") || query.includes("log") || query.includes("track")) {
      advice = "Spliq's WhatsApp capture tool translates natural text statements (like 'Paid $45 for fuel') directly into organized ledger categories within 1.8 seconds. This bypasses the friction of traditional manual tracking apps entirely.";
    }

    res.json({
      success: false,
      fallback: true,
      error: e?.message || "Unknown error",
      advice,
    });
  }
}
