import { GoogleGenerativeAI } from "@google/generative-ai";

// Ambient declaration for Vercel Serverless Node runtime
declare const process: {
  env: Record<string, string | undefined>;
};

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-2.5-pro",
  "gemini-pro-latest",
];

export default async function handler(req: any, res: any) {
  // Read API key from server environment (never exposed to client browser)
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    return res.status(500).json({
      error: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY in Vercel Project Settings.",
    });
  }

  // Diagnostic endpoint to check available models for this API key
  if (req.query?.action === "listModels" || req.body?.action === "listModels") {
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const listData = await listRes.json();
      return res.status(listRes.status).json(listData);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || "Failed to list models" });
    }
  }

  // Allow only POST requests for chat
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { prompt, history = [], language = "en" } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A valid 'prompt' string is required." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `You are ElectAssist, a helpful political assistant for Indian citizens. Help users understand the political system. Be neutral and factual. IMPORTANT: Respond in the language requested by the user. The user's preferred language code is: ${language}. If the language is not English, translate your entire response into that language.`;

    // Clean up history to ensure first message is from 'user'
    const validHistory = Array.isArray(history) ? [...history] : [];
    while (validHistory.length > 0 && validHistory[0]?.role !== "user") {
      validHistory.shift();
    }

    const attemptErrors: Record<string, string> = {};
    let text = "";

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        const chat = model.startChat({
          history: validHistory,
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (err: any) {
        attemptErrors[modelName] = err?.message || String(err);
        console.warn(`Model ${modelName} failed, attempting next candidate:`, err?.message || err);
      }
    }

    if (!text) {
      return res.status(500).json({
        error: "All candidate models failed.",
        details: attemptErrors,
      });
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini Serverless API Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate response from Gemini API.",
    });
  }
}
