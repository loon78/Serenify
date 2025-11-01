/**
 * POST /api/audio-journal
 * Accepts:
 * - multipart/form-data with a file field named 'audio'
 * OR
 * - application/json { audioBase64: string, mimeType: string }
 *
 * Transcribes audio using Gemini 2.5 Flash and returns transcript + mood score (1-10)
 * 
 * Environment variables required:
 * - GOOGLE_API_KEY: your Google/Gemini API key
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

type AudioJournalResponse = {
  success: boolean;
  transcript?: string;
  moodScore?: number;
  error?: string;
  details?: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('Received request to /api/audio-journal');
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    
    let audioBase64: string | undefined;
    let mimeType: string = 'audio/mp3';

    // Handle different content types
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const audioFile = (form as any).get('audio') as any;
      
      if (!audioFile) {
        return new Response(
          JSON.stringify({ success: false, error: 'No audio file provided' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Get file data
      if (typeof audioFile.arrayBuffer === 'function') {
        const ab = await audioFile.arrayBuffer();
        audioBase64 = Buffer.from(ab).toString('base64');
        mimeType = audioFile.type || 'audio/mp3';
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid audio file format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      audioBase64 = body.audioBase64;
      mimeType = body.mimeType || 'audio/mp3';
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Unsupported content type. Use multipart/form-data or application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!audioBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'No audio data provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for API key
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server not configured: missing GOOGLE_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Prepare the prompt for transcription and mood analysis
    const prompt = `You are a mental health analysis assistant. 

Analyze this audio transcript and provide:
1. A complete, accurate transcription of what was said
2. A mood score from 1-10 based on emotional tone and what was expressed (1=very negative/distressed, 10=very positive/calm)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "transcript": "the full transcription text here",
  "moodScore": 7
}

Do not include any explanatory text outside the JSON.`;

    // Use the audio file with Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    
    // Parse JSON response
    let parsedResponse: { transcript: string; moodScore: number };
    try {
      // Extract JSON from response (might have markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to parse AI response',
          details: responseText,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate response
    if (typeof parsedResponse.transcript !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid transcript in AI response',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof parsedResponse.moodScore !== 'number' || parsedResponse.moodScore < 1 || parsedResponse.moodScore > 10) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid mood score in AI response',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        transcript: parsedResponse.transcript,
        moodScore: parsedResponse.moodScore,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('API /api/audio-journal error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: err?.message ?? String(err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

