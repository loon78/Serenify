/**
 * Journal Storage Service
 * Manages journal entries (text and voice)
 */

import { storage } from './storageService';
import type { JournalEntry, MoodLevel } from './storageTypes';
import { STORAGE_KEYS } from './storageTypes';

class JournalStorageService {
  private key = STORAGE_KEYS.JOURNALS;

  /**
   * Get all journal entries
   */
  async getAllEntries(): Promise<JournalEntry[]> {
    const entries = await storage.load<JournalEntry[]>(this.key);
    return entries || [];
  }

  /**
   * Get a specific journal entry by ID
   */
  async getEntry(id: string): Promise<JournalEntry | null> {
    const entries = await this.getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  }

  /**
   * Create a new journal entry
   */
  async createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry> {
    const newEntry: JournalEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const entries = await this.getAllEntries();
    entries.push(newEntry);
    await storage.save(this.key, entries);
    
    return newEntry;
  }

  /**
   * Update an existing journal entry
   */
  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    const entries = await this.getAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index === -1) {
      return null;
    }

    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await storage.save(this.key, entries);
    return entries[index];
  }

  /**
   * Delete a journal entry
   */
  async deleteEntry(id: string): Promise<boolean> {
    const entries = await this.getAllEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    
    if (filtered.length === entries.length) {
      return false; // Entry not found
    }

    await storage.save(this.key, filtered);
    return true;
  }

  /**
   * Get entries by date range
   */
  async getEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(entry => {
      const entryDate = entry.createdAt.split('T')[0];
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Get entries by mood
   */
  async getEntriesByMood(mood: MoodLevel): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(entry => entry.mood === mood);
  }

  /**
   * Get entries with voice recordings
   */
  async getEntriesWithVoice(): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(entry => entry.voiceUri != null);
  }

  /**
   * Search entries by text content
   */
  async searchEntries(searchTerm: string): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    const term = searchTerm.toLowerCase();
    return entries.filter(entry => 
      entry.text?.toLowerCase().includes(term) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }

  /**
   * Get recent entries (limit by count)
   */
  async getRecentEntries(limit: number = 10): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    return entries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Get entries by tag
   */
  async getEntriesByTag(tag: string): Promise<JournalEntry[]> {
    const entries = await this.getAllEntries();
    return entries.filter(entry => entry.tags?.includes(tag));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const journalStorage = new JournalStorageService();

