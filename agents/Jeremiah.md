Role Summary

- Cooking mode & execution guidance owner

What You Are Building

- Step-by-step cooking UI
- Timers & voice read-out

Step-by-Step Tasks (Execution-Level)

- Create branch feature/cooking-mode from main
- Create src/screens/CookingModeScreen.tsx
- Receive recipe.steps array
- Render current step card + next/prev
- Use expo-speech for TTS on step text
- Add countdown timer per step if time mentioned
- Save progress locally
- Commit & PR

Files & Directories You Own

- src/screens/CookingModeScreen.tsx

Interfaces With Other Work

- Expects: parsed steps from Moh
- Provides: cooking completion signal to library

Validation Checklist

- Steps display sequentially
- TTS reads step on tap
- Timer starts if duration parsed
- Progress saved across app close
