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
  mood?: MoodLevel; // Associated mood
  moodScore?: number; // Mood score from 1-10 (from AI analysis)
  tags?: string[]; // Optional tags
}

// Daily Mood Entry
export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  mood: MoodLevel;
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

// Mood Levels
export type MoodLevel = 
  | 'very_happy' 
  | 'happy' 
  | 'neutral' 
  | 'sad' 
  | 'very_sad' 
  | 'anxious' 
  | 'angry'
  | 'tired';

// Storage Keys
export const STORAGE_KEYS = {
  JOURNALS: '@serenify:journals',
  MOODS: '@serenify:moods',
  EMERGENCY_CONTACTS: '@serenify:emergency_contacts',
  LAST_MOOD_DATE: '@serenify:last_mood_date',
  SETTINGS: '@serenify:settings',
} as const;

// Helper function to get mood display info
export function getMoodInfo(mood: MoodLevel) {
  const moodMap: Record<MoodLevel, { emoji: string; label: string; color: string }> = {
    very_happy: { emoji: '😄', label: 'Very Happy', color: '#34D399' },
    happy: { emoji: '🙂', label: 'Happy', color: '#60A5FA' },
    neutral: { emoji: '😐', label: 'Neutral', color: '#9CA3AF' },
    sad: { emoji: '😔', label: 'Sad', color: '#FBBF24' },
    very_sad: { emoji: '😢', label: 'Very Sad', color: '#F87171' },
    anxious: { emoji: '😰', label: 'Anxious', color: '#FB923C' },
    angry: { emoji: '😠', label: 'Angry', color: '#EF4444' },
    tired: { emoji: '😴', label: 'Tired', color: '#A78BFA' },
  };
  return moodMap[mood];
}

