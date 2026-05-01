const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2`;

/** Translate a single string. Returns the original on failure. */
export async function translateText(text: string, targetLanguage: string): Promise<string>;
/** Translate an array of strings. Returns the originals on failure. */
export async function translateText(text: string[], targetLanguage: string): Promise<string[]>;
export async function translateText(
  text: string | string[],
  targetLanguage: string
): Promise<string | string[]> {
  // If translating to English (or no change needed), skip the API call
  if (!targetLanguage || targetLanguage.startsWith('en')) {
    return text;
  }

  if (!API_KEY) {
    console.warn('Translation API key is missing – using original text.');
    return text;
  }

  const inputs = Array.isArray(text) ? text : [text];

  try {
    const response = await fetch(`${TRANSLATE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: inputs,
        target: targetLanguage,
        format: 'text',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || 'Translation failed');
    }

    const data = await response.json();
    const translations: string[] = data.data.translations.map(
      (t: { translatedText: string }) => t.translatedText
    );

    return Array.isArray(text) ? translations : translations[0];
  } catch (error) {
    console.error('Error in translationService:', error);
    return text; // graceful fallback – return original
  }
}