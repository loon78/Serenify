# Serenify - Mental Health App 🌸

A mental health support app built with Expo and React Native, featuring AI-powered therapy chat.

## Features

- 🧠 **AI Therapy Chat** - Powered by Google Gemini AI
- 📝 **Journaling** - Track your thoughts and feelings
- 😊 **Mood Tracking** - Monitor your emotional wellbeing
- 📞 **Crisis Support** - Quick access to helplines
- 🎯 **Therapy Resources** - Guided exercises and tools

## Get started

### 1. Install Dependencies

```bash
npm install
cd server
npm install
cd ..
```

### 2. Set Up Gemini AI (Required for chat)

Create `server/.env`:
```
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=3001
```

Get your API key from: https://makersuite.google.com/app/apikey

📖 See [`QUICK_START.md`](QUICK_START.md) for complete setup instructions!

### 3. Start Backend Server

```bash
cd server
npm start
```

### 4. Start the App

In a new terminal:
```bash
npm start
```

Then press:
- `w` for web
- `a` for Android
- `i` for iOS

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Documentation

- 📘 [QUICK_START.md](QUICK_START.md) - Get up and running in 5 minutes
- 🏗️ [BACKEND_SETUP.md](BACKEND_SETUP.md) - Complete backend setup guide
- 💻 [EXAMPLE_CHAT_USAGE.md](EXAMPLE_CHAT_USAGE.md) - Code examples and integration
- 📊 [GEMINI_INTEGRATION_SUMMARY.md](GEMINI_INTEGRATION_SUMMARY.md) - Architecture overview
- 🔧 [server/README.md](server/README.md) - Backend API documentation

## Project Structure

```
Serenify/
├── app/                    # Expo app (React Native)
│   ├── functions/         # Main app screens
│   ├── services/          # API services (Gemini, etc.)
│   └── (tabs)/           # Tab navigation
├── server/               # Backend API server
│   ├── index.js         # Express server
│   └── package.json     # Backend dependencies
└── assets/              # Images, fonts, etc.
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Gemini AI Documentation](https://ai.google.dev/docs): Learn about Google's Gemini AI API

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
