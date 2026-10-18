import { GoogleGenerativeAI } from "@google/generative-ai";

interface HistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

export const getGeminiResponse = async (
  prompt: string,
  history: HistoryItem[] = [],
  language: string = "en"
): Promise<string> => {
  // 1. Primary: Call the secure serverless backend endpoint (/api/gemini)
  // This keeps your GEMINI_API_KEY completely hidden on the server.
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return data.text;
      }
    } else {
      const errorData = await res.json().catch(() => null);
      if (errorData?.error && res.status !== 404) {
        throw new Error(errorData.error);
      }
    }
  } catch (backendError: any) {
    // If backend gave an explicit error (like missing server key), bubble it up
    if (
      backendError.message &&
      !backendError.message.includes("404") &&
      !backendError.message.includes("Failed to fetch")
    ) {
      throw backendError;
    }
    // If running in local standalone Vite dev without Vercel serverless runtime, fallback to direct client call
  }

  // 2. Fallback for standalone local Vite dev server
  const localKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!localKey || localKey === "YOUR_GEMINI_API_KEY") {
    throw new Error(
      "Gemini AI is not configured. For Vercel production, add GEMINI_API_KEY in Vercel Project Settings. For local development, add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const genAI = new GoogleGenerativeAI(localKey);
  const systemInstruction = `You are ElectAssist, a helpful political assistant for Indian citizens. Help users understand the political system. Be neutral and factual. IMPORTANT: Respond in the language requested by the user. The user's preferred language code is: ${language}. If the language is not English, translate your entire response into that language.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
  });

  const validHistory = [...history];
  while (validHistory.length > 0 && validHistory[0]?.role !== "user") {
    validHistory.shift();
  }

  const chat = model.startChat({
    history: validHistory,
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};
