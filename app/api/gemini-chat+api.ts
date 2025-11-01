/**
 * Expo Router / Next.js App Route: /api/gemini
 *
 * POST body: { message: string, conversationHistory?: Array<{ role: 'user'|'assistant', content: string }> }
 * Environment variables required:
 * - GOOGLE_API_KEY: your Google/Gemini API key (keep secret)
 *
 * This file runs server-side and must NOT be bundled into the client app.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

type IncomingMessage = {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export async function POST(request: Request) {
  try {
    console.log('Received request to /api/gemini-chat');
    const body = (await request.json()) as IncomingMessage | null;
    const message = body?.message;
    const conversationHistory = body?.conversationHistory ?? [];

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? '';
    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server not configured: missing GOOGLE_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const modelName = 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  // System prompt to set the assistant persona. This can be overridden via
  // the GEMINI_SYSTEM_PROMPT environment variable. We insert it as the
  // first 'user' message so the SDK's chat history validation (which expects
  // the first content to be from a user) is satisfied while still providing
  // system-level instructions.
  const SYSTEM_PROMPT = process.env.GEMINI_SYSTEM_PROMPT ||
    "You are an empathetic AI psychiatrist. Respond kindly and non-judgmentally, ask open-ended questions to help the user explore feelings, avoid making definitive medical diagnoses, and provide supportive resources when appropriate.";

    let result: any;

    if (conversationHistory.length > 0) {
      // Ensure the chat history starts with a user message — the SDK requires
      // the first content to have role 'user'. If the provided history begins
      // with an assistant/model message (for example your UI seeds an AI
      // greeting), drop items until we find the first user message.
      const firstUserIndex = conversationHistory.findIndex((m) => m.role === 'user');
      const sliced = firstUserIndex >= 0 ? conversationHistory.slice(firstUserIndex) : [];

      if (sliced.length === 0) {
        // No valid user-led history remains — include the system prompt and
        // fall back to single-message generation with persona prefixed.
        result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${message}`);
      } else {
        // Prepend the system prompt as a user role so the SDK validation is ok
        const augmented = [
          { role: 'user', content: SYSTEM_PROMPT },
          ...sliced,
        ];

        const chatHistory = augmented.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history: chatHistory });
        result = await chat.sendMessage(message);
      }
    } else {
      // Simple generation without history — use the SDK's `generateContent`
      result = await model.generateContent(message);
    }

    // The SDK returns a response object with helpers; use response.text() when present
    const responseObj = await result.response;
    const text = typeof responseObj.text === 'function' ? responseObj.text() : String(responseObj);

    return new Response(JSON.stringify({ success: true, message: text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Allow CORS for development; tighten in production
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('API /api/gemini error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: err?.message ?? String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
