# Storage Services Guide

Complete guide for using the storage services in Serenify app.

## Overview

The storage services provide persistent local storage for:
- 📝 **Journal Entries** (text and voice)
- 😊 **Daily Mood Tracking**
- 📞 **Emergency Contacts**
- 🎤 **Voice Recording**

All services use AsyncStorage for data persistence.

---

## Journal Storage

### Basic Usage

```typescript
import { journalStorage } from '@/app/services';

// Create a new journal entry
const entry = await journalStorage.createEntry({
  text: 'Had a great day today!',
  mood: 'happy',
  tags: ['gratitude', 'work'],
});

// Get all entries
const allEntries = await journalStorage.getAllEntries();

// Get entry by ID
const entryDetails = await journalStorage.getEntry(entry.id);

// Update entry
await journalStorage.updateEntry(entry.id, {
  text: 'Updated my journal entry',
});

// Delete entry
await journalStorage.deleteEntry(entry.id);
```

### With Voice Recording

```typescript
import { journalStorage, voiceRecording } from '@/app/services';

// Start recording
await voiceRecording.startRecording();

// ... user talks ...

// Stop recording and create journal entry
const recording = await voiceRecording.stopRecording();

if (recording) {
  const entry = await journalStorage.createEntry({
    text: 'Voice journal entry',
    voiceUri: recording.uri,
    voiceDuration: recording.duration,
    mood: 'neutral',
  });
}
```

### Advanced Queries

```typescript
// Get entries by date range
const weekEntries = await journalStorage.getEntriesByDateRange(
  '2024-01-01',
  '2024-01-07'
);

// Get entries by mood
const happyEntries = await journalStorage.getEntriesByMood('happy');

// Get entries with voice recordings
const voiceEntries = await journalStorage.getEntriesWithVoice();

// Search entries
const searchResults = await journalStorage.searchEntries('gratitude');

// Get recent entries
const recent = await journalStorage.getRecentEntries(10);

// Get entries by tag
const taggedEntries = await journalStorage.getEntriesByTag('work');
```

---

## Mood Tracking

### Basic Usage

```typescript
import { moodStorage } from '@/app/services';

// Log today's mood
const entry = await moodStorage.setTodayMood(
  'happy',
  'Feeling great today!',
  ['exercise', 'meditation']
);

// Check if mood logged today
const hasLogged = await moodStorage.hasLoggedToday();

// Get today's mood
const today = await moodStorage.getTodayMood();

// Get mood for specific date
const dateMood = await moodStorage.getEntryByDate('2024-01-15');
```

### Statistics and Trends

```typescript
import { moodStorage } from '@/app/services';

// Get recent entries (last 7 days)
const recent = await moodStorage.getRecentEntries(7);

// Get entries by date range
const monthEntries = await moodStorage.getEntriesByDateRange(
  '2024-01-01',
  '2024-01-31'
);

// Get mood statistics
const stats = await moodStorage.getMoodStats(
  '2024-01-01',
  '2024-01-31'
);
// Returns: { totalEntries, moodCounts, averageMood }

// Get mood trends (last month)
const trends = await moodStorage.getMoodTrends(1);
```

---

## Emergency Contacts

### Basic Usage

```typescript
import { contactsStorage } from '@/app/services';

// Add a new contact
const contact = await contactsStorage.addContact({
  name: 'Jane Smith',
  phone: '+1-234-567-8900',
  relationship: 'Therapist',
  isPrimary: true,
  notes: 'Available M-F, 9am-5pm',
});

// Get all contacts
const allContacts = await contactsStorage.getAllContacts();

// Get contacts sorted (primary first)
const sorted = await contactsStorage.getContactsSorted();

// Get primary contact
const primary = await contactsStorage.getPrimaryContact();

// Update contact
await contactsStorage.updateContact(contact.id, {
  phone: '+1-234-567-8901',
  notes: 'New phone number',
});

// Set as primary
await contactsStorage.setPrimaryContact(contact.id);

// Delete contact
await contactsStorage.deleteContact(contact.id);
```

### Advanced Queries

```typescript
import { contactsStorage } from '@/app/services';

// Search contacts
const results = await contactsStorage.searchContacts('Jane');

// Get contacts by relationship
const therapists = await contactsStorage.getContactsByRelationship('Therapist');

// Get contact count
const count = await contactsStorage.getContactCount();
```

---

## Voice Recording

### Basic Usage

```typescript
import { voiceRecording } from '@/app/services';

// Request permissions
const hasPermission = await voiceRecording.requestPermissions();

// Check permissions
const canRecord = await voiceRecording.checkPermissions();

// Start recording
await voiceRecording.startRecording();

// Get status while recording
const status = await voiceRecording.getStatus();
// Returns: { canRecord, isRecording, durationMillis }

// Check if recording
const isRecording = voiceRecording.isRecording();

// Stop recording and get URI
const recording = await voiceRecording.stopRecording();
// Returns: { uri, duration }
```

