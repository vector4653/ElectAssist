import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (prompt: string, history: { role: "user" | "model", parts: { text: string }[] }[] = [], language: string = 'en') => {
  const currentApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  if (!currentApiKey) {
    throw new Error("Gemini API Key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  try {
    const genAI = new GoogleGenerativeAI(currentApiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Prepare the parts
    const systemInstruction = `You are ElectAssist, a helpful political assistant for Indian citizens. Help users understand the political system. Be neutral and factual. IMPORTANT: Respond in the language requested by the user. The user's preferred language code is: ${language}. If the language is not English, translate your entire response into that language.`;
    
    const chatHistory = history.length > 0 ? history : [];
    
    // Gemini API requires the first message in history to be from 'user'
    const validHistory = [...chatHistory];
    while (validHistory.length > 0 && validHistory[0].role !== 'user') {
      validHistory.shift();
    }

    const chat = model.startChat({
      history: validHistory,
    });

    const finalPrompt = history.length === 0 ? `${systemInstruction}\n\nUser: ${prompt}` : prompt;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("GEMINI API ERROR:", error);
    throw error;
  }
};
