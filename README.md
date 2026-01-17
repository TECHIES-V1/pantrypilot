# PantryPilot 🍳

A React Native mobile app that empowers users to seamlessly transition from discovering recipes online to executing them in their home kitchen.

## Tech Stack

- **Mobile**: React Native + Expo (TypeScript)
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Groq API (Llama-3, Whisper)
- **Monetization**: RevenueCat

## Features

- 📥 Recipe ingestion (URL, text, photo)
- 🧠 AI-powered ingredient extraction & parsing
- 🥕 Pantry/fridge inventory management
- 🛒 Smart grocery list generation
- 📋 Multi-recipe meal planning
- 👨‍🍳 Step-by-step cooking mode with timers
- 📚 Recipe library with search & tags
- 💳 Freemium monetization (Free/Plus/Pro tiers)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator or physical device

### Installation

```bash
# Clone the repository
git clone https://github.com/TECHIES-V1/pantrypilot.git
cd pantrypilot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Fill in your keys in .env:
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# GROQ_API_KEY=your_groq_api_key
# REVENUECAT_PUBLIC_KEY_IOS=your_revenuecat_ios_key
# REVENUECAT_PUBLIC_KEY_ANDROID=your_revenuecat_android_key

# Start the development server
npm start
```

### Running on Device

```bash
# iOS (macOS only)
npm run ios

# Android
npm run android

# Web (experimental)
npm run web
```

## Project Structure

```
pantrypilot/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── store/          # Zustand state management
│   ├── services/       # API clients (Supabase, Groq)
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # Theme, animation, config constants
│   └── utils/          # Helper functions
├── assets/             # Images, fonts, etc.
├── App.tsx             # App entry point
└── app.json            # Expo configuration
```

## Design System

The app uses a dark-mode only theme system with 4 available themes:

- 🌲 **Rainforest** (default) - Green palette
- 🏜️ **Desert** - Orange/brown palette
- 🌃 **Cyberpunk** - Cyan/magenta palette
- 🌊 **Deep Sea** - Blue palette

All animations follow the 60 FPS performance target with max 400ms entrance animations.

## Team

| Role           | Developer |
| -------------- | --------- |
| Team Lead      | Eyitayo   |
| Auth           | Daniel    |
| Recipe Input   | Manuel    |
| AI Integration | Moh       |
| Pantry         | Amram     |
| Grocery List   | Collins   |
| Multi-Recipe   | Tobilola  |
| Cooking Mode   | Jeremiah  |
| Library        | Ishola    |
| Monetization   | Joanna    |

## License

Private - All rights reserved
