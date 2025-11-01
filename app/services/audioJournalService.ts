/**
 * Audio Journal Service
 * Handles audio journal transcription and mood analysis via Gemini API
 */

import { readAsStringAsync } from 'expo-file-system/legacy';

const API_ENDPOINT = '/api/audio-journal';

export interface AudioJournalResponse {
  success: boolean;
  transcript?: string;
  moodScore?: number;
  error?: string;
  details?: string;
}

/**
 * Process audio file and get transcription + mood score
 */
export async function processAudioJournal(
  audioUri: string
): Promise<AudioJournalResponse> {
  try {
    // Read the audio file
    const base64 = await readAsStringAsync(audioUri, {
      encoding: 'base64',
    });

    // Get file extension to determine MIME type
    const extension = audioUri.split('.').pop()?.toLowerCase();
    let mimeType = 'audio/mp3';
    
    if (extension === 'm4a') {
      mimeType = 'audio/mp4';
    } else if (extension === 'wav') {
      mimeType = 'audio/wav';
    } else if (extension === 'ogg') {
      mimeType = 'audio/ogg';
    }

    // Send to API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBase64: base64,
        mimeType: mimeType,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing audio journal:', error);
    return {
      success: false,
      error: 'Failed to process audio journal',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

