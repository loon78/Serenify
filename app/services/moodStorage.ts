/**
 * Mood Storage Service
 * Manages daily mood tracking
 */

import { storage } from './storageService';
import type { MoodEntry } from './storageTypes';
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
  async setTodayMood(moodScore: number, notes?: string, activities?: string[]): Promise<MoodEntry> {
    const today = new Date().toISOString().split('T')[0];
    return this.setMoodForDate(today, moodScore, notes, activities);
  }

  /**
   * Create or update mood entry for a specific date
   */
  async setMoodForDate(
    date: string,
    moodScore: number,
    notes?: string,
    activities?: string[]
  ): Promise<MoodEntry> {
    const entries = await this.getAllEntries();
    const existingIndex = entries.findIndex(entry => entry.date === date);

    // Normalize and clamp moodScore to integer 1-10
    const normalizedScore = Math.min(10, Math.max(1, Math.round(Number(moodScore) || 1)));

    const newEntry: MoodEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : this.generateId(),
      date,
      moodScore: normalizedScore,
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
    averageMood: number;
  }> {
    const entries = await this.getEntriesByDateRange(startDate, endDate);
    // Compute average based on moodScore (1-10). Entries should have moodScore.
    const totalScore = entries.reduce((sum, entry) => sum + (typeof (entry as any).moodScore === 'number' ? (entry as any).moodScore : 0), 0);
    const averageMood = entries.length > 0 ? totalScore / entries.length : 0;

    return {
      totalEntries: entries.length,
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

