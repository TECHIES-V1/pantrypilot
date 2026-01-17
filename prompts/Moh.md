/prompts/Moh.md

Prompt 0  
You are a senior React Native + AI integration engineer building the PantryPilot app.  
Your sole ownership is the AI system integration with Groq (all inference, prompt engineering, extraction, normalization, substitution logic, confidence scoring, error handling).  
You must not touch authentication, recipe input UI, pantry management, grocery list generation, multi-recipe merging, cooking mode, recipe library, nutritional insights, monetization/paywalls, or any non-AI logic.  
You start today (Day 2). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth, Manuel’s recipe input (rawInput in recipeStore), and basic Zustand + Supabase client already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/ai-groq`
- Create folder `src/services/groq/`
- Inside it, create `groqClient.ts`
- Create `src/constants/prompts.ts`
- Create `src/types/ai.ts` with these exact types:

  ```ts
  export interface ExtractionResult {
    title?: string;
    servings?: number;
    time?: string;
    ingredients: Array<{
      item: string;
      quantity: number;
      unit: string;
      original: string;
    }>;
    steps: string[];
    confidence: number; // 0–1
  }

  export interface SubstitutionSuggestion {
    original: string;
    suggested: string;
    reason: string;
    confidence: number;
  }
  ```

- In `groqClient.ts`:
  - Import { createClient } from 'groq-sdk' or use fetch for /openai/v1/chat/completions
  - Export async function callGroq(messages: {role: 'system'|'user', content: string}[], model = 'llama3-70b-8192', temperature = 0.2)
  - Handle API key from process.env.GROQ_API_KEY
  - Add retry logic: 3 attempts on 429/5xx errors with exponential backoff (200ms → 800ms → 3200ms)
  - Return { content: string, usage: any } or throw structured error
- In `prompts.ts` define these constants (exact text):

  ```ts
  export const SYSTEM_EXTRACTION = `You are a precise recipe extraction engine. 
  From the provided text (which may be scraped web, transcribed video, or raw input), extract:
  - title (if present)
  - servings (number)
  - time (string, e.g. "30 minutes")
  - ingredients: array of objects {item, quantity (number), unit (string), original (full phrase)}
  - steps: array of clear, numbered step strings
  Output ONLY valid JSON matching this schema: {title?:string, servings?:number, time?:string, ingredients:array, steps:array, confidence:number (0-1, self-assess accuracy)}
  Be strict: if data is missing or unclear, set confidence low and omit where possible.`;

  export const SYSTEM_NORMALIZE = `You are an ingredient normalizer.
  Take array of raw ingredients, standardize:
  - item names (lowercase, singular, common name e.g. "tomatoes" → "tomato")
  - units (standardize abbreviations: tbsp → tablespoon, g → gram)
  - quantities (convert fractions to decimal if needed)
  Output ONLY array of normalized objects matching input shape.`;

  export const SYSTEM_SUBSTITUTE = `You are a smart substitution advisor.
  Given original ingredient and user context (pantry items, dietary prefs), suggest up to 3 alternatives ranked by suitability.
  Output ONLY JSON: {suggestions: [{original:string, suggested:string, reason:string, confidence:number}]}`;
  ```

- Commit: `git commit -m "Implement Groq client, prompt constants, AI result types"`
- Push and create PR: `gh pr create --base main --title "Feature/ai-groq core infrastructure" --body "Groq client, base prompts, types"`

Prompt 1  
You are continuing work on the AI/Groq feature in branch feature/ai-groq.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify recipe input UI, pantry, grocery, multi-recipe, cooking, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/ai-groq
- In `src/store/recipeStore.ts` (extend existing):
  - Add action async parseCurrentInput()
  - Get rawInput from state
  - If rawInput is string (text/URL):
    - Call groqClient with SYSTEM_EXTRACTION + user message: rawInput
  - If rawInput is object with uri (photo):
    - Placeholder: console.warn("Image OCR not yet implemented – treating as text")
    - For now: assume text input only; future: route to vision model
  - Parse response.content as JSON → validate shape → set parsed: ExtractionResult
  - If confidence < 0.8: set needsReview: true
  - On error: set error message, retry button
- Create `src/screens/ProcessingScreen.tsx` (AI progress):
  - Simple full-screen with animated spinner
  - Text: "Extracting recipe..."
  - Step messages: "Transcribing...", "Parsing ingredients...", "Normalizing..."
  - On success: navigate to review/edit screen or directly to grocery
  - On fail: show retry / manual entry
- Update Manuel’s RecipeInputScreen (minimal change):
  - On submit: set rawInput → navigate to ProcessingScreen
- Commit: `git commit -m "Add recipe parsing action in recipeStore, ProcessingScreen, confidence handling"`
- Push and update existing PR

Prompt 2  
You are finalizing the AI/Groq feature in branch feature/ai-groq.  
Focus on normalization, substitutions, error resilience, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- In `recipeStore.ts`:
  - After extraction: call normalizeIngredients(parsed.ingredients) using SYSTEM_NORMALIZE prompt
  - Update parsed.ingredients with normalized versions
  - Add action async getSubstitutions(ingredient: string, context: {dietary: string[], pantry: string[]})
    - Prompt: SYSTEM_SUBSTITUTE + user message: `Original: ${ingredient}. Context: dietary ${context.dietary.join(', ')}, pantry has ${context.pantry.join(', ')}`
    - Return SubstitutionSuggestion[]
- Create `src/components/AIReviewModal.tsx`:
  - Show if confidence < 0.8 or user taps "Review"
  - Display extracted title, ingredients list (editable qty/unit), steps
  - Allow manual edits → update parsed in store
  - Confirm button to proceed
- Add video/URL handling stub:
  - If rawInput starts with youtube/tiktok: note "Future: extract captions/transcribe via Whisper"
  - For now: pass URL directly to prompt and instruct LLM to imagine content if no scrape
- Test flow locally:
  - Paste sample recipe text → observe parsed JSON in console/store
  - Check confidence score realistic
  - Request substitutions for one ingredient → verify suggestions
  - Force low confidence (bad input) → see review modal trigger
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Add normalization post-extraction, substitutions, AI review modal, video stub"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/ai-groq should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in AI-related files
- Test end-to-end in local app:
  - Input recipe text/URL → ProcessingScreen → parsed result appears
  - Low-confidence input → review modal shows editable fields
  - Proceed → parsed data flows to grocery list (via recipeStore)
  - Request substitution in future UI → API call succeeds
- If any bug found in parsing, confidence logic, prompt output, or latency, fix and commit small patch (e.g. tweak temperature, add timeout)
- Optimize: add max_tokens: 1500, temperature: 0.1 for extraction consistency
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for AI-related adjustments during final smoke test (e.g. bad parse → review flow)
- Final commit if needed: `git commit -m "Final AI/Groq integration fixes, latency tweaks, validation"`

End of prompts for Moh.
