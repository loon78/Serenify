/**
 * Storage Service
 * Central storage service using AsyncStorage for data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  JournalEntry,
  MoodEntry,
  EmergencyContact,
  STORAGE_KEYS,
} from './storageTypes';

/**
 * Generic storage operations
 */
class StorageService {
  /**
   * Save data to storage
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
      throw new Error(`Failed to save data to ${key}`);
    }
  }

  /**
   * Load data from storage
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error loading from ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from storage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error(`Failed to remove data from ${key}`);
    }
  }

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys];
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }
}

// Export singleton instance
export const storage = new StorageService();

