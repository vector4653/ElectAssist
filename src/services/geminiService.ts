import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (prompt: string, history: { role: "user" | "model", parts: { text: string }[] }[] = []) => {
  const currentApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  console.log("Checking Gemini API Key...");
  if (!currentApiKey) {
    console.error("DEBUG: VITE_GEMINI_API_KEY is empty or undefined in import.meta.env");
    throw new Error("Gemini API Key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  console.log("API Key found (starts with):", currentApiKey.substring(0, 5) + "...");

  try {
    const genAI = new GoogleGenerativeAI(currentApiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    console.log("Model initialized. Sending prompt...");
    
    // Prepare the parts
    const systemInstruction = "You are ElectAssist, a helpful political assistant for Indian citizens. Help users understand the political system. Be neutral and factual.";
    const chatHistory = history.length > 0 ? history : [];
    
    // Gemini API requires the first message in history to be from 'user'
    const validHistory = [...chatHistory];
    while (validHistory.length > 0 && validHistory[0].role !== 'user') {
      validHistory.shift();
    }

    const chat = model.startChat({
      history: validHistory,
    });

    // We'll prepend the system instruction to the first message if it's a new chat
    // or just include it in the prompt for simplicity to avoid 404s on systemInstruction support
    const finalPrompt = history.length === 0 ? `${systemInstruction}\n\nUser: ${prompt}` : prompt;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini successfully.");
    return text;
  } catch (error: any) {
    console.error("GEMINI API ERROR:", error);
    // Log more details if available
    if (error.message) console.error("Error Message:", error.message);
    if (error.status) console.error("Error Status:", error.status);
    throw error;
  }
};
