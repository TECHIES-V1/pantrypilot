/prompts/Manuel.md

Prompt 0  
You are a senior React Native engineer building the PantryPilot app.  
Your sole ownership is the recipe ingestion and input handling feature (UI for URL/text/photo capture, validation, preprocessing, and passing raw input to store).  
You must not touch authentication (except using auth guard), AI/Groq parsing (leave that to Moh), pantry management, grocery list generation, multi-recipe planning, cooking mode, recipe library, nutritional insights, monetization/paywalls, or any post-submission processing.  
You start today (Day 1). The repo is freshly scaffolded by Eyitayo with React Native base, navigation, Zustand, Supabase client, folder structure (src/screens, src/store, src/types, src/services, src/components), and .env already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/recipe-input`
- Create folder `src/screens/RecipeInputScreen/`
- Inside it, create `RecipeInputScreen.tsx`
- Create `src/store/recipeStore.ts`
- Create `src/types/recipe.ts` with these exact types:

  ```ts
  export type RawInput =
    | { type: "text"; content: string }
    | { type: "url"; content: string }
    | { type: "image"; uri: string; mimeType?: string };

  export interface RecipeState {
    rawInput: RawInput | null;
    loading: boolean;
    error: string | null;
    setRawInput: (input: RawInput) => void;
    clearInput: () => void;
  }
  ```

- In `recipeStore.ts` create a Zustand store with:

  ```ts
  import { create } from "zustand";

  export const useRecipeStore = create<RecipeState>((set) => ({
    rawInput: null,
    loading: false,
    error: null,
    setRawInput: (input) => set({ rawInput: input, error: null }),
    clearInput: () => set({ rawInput: null, error: null }),
  }));
  ```

- In `RecipeInputScreen.tsx`:
  - Import: SafeAreaView, Text, TextInput, TouchableOpacity, View, Image, ScrollView, ActivityIndicator
  - Import expo-image-picker
  - Import useAuthStore (from Daniel – for guard)
  - Import useRecipeStore
  - Use useEffect: if !user → navigate to auth (or show redirect message)
  - Render:
    - Header: "Add New Recipe" title
    - Large multiline TextInput (placeholder: "Paste recipe text, URL, or use camera...")
    - Buttons row:
      - "Paste from Clipboard" (use Clipboard.getStringAsync → set to text input)
      - "Open Camera" → ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 })
      - "Pick from Library" → ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 0.8 })
    - Preview area: if image uri → <Image source={{ uri }} style={{ width: '100%', height: 200 }} />
    - "Process Recipe" button (large, primary color) → disabled if no input
  - On "Process" press:
    - Determine type:
      - If textInput has value and looks like URL (startsWith('http') or includes('youtube')/'tiktok') → {type: 'url', content: trimmed}
      - Else if textInput has value → {type: 'text', content: trimmed}
      - Else if image uri from picker → {type: 'image', uri, mimeType: result.assets[0].mimeType}
    - Call setRawInput with the object
    - Navigate to 'Processing' (placeholder screen – create simple one if needed or navigate to '/processing')
- Add permission request for camera/library on mount (expo-image-picker.requestMediaLibraryPermissionsAsync / requestCameraPermissionsAsync)
- Commit: `git commit -m "Implement RecipeInputScreen UI, raw input capture (text/url/image), recipeStore, types"`
- Push and create PR: `gh pr create --base main --title "Feature/recipe-input core" --body "Recipe ingestion UI and raw input handling"`

Prompt 1  
You are continuing work on the recipe input feature in branch feature/recipe-input.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth logic (only use guard), AI parsing (Moh owns), pantry, grocery, multi-recipe, cooking, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/recipe-input
- Enhance `RecipeInputScreen.tsx`:
  - Add auto-detect label: below input show "Detected: URL / Text / Image" based on current input
  - Add clear button (X icon) to reset input
  - Add character counter for text input (max 5000 chars – warn if over)
  - Improve image preview: add remove image button
  - Add paste listener: on focus, try Clipboard.getStringAsync and auto-fill if URL or long text
- Create `src/screens/ProcessingScreen.tsx` (simple placeholder for now):
  - Full screen with centered spinner + text "Extracting your recipe..."
  - Progress steps: "Validating input...", "Sending to AI...", "Parsing..."
  - After 3-5s auto-navigate to next (placeholder – later Moh hooks real parse)
  - On error: show retry button → back to input
- In `RecipeInputScreen.tsx`:
  - On "Process" press: set loading true in recipeStore → navigate('Processing')
  - In Processing: use useEffect to simulate delay then navigate to GroceryListScreen or ReviewScreen (placeholder)
- Add input validation:
  - For text: min length 20 chars
  - For url: valid http(s) + domain
  - For image: file size < 10MB (check result.assets[0].fileSize)
  - Show error toast if invalid
- Commit: `git commit -m "Add input validation, auto-detect, paste listener, ProcessingScreen placeholder, image remove"`
- Push and update existing PR

Prompt 2  
You are finalizing the recipe input feature in branch feature/recipe-input.  
Focus on polish, accessibility, error states, and integration readiness for AI handoff.  
Do NOT touch any other feature areas.

Execute these steps:

- In `RecipeInputScreen.tsx`:
  - Add accessibility labels: accessible={true} on inputs/buttons
  - Support voice input stub: note "Future: expo-speech-recognition for dictation"
  - Add recent inputs history (last 3) as chips below input → tap to reload
  - Persist draft input in AsyncStorage on blur (load on mount)
  - On successful submit (after validation): clear draft
- In `recipeStore.ts`:
  - Add draft: string | null
  - Actions: saveDraft, loadDraft (use zustand persist or manual AsyncStorage)
- In `ProcessingScreen.tsx`:
  - Use real navigation flow: after input set, let Moh’s parse action handle transition
  - Add cancel button → back to input
  - Show fun facts or tips while "processing" (array of strings rotate)
- Test flow locally:
  - Open app → go to input screen
  - Type text → paste URL → take photo → verify preview
  - Submit invalid → error shown
  - Submit valid → navigate to processing → (placeholder) proceeds
  - Draft persists after app restart
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Polish input UI: accessibility, draft persistence, recent history, error polish, processing UX"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/recipe-input should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in input-related files
- Test end-to-end in local app:
  - From home → navigate to input
  - Enter text/URL/image → validation passes
  - Submit → rawInput set in store → Processing shows → (Moh’s parse) → flows to review/grocery
  - Draft saved/restored
  - Accessibility: VoiceOver reads labels correctly
  - Cancel from processing → back to input with current draft
- If any bug found in input capture, validation, navigation to processing, or store sync, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for recipe-input-related adjustments during final smoke test (e.g. rawInput handoff to Moh’s parse, UI polish)
- Final commit if needed: `git commit -m "Final recipe input integration fixes, draft reliability, navigation polish"`

End of prompts for Manuel.
