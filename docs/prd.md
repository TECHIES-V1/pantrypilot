# Product Requirements Document

## Product Vision & Value Proposition

The Recipe → Kitchen app empowers users to seamlessly transition from discovering recipes online to executing them in their home kitchen, by automating the extraction, planning, and guidance processes. It solves the core problem of recipe abandonment, where users save countless recipes from social media, videos, and websites but fail to act due to manual planning overhead, forgotten ingredients, and disorganized execution. The primary value delivered is time savings and reduced waste, enabling users to cook more frequently with confidence, achieve better meal variety, and minimize grocery overspending through intelligent, personalized tools.

## Target Users & Use Cases

- Primary user personas:
  - Busy professionals (25-40 years old): Working individuals with limited time for meal prep, seeking quick ways to incorporate new recipes without extensive planning.
  - Home cooks and parents (30-50 years old): Families managing household meals, focused on cost efficiency, dietary restrictions, and reducing food waste.
  - Health enthusiasts (20-45 years old): Users tracking nutrition or following specific diets, needing tools to adapt recipes to their preferences.

- Key pain points:
  - Overwhelm from unstructured recipe sources (e.g., videos with spoken instructions, web pages with ads).
  - Manual transcription of ingredients and steps, leading to errors or abandonment.
  - Inefficient grocery shopping due to unmerged lists from multiple recipes.
  - Lack of context-aware adjustments, such as substitutions based on pantry stock or allergies.

- Core user journeys (realistic scenarios):
  - Weeknight meal planning: A busy professional scrolls TikTok during commute, saves a salad video, opens the app at home, pastes the link, adds pantry items, generates a grocery list for missing ingredients, shops via integrated export, and follows guided cooking steps.
  - Weekly batch prep: A parent plans family meals by ingesting three web recipes, merges them into one list with deduplicated items, applies substitutions for dietary needs, and uses cooking mode for sequential preparation.
  - Spontaneous adaptation: A health enthusiast photographs a magazine recipe, extracts details, normalizes ingredients to match their low-carb diet, and receives alternative suggestions before finalizing the plan.

## Functional Requirements (User-Facing)

- Recipe ingestion: Supports input via URL pasting (videos from YouTube/TikTok/Instagram, web links), plain text entry, or photo upload (e.g., screenshot or scanned page). App validates input type automatically and prompts for clarification if needed. Outputs structured data: list of ingredients with quantities/units, sequential steps, estimated time/serving size.
- Ingredient extraction: AI processes input to identify and parse ingredients (e.g., "2 cups flour" → {item: "flour", quantity: 2, unit: "cups"}). Handles variations in formatting, abbreviations, and languages (English primary, with basic support for Spanish/French via Groq).

- Pantry/fridge context: Users maintain a persistent inventory list via manual entry, barcode scanning (using device camera), or photo upload for OCR extraction. App cross-references against recipe needs to flag available items and suggest exclusions from grocery lists.

- Grocery list generation: Creates categorized, sortable lists (e.g., by store aisle: produce, dairy) with quantities scaled by servings. Includes export options to Apple Wallet, email, or third-party apps (e.g., Instacart via deep links). Supports manual edits and sharing via link.

- Multi-recipe planning: Users select multiple saved recipes to merge into a single plan. App deduplicates ingredients (e.g., combines quantities), resolves conflicts (e.g., different units), and generates a unified grocery list and sequenced cooking schedule.

- Cooking execution support: Step-by-step guided mode with timers, voice prompts (text-to-speech via device API), and progress tracking. Allows pausing/resuming, note-taking on adjustments, and post-cook feedback to refine future suggestions.

Additional features:

- Recipe library: Users save parsed recipes with tags (e.g., "vegetarian"), search by keyword, and rate for personalization.
- Nutritional insights: Basic calorie/protein estimates per recipe, sourced from standardized databases.
- Notifications: Reminders for expiring pantry items or weekly planning prompts.

## User Flow (End-to-End)

- Onboarding: Upon first open, app presents a 3-screen carousel: (1) Welcome with value prop and "Get Started" button; (2) Supabase auth screen for email/password or OAuth (Google/Apple), creating user profile; (3) Quick setup for dietary preferences (multi-select: vegan, gluten-free) and initial pantry scan prompt. Skippable elements default to basics, with later nudges.

- First successful action: Post-onboarding, home screen prompts "Paste Your First Recipe." User inputs a URL/text/photo, app processes via AI, displays extracted ingredients/steps for review/edit, generates grocery list. Success confirmed via "List Ready" toast and navigation to list view, with tutorial overlay highlighting key actions.

- Core recurring loop: Home screen shows recent recipes and quick actions. User: (1) Adds new recipe via input screen; (2) Reviews/edits extraction in detail view; (3) Adds pantry context if needed; (4) Generates/merges lists in planning screen; (5) Exports or proceeds to cooking mode. Loop closes with post-cook save to library, triggering satisfaction survey.

- Long-term retention loop: App builds user history in profile (e.g., favorite ingredients, past substitutions). Weekly digest notification summarizes usage (e.g., "You saved $20 on groceries last week"). Advanced features (e.g., AI-suggested weekly plans) unlock via tiers, encouraging upgrades. Community sharing (e.g., export recipes to friends) fosters virality, with data used to personalize feeds.

## AI System Design (Using Groq)

