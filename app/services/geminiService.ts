/**
 * Gemini API Service
 * Handles all communication with the backend Gemini API
 */
/**
 * Client-side endpoint used by the app.
 * Preference:
 * - If EXPO_PUBLIC_API_URL is set (mobile builds), use it and append `/api/gemini-chat`.
 * - Otherwise use the relative path `/api/gemini-chat` so the client calls the app route.
 */
const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL
  ? process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '') + '/api/gemini-chat'
  : '/api/gemini-chat';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * Send a message to Gemini AI
 * @param message - The user's message
 * @param conversationHistory - Optional conversation history for context
 * @returns The AI's response
 */
export async function sendMessageToGemini(
  message: string,
  conversationHistory: Message[] = []
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    return {
      success: false,
      error: 'Failed to connect to Gemini API',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


