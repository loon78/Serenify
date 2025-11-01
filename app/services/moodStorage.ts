/**
 * Mood Storage Service
 * Manages daily mood tracking
 */

import { storage } from './storageService';
import type { MoodEntry, MoodLevel } from './storageTypes';
import { STORAGE_KEYS } from './storageTypes';

class MoodStorageService {
  private key = STORAGE_KEYS.MOODS;

  /**
   * Get all mood entries
   */
  async getAllEntries(): Promise<MoodEntry[]> {
    const entries = await storage.load<MoodEntry[]>(this.key);
    return entries || [];
  }

  /**
   * Get mood entry for a specific date
   */
  async getEntryByDate(date: string): Promise<MoodEntry | null> {
    const entries = await this.getAllEntries();
    return entries.find(entry => entry.date === date) || null;
  }

  /**
   * Create or update mood entry for today
   */
  async setTodayMood(mood: MoodLevel, notes?: string, activities?: string[]): Promise<MoodEntry> {
    const today = new Date().toISOString().split('T')[0];
    return this.setMoodForDate(today, mood, notes, activities);
  }

  /**
   * Create or update mood entry for a specific date
   */
  async setMoodForDate(
    date: string,
    mood: MoodLevel,
    notes?: string,
    activities?: string[]
  ): Promise<MoodEntry> {
    const entries = await this.getAllEntries();
    const existingIndex = entries.findIndex(entry => entry.date === date);

    const newEntry: MoodEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : this.generateId(),
      date,
      mood,
      notes,
      activities,
      createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    await storage.save(this.key, entries);
    await storage.save(STORAGE_KEYS.LAST_MOOD_DATE, date);
    
    return newEntry;
  }

  /**
   * Get mood entry for today
   */
  async getTodayMood(): Promise<MoodEntry | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.getEntryByDate(today);
  }

  /**
   * Check if mood was logged today
   */
  async hasLoggedToday(): Promise<boolean> {
    const entry = await this.getTodayMood();
    return entry != null;
  }

  /**
   * Get mood entries by date range
   */
  async getEntriesByDateRange(startDate: string, endDate: string): Promise<MoodEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(entry => entry.date >= startDate && entry.date <= endDate);
  }

  /**
   * Get mood entries from the last N days
   */
  async getRecentEntries(days: number = 7): Promise<MoodEntry[]> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    return this.getEntriesByDateRange(
      startDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  /**
   * Get mood statistics for a date range
   */
  async getMoodStats(startDate: string, endDate: string): Promise<{
    totalEntries: number;
    moodCounts: Record<MoodLevel, number>;
    averageMood: number;
  }> {
    const entries = await this.getEntriesByDateRange(startDate, endDate);
    
    const moodCounts: Record<MoodLevel, number> = {
      very_happy: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      very_sad: 0,
      anxious: 0,
      angry: 0,
      tired: 0,
    };

    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });

    // Calculate average mood score (0-7 scale)
    const moodScores: Record<MoodLevel, number> = {
      very_happy: 7,
      happy: 6,
      neutral: 5,
      tired: 4,
      anxious: 3,
      sad: 2,
      angry: 1,
      very_sad: 0,
    };

    const totalScore = entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0);
    const averageMood = entries.length > 0 ? totalScore / entries.length : 0;

    return {
      totalEntries: entries.length,
      moodCounts,
      averageMood: Math.round(averageMood * 10) / 10,
    };
  }

  /**
   * Get mood trends over time
   */
  async getMoodTrends(months: number = 1): Promise<MoodEntry[]> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - months);
    
    const entries = await this.getEntriesByDateRange(
      startDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );

    return entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Delete mood entry
   */
  async deleteEntry(date: string): Promise<boolean> {
    const entries = await this.getAllEntries();
    const filtered = entries.filter(entry => entry.date !== date);
    
    if (filtered.length === entries.length) {
      return false;
    }

    await storage.save(this.key, filtered);
    return true;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const moodStorage = new MoodStorageService();

