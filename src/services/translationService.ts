const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

export async function translateText(
  text: string | string[],
  targetLanguage: string
): Promise<string | string[]> {
  // If the target language is English or matches the source (assuming English), skip translation.
  if (!targetLanguage || targetLanguage === 'en') {
    return text;
  }

  // If no API key is provided, use the Mock Service to simulate translation
  if (!API_KEY || API_KEY === 'your_key_here') {
    console.log('[Mock Translation] Translating to:', targetLanguage);
    
    // Simulate network latency (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isArray = Array.isArray(text);
    const textsToTranslate = isArray ? text : [text];

    const mockTranslated = textsToTranslate.map(t => {
      // Very basic mock translation visually indicating the target language
      return `[${targetLanguage.toUpperCase()}] ${t}`;
    });

    return isArray ? mockTranslated : mockTranslated[0];
  }

  // REAL API CALL
  try {
    const isArray = Array.isArray(text);
    const queries = isArray ? text : [text];
    
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('target', targetLanguage);
    queries.forEach(q => params.append('q', q));

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Translation API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data.data && data.data.translations) {
      const results = data.data.translations.map((t: any) => t.translatedText);
      return isArray ? results : results[0];
    }
    
    throw new Error('Invalid response format from Translation API');
  } catch (error) {
    console.error('Translation failed:', error);
    // Fallback to original text on failure
    return text;
  }
}
