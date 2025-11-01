# Storage Services - Quick Reference

## Installation

All dependencies are already installed:
- `@react-native-async-storage/async-storage` - Data persistence
- `expo-av` - Audio recording and playback
- `expo-file-system` - File management
- `expo-secure-store` - Secure data storage

## Quick Start

```typescript
import { journalStorage, moodStorage, contactsStorage, voiceRecording } from '@/app/services';

// Journal
const entry = await journalStorage.createEntry({ text: 'My thoughts' });

// Mood
await moodStorage.setTodayMood('happy', 'Great day!');

// Contacts
await contactsStorage.addContact({ name: 'Jane', phone: '123-456-7890' });

// Voice
await voiceRecording.startRecording();
const recording = await voiceRecording.stopRecording();
```

## File Structure

```
app/services/
├── index.ts                    # Central exports
├── storageTypes.ts             # Type definitions
├── storageService.ts           # Base storage service
├── journalStorage.ts           # Journal CRUD
├── moodStorage.ts              # Mood tracking
├── contactsStorage.ts          # Emergency contacts
├── voiceRecordingService.ts    # Audio recording
└── geminiService.ts            # AI chat
```

## Key Features

✅ **Persistent Storage** - Data survives app restarts
✅ **Type-Safe** - Full TypeScript support
✅ **Voice Recording** - High-quality audio with permissions
✅ **Search & Filter** - Find entries by date, mood, tags
✅ **Statistics** - Mood trends and analytics
✅ **Import/Export** - Easy data management

## Documentation

- 📖 [STORAGE_SERVICES_GUIDE.md](STORAGE_SERVICES_GUIDE.md) - Complete guide with examples