- Inputs to AI: Raw content (transcribed video text, scraped web text, OCR'd image text), user context (dietary prefs, pantry list as JSON), and metadata (e.g., serving size adjustments).

- Tasks performed: (1) Extraction: Parse into structured JSON (ingredients array, steps array); (2) Normalization: Standardize items/units (e.g., "tbsp" → "tablespoon") using predefined mappings; (3) Reasoning: Generate substitutions, deduplicate across recipes, estimate nutrition.

- Recipe parsing:
  - Videos: Use Groq's Whisper model for audio transcription, then feed transcript + captions to LLM (e.g., Llama-3) for extraction.
  - Web links: Fetch content via Supabase Edge Function (to scrape HTML), pass cleaned text to Groq LLM for parsing.
  - Plain text: Direct input to Groq LLM for structured output.

- Ingredient normalization and deduplication: LLM outputs standardized JSON; app logic merges by item name similarity (e.g., Levenshtein distance >90%), sums quantities, converts units (e.g., oz to grams via lookup table).

- Substitution logic: Groq LLM queries a prompt with user prefs/pantry (e.g., "Suggest 3 subs for butter if user is vegan"), ranked by relevance. App selects top match or presents options.

- Error handling and confidence scoring: Groq responses include self-assigned confidence (0-1) per extraction; if <0.8, prompt user for manual review. Fallback to partial outputs (e.g., ingredients only if steps unclear).

## Technical Architecture

- Mobile (React Native):
  - App structure: Modular components (e.g., screens for home, input, list, cooking) under /src, with shared utils for API calls. Navigation via React Navigation stack/tab hybrid.
  - State management: Zustand for global state (user profile, current recipes, pantry), with persistence via AsyncStorage for offline. Local caching of recent AI responses.
  - Offline considerations: Queue inputs for processing when online; store parsed recipes locally; use Supabase offline mode for DB sync.

- Backend (Supabase):
  - Auth flow: JWT-based via Supabase SDK; post-signup, create user row in 'profiles' table with defaults.
  - Database schema: Tables include 'users' (id, email, tier), 'recipes' (id, user_id, json_data, created_at), 'pantries' (user_id, items_json), 'plans' (id, user_id, merged_recipes_array). Relations enforced via foreign keys.
  - Storage: Bucket for user-uploaded images (e.g., pantry photos), with signed URLs for access.
  - Security: Row-level security (RLS) policies: users own their data (e.g., select/insert where auth.uid() = user_id); no public access.

- AI Layer (Groq):
  - Inference: Client-side calls to Groq API via SDK, with API key stored in env vars (not bundled). Heavy tasks (e.g., video transcription) routed through Supabase Edge Functions for rate limiting.
  - Prompt structure: System prompt defines output schema (JSON); user prompt includes input text + context (e.g., "Extract ingredients and steps from: [text]. Output as {ingredients: [...], steps: [...]}").
  - Latency: Target <5s for extraction; use streaming for long responses; fallback to cached similar recipes if timeout.

## Additional Tech Stack Suggestions

- AssemblyAI (for advanced video transcription if Groq Whisper insufficient): Justified for handling noisy audio or accents better; free tier offers 100 minutes/month. Integrates via Supabase Edge Function calling AssemblyAI API, passing audio URL and receiving transcript for Groq.
- Cheerio (for web link scraping): Node.js library in Supabase Edge Functions; free/open-source. Justified to parse HTML cleanly before Groq; integrates by deploying function that fetches URL, extracts main content, and returns text.

- No other additions; Groq handles vision (Llama-3.2) for image OCR, and core stack suffices for rest.

## Monetization & RevenueCat Integration

- Free vs Plus vs Pro features:
  - Free: Up to 5 recipes/month, basic extraction, single grocery lists, manual pantry.
  - Plus ($4.99/month): Unlimited recipes, multi-recipe merging, substitutions, recipe history.
  - Pro ($9.99/month): All Plus + nutritional analysis, weekly AI plans, priority AI (faster Groq queues), export integrations.

- Usage limits: Enforced via Supabase DB counters (e.g., monthly_recipe_count); reset on tier upgrade or billing cycle.

- Paywall logic: Appears as modal after Free limits (e.g., on 6th recipe: "Upgrade for more"), or when accessing gated features (e.g., tap "Merge" → paywall).

- Monetization gates in user flow: Post-extraction for Free users if limit hit; in planning screen for merging; profile for tier management.

- RevenueCat enforcement: SDK integrated in app; on launch, fetch entitlements via purchaserInfo; gate features client-side (e.g., if !entitlements.active['plus'], disable button). Handles purchases via native UI, syncs with Supabase via webhook (update user tier in DB).

## Non-Functional Requirements

- Performance: App load <2s; AI calls <5s average; support 100k MAU with Supabase scaling (auto-tier up). Offline mode for viewing saved data.

- Reliability: 99.9% uptime; error logging via Sentry; retry logic for AI/network failures (3 attempts). Test coverage >80% for core flows.

- Data privacy: GDPR-compliant; anonymize AI prompts; user data encrypted at rest in Supabase. No sharing without consent; delete on account removal.

- Cost awareness: Use Groq's free tier initially (scale to paid); monitor Supabase usage (start with free plan, alert at 80% limits); optimize AI calls by caching common recipes.

## Success Metrics

- Activation: % of new users completing first recipe extraction within 24 hours (>60% target).

- Engagement: DAU/MAU ratio (>20%); average recipes processed per session (>2).

- Retention: D7 retention (>40%); D30 retention (>25%); churn rate (<10%/month).

- Monetization: Conversion rate to paid (>5%); ARPU (> $1/month); LTV (> $20/user).
