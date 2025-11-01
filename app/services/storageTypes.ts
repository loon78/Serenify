/**
 * Storage Types and Interfaces
 * Defines data structures for storage services
 */

// Journal Entry
export interface JournalEntry {
  id: string;
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  text?: string; // Journal text content
  voiceUri?: string; // URI to voice recording file
  voiceDuration?: number; // Duration in seconds
  moodScore?: number; // Mood score from 1-10 (from AI analysis)
  tags?: string[]; // Optional tags
}

// Daily Mood Entry
export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  // numeric mood score from 1 (worst) to 10 (best)
  moodScore: number;
  notes?: string; // Optional notes about the day
  activities?: string[]; // Activities that day
  createdAt: string; // ISO timestamp
}

// Emergency Contact
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string; // e.g., "Family", "Friend", "Therapist"
  isPrimary?: boolean; // Primary contact to show first
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Storage Keys
export const STORAGE_KEYS = {
  JOURNALS: '@serenify:journals',
  MOODS: '@serenify:moods',
  EMERGENCY_CONTACTS: '@serenify:emergency_contacts',
  LAST_MOOD_DATE: '@serenify:last_mood_date',
  SETTINGS: '@serenify:settings',
} as const;

// Helper function to get mood display info
// (Previously there was a MoodLevel enum and helper here — removed in favor of numeric moodScore)

