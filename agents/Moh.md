Role Summary

- AI / Groq integration & parsing logic owner

What You Are Building

- Groq API client
- Prompt templates for extraction/normalization/substitution
- Confidence scoring & error handling
- Edge function router if needed

Step-by-Step Tasks (Execution-Level)

- Create branch feature/ai-groq from main
- Install groq-sdk if available or use fetch
- Create src/services/groq.ts:
  const GROQ_API_KEY = process.env.GROQ_API_KEY!;
  export async function extractRecipe(input: string) { ... fetch('https://api.groq.com/openai/v1/chat/completions', { ... }) }
- Define system prompt in constants/prompts.ts:
  export const EXTRACTION_PROMPT = `You are a recipe parser. Extract ingredients and steps from the following text. Output JSON only: { "ingredients": [{ "item": string, "quantity": number, "unit": string, "original": string }], "steps": string[], "title": string?, "servings": number?, "time": string? } Confidence: number (0-1)`
- Create similar prompts for substitution and normalization
- In recipeStore action: async parseCurrentInput() { const result = await groq.extractRecipe(get().rawInput); set({ parsed: result, confidence: result.confidence }) }
- If confidence < 0.8 show manual edit prompt
- Handle video: if input is video URL → placeholder note "transcription via Whisper later"
- Commit & PR

Files & Directories You Own

- src/services/groq.ts
- src/constants/prompts.ts
- src/store/recipeStore.ts (parsing actions)

Interfaces With Other Work

- Expects: rawInput from Manuel, env key from Eyitayo
- Provides: parsed recipe JSON shape to Collins / Tobilola

Validation Checklist

- Groq call succeeds with sample text
- Returns valid JSON matching schema
- Confidence field present
- Low confidence triggers UI warning
- Substitution prompt returns ranked list