### Playback and Management

```typescript
import { voiceRecording } from '@/app/services';

// Play a recording
await voiceRecording.playRecording(recording.uri);

// Get file info
const info = await voiceRecording.getRecordingInfo(recording.uri);
// Returns: { exists, size, modificationTime }

// Delete recording
await voiceRecording.deleteRecording(recording.uri);

// Format duration
const formatted = voiceRecording.formatDuration(120); // "2:00"

// Cancel recording
await voiceRecording.cancelRecording();
```

---

## Complete Journal + Voice Example

```typescript
import { journalStorage, voiceRecording } from '@/app/services';
import { useState } from 'react';

function JournalWithVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleStartRecording = async () => {
    try {
      await voiceRecording.startRecording();
      setIsRecording(true);
      
      // Track duration
      const interval = setInterval(async () => {
        const status = await voiceRecording.getStatus();
        if (status) {
          setDuration(Math.floor(status.durationMillis / 1000));
        }
      }, 1000);
      
      // Store interval to clear later
      (window as any).recordingInterval = interval;
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
    
    const recording = await voiceRecording.stopRecording();
    setIsRecording(false);
    setDuration(0);

    if (recording) {
      // Create journal entry with voice
      await journalStorage.createEntry({
        text: 'Voice journal entry',
        voiceUri: recording.uri,
        voiceDuration: recording.duration,
        mood: 'neutral',
      });
    }
  };

  return (
    <div>
      {!isRecording ? (
        <button onClick={handleStartRecording}>Start Recording</button>
      ) : (
        <button onClick={handleStopRecording}>
          Stop Recording ({voiceRecording.formatDuration(duration)})
        </button>
      )}
    </div>
  );
}
```

---

## Mood Tracking Complete Example

```typescript
import { moodStorage } from '@/app/services';
import { useEffect, useState } from 'react';

function MoodTracker() {
  const [todayMood, setTodayMood] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    // Get today's mood
    const mood = await moodStorage.getTodayMood();
    setTodayMood(mood);

    // Get this week's stats
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const weekStats = await moodStorage.getMoodStats(weekAgoStr, today);
    setStats(weekStats);
  };

  const logMood = async (mood: MoodLevel, notes?: string) => {
    await moodStorage.setTodayMood(mood, notes);
    loadMoodData(); // Reload
  };

  return (
    <div>
      <h2>Today's Mood</h2>
      {todayMood ? (
        <p>{todayMood.mood}</p>
      ) : (
        <p>Not logged yet</p>
      )}
      
      <h3>This Week Stats</h3>
      {stats && (
        <div>
          <p>Average Mood: {stats.averageMood}</p>
          <p>Total Entries: {stats.totalEntries}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Data Structure Reference

### JournalEntry
```typescript
{
  id: string;
  createdAt: string; // ISO timestamp
  updatedAt?: string;
  text?: string;
  voiceUri?: string;
  voiceDuration?: number;
  mood?: MoodLevel;
  tags?: string[];
}
```

### MoodEntry
```typescript
{
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodLevel;
  notes?: string;
  activities?: string[];
  createdAt: string;
}
```

### EmergencyContact
```typescript
{
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
```

### MoodLevel
```typescript
type MoodLevel = 
  | 'very_happy'  // 😄
  | 'happy'       // 🙂
  | 'neutral'     // 😐
  | 'sad'         // 😔
  | 'very_sad'    // 😢
  | 'anxious'     // 😰
  | 'angry'       // 😠
  | 'tired';      // 😴
```

---

## Utility Functions

### Get Mood Info
```typescript
import { getMoodInfo } from '@/app/services';

const info = getMoodInfo('happy');
// Returns: { emoji: '🙂', label: 'Happy', color: '#60A5FA' }
```

### Format Duration
```typescript
import { voiceRecording } from '@/app/services';

const formatted = voiceRecording.formatDuration(125);
// Returns: "2:05"
```

---

## Error Handling

All storage operations should be wrapped in try-catch:

```typescript
try {
  const entry = await journalStorage.createEntry({ text: 'My entry' });
} catch (error) {
  console.error('Failed to save journal:', error);
  // Show error to user
}
```

---

## Best Practices

1. **Always request permissions** before recording
2. **Handle errors gracefully** with user-friendly messages
3. **Clear recordings** when no longer needed to save space
4. **Use date ranges** for efficient queries
5. **Check if logged** before prompting users to log mood
6. **Set primary contact** to show most important contact first

---

## API Reference

See individual service files for complete API documentation:
- `app/services/journalStorage.ts`
- `app/services/moodStorage.ts`
- `app/services/contactsStorage.ts`
- `app/services/voiceRecordingService.ts`
- `app/services/storageService.ts`
- `app/services/storageTypes.ts`

