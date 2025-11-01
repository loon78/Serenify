# Serenify — Mental Health Companion

Serenify is a mobile-first mental health companion built with Expo + React Native. It helps users reflect, track mood, practice short therapy exercises, and get supportive AI guidance powered by Google Gemini.

## What it does
- Quick mood check-ins with a calendar and trend chart
- Voice journaling (record, transcribe, save)
- Journal dashboard and detailed entry view with AI-generated supportive advice
- Therapy exercises (deep breathing, guided activities)
- Emergency & support contacts for crisis situations
- Simple local storage of journal entries & mood history

## Key features
- Mood tracking and visual trends (line chart)
- Audio recording, automatic transcription and journaling
- Gemini-powered AI helper that offers empathetic advice and congratulations
- Scrollable therapy activities with an interactive deep-breathing exercise
- Offline-first data saved to AsyncStorage for fast, local access

## Tech stack
- Expo / React Native (TypeScript / TSX)
- Expo Router (file-based navigation)
- Google Gemini (server-side AI integration)
- Express backend (server folder) to proxy & call Gemini securely
- AsyncStorage for local persistence
- react-native-chart-kit + react-native-svg for charts
- Expo Audio / FileSystem for recording and file handling

## Initial setup

1. Clone repository
   ```bash
   git clone <repo-url>
   cd Serenify
   ```

2. Install app deps
   ```bash
   npm install
   ```

3. Add Gemini API key (server side)
   - Create `server/.env` with:
     ```
     GOOGLE_API_KEY=your_gemini_api_key_here
     
     ```

## Run the project

1. Start the Expo app
   ```bash
   npm start
   # or
   expo start -c   # clears Metro cache if needed
   ```
   - Use `a` (Android), `i` (iOS) or open in Expo Go / development build.
