Prompt 0  
You are a senior React Native engineer building the PantryPilot app.  
Your sole ownership is the cooking execution support / cooking mode feature.  
You must not touch authentication, recipe ingestion/input, AI/Groq parsing, pantry management, grocery list generation, multi-recipe planning/merging, recipe library, nutritional insights, or monetization/paywalls.  
You start today (Day 3). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth, Manuel’s recipe input, Moh’s Groq integration (parsed recipe JSON with steps array), Collins’ grocery list (for post-cook reference if needed), Tobilola’s multi-recipe planning (merged recipes may feed into cooking), and Ishola’s library (recipes saved with json_data containing steps) already present or in PR.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/cooking-mode`
- Create folder `src/screens/CookingModeScreen/`
- Inside it, create `CookingModeScreen.tsx`
- Create `src/types/cooking.ts` with these exact types:

  ```ts
  export interface CookingStep {
    index: number;
    text: string;
    timerSeconds?: number; // parsed or estimated duration
    completed: boolean;
  }

  export type CookingState = {
    currentRecipe: any | null; // full parsed recipe
    steps: CookingStep[];
    currentStepIndex: number;
    isSpeaking: boolean;
    timerActive: boolean;
    timerRemaining: number | null;
    loading: boolean;
    error: string | null;
  };
  ```

- In `src/store/cookingStore.ts` create a Zustand store with:
  - state: currentRecipe: null, steps: [], currentStepIndex: 0, isSpeaking: false, timerActive: false, timerRemaining: null, loading: false, error: null
  - actions: startCooking(recipe), nextStep, prevStep, toggleStepComplete, startTimer(seconds), stopTimer, speakStep(text), stopSpeaking, resetCooking
  - startCooking: set currentRecipe, map recipe.steps to CookingStep[] with index, text, timerSeconds (attempt parse e.g. "5 minutes" → 300), completed: false
  - nextStep/prevStep: update currentStepIndex (clamp 0 to steps.length-1)
  - toggleStepComplete: update steps[index].completed
  - timer: use setInterval in action to countdown timerRemaining, auto next on 0
  - speakStep: use expo-speech speakAsync(text, { language: 'en' })
- In `CookingModeScreen.tsx`:
  - Use `useAuthStore` to guard
  - Use `useCookingStore` for state and actions
  - Use route.params to receive recipe (or currentRecipe from store)
  - Render SafeAreaView with:
    - Header: recipe title + progress bar (currentStepIndex / steps.length)
    - Large centered card: current step text
    - Below: timer display if timerRemaining !== null (large countdown)
    - Buttons: Prev, Next, Play/Pause speech, Mark Complete checkbox
    - Floating action: Reset / Exit
- Commit: `git commit -m "Implement cooking store, types, basic CookingModeScreen with step navigation and speech stub"`
- Push and create PR: `gh pr create --base main --title "Feature/cooking-mode core" --body "Step-by-step cooking guidance with timers and TTS"`

Prompt 1  
You are continuing work on the cooking mode feature in branch feature/cooking-mode.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth, recipe input, AI parsing, pantry, grocery, multi-recipe, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/cooking-mode
- In `cookingStore.ts`:
  - Improve startCooking: parse timerSeconds from step text (regex for patterns like "cook for 10 min", "bake 20-25 minutes", "simmer 5 mins" → take average or first number)
  - Add action pauseTimer, resumeTimer
  - Add action toggleSpeaking (global isSpeaking flag)
- In `CookingModeScreen.tsx`:
  - Add timer controls: Start/Pause/Reset buttons when timerSeconds present
  - Use useEffect to start countdown interval when timerActive && timerRemaining > 0
  - On timer reach 0: play sound (expo-av optional if installed) or vibrate, auto nextStep if not last
  - Add completion checkbox per step (update store)
  - Show progress ring or bar at top
  - Add note field: TextInput to add personal notes per step (save to local state or later to recipe json)
- Create `src/components/CookingStepCard.tsx`:
  - Props: step: CookingStep, isCurrent: boolean, onCompleteToggle, onSpeak
  - Render: step number, text (larger if current), checkbox, speak icon button
- Use CookingStepCard in a horizontal PagerView or simple conditional render for current step
- Commit: `git commit -m "Add timer parsing/countdown, step completion, speech toggle, step card component"`
- Push and update existing PR

Prompt 2  
You are finalizing the cooking mode feature in branch feature/cooking-mode.  
Focus on polish, hands-free usability, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- In `cookingStore.ts`:
  - Add persistence for current cooking session: use zustand persist middleware (install if needed: npm install zustand persist) or manual AsyncStorage
  - On app foreground: resume timer if was active
  - Add post-cook action: mark recipe as completed (update libraryStore or supabase recipes with completed_at)
- In `CookingModeScreen.tsx`:
  - Add voice command stub: note "Future: integrate expo-speech-recognition for next/prev"
  - Add hands-free mode toggle: larger buttons, auto-speak each step on enter
  - Show ingredient checklist (from recipe.ingredients) at top of screen (collapsible)
  - On finish last step: show completion screen with "Great job!" + button to rate recipe / add to favorites
  - Add back button to exit cooking (confirm unsaved progress)
- Test flow locally:
  - Parse/save a recipe with steps
  - Navigate to CookingModeScreen (e.g. from library or grocery complete)
  - Start cooking → verify steps display, speech works, timer counts down, completion persists
  - Exit and re-enter → session resumes if persisted
  - Complete all steps → see completion UI
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Polish cooking mode: session persistence, completion UI, hands-free tweaks, final tests"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/cooking-mode should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in cooking-related files
- Test end-to-end in local app:
  - From library or planning: start cooking a recipe
  - Verify steps load correctly from parsed json
  - Speech reads step, timer starts on timed steps
  - Completion marks step, progresses to end
  - Session persists across navigation/app background
  - Completion updates recipe status
- If any bug found in timer, speech, persistence, or navigation, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for cooking-mode-related adjustments during final smoke test
- Final commit if needed: `git commit -m "Final cooking mode integration fixes and validation"`
