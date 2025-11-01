/**
 * Storage Services Index
 * Central export for all storage services
 */

// Export all storage services
export { storage } from './storageService';
export { journalStorage } from './journalStorage';
export { moodStorage } from './moodStorage';
export { contactsStorage } from './contactsStorage';
export { voiceRecording } from './voiceRecordingService';

// Export types
export * from './storageTypes';

// Export Gemini service
export * from './geminiService';

