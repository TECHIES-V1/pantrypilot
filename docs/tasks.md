# Roles & Responsibilities (Primary Ownership)

## Eyitayo (Team Lead)

- Responsibilities: Oversee project setup, establish code conventions (e.g., folder structure, naming, linting), configure Supabase (auth, DB schema, storage), set up React Native base (navigation, state with Zustand), manage GitHub repo and branching strategy, conduct code reviews, resolve blockers, and lead final integration merges.
- Deliverables: Initialized repo with README, env files, base app scaffold; Supabase project configured with RLS policies; review comments on PRs; merged codebase on Day 4.
- Explicitly not responsible for: Implementing user-facing features, AI prompts, or monetization logic.
- Dependencies: None (starts everything).

## Daniel

- Responsibilities: Implement authentication flows using Supabase, including email/password, OAuth (Google/Apple), and user profile management.
- Deliverables: Auth screens, session handling in Zustand, profile table updates; tested login/signup/logout flows.
- Explicitly not responsible for: Any AI-related tasks or frontend UI beyond auth screens.
- Dependencies: Supabase setup from Eyitayo.

## Manuel

- Responsibilities: Build recipe ingestion features, handling inputs (URL, text, photo) and initial validation.
- Deliverables: Input screen components, auto-detection logic, integration with device camera for photos; exported structured input data.
- Explicitly not responsible for: AI parsing or pantry integration.
- Dependencies: Base app scaffold from Eyitayo.

## Moh

- Responsibilities: Develop AI system integration with Groq, including prompt structures for extraction, normalization, and substitutions.
- Deliverables: API wrappers for Groq calls, error handling with confidence scoring, JSON output parsing; tested endpoints for video/web/text inputs.
- Explicitly not responsible for: User input handling or grocery list generation.
- Dependencies: Supabase Edge Functions from Eyitayo; transcription tools if needed.

## Amram

- Responsibilities: Create pantry/fridge context management, including inventory storage, manual entry, barcode/OCR scanning.
- Deliverables: Pantry screen, data persistence in Supabase, cross-reference logic with recipes; updated pantry JSON in user profiles.
- Explicitly not responsible for: Recipe parsing or cooking mode.
- Dependencies: Auth and DB schema from Daniel and Eyitayo.

## Collins

- Responsibilities: Implement grocery list generation, including categorization, exports, and manual edits.
- Deliverables: Grocery list screen, sorting/checkbox logic, export to Wallet/email; handling of scaled quantities.
- Explicitly not responsible for: Multi-recipe merging or nutritional insights.
- Dependencies: Ingredient extraction from Moh.

## Tobilola

- Responsibilities: Handle multi-recipe planning, merging lists, deduplication, and conflict resolution.
- Deliverables: Planning screen for selecting/merging recipes, unified list generation; storage of plans in Supabase.
- Explicitly not responsible for: Single recipe features or monetization gates.
- Dependencies: Grocery list base from Collins; AI normalization from Moh.

## Jeremiah

- Responsibilities: Build cooking execution support, including step-by-step guidance, timers, and voice prompts.
- Deliverables: Cooking mode screen, progress tracking, device API integrations for TTS/timers; post-cook feedback loop.
- Explicitly not responsible for: Onboarding or library management.
- Dependencies: Recipe steps from Moh.

## Ishola

- Responsibilities: Develop recipe library, search, tagging, and nutritional insights features.
- Deliverables: Library screen with search/tags/ratings, basic nutrition estimation logic; history persistence in Supabase.
- Explicitly not responsible for: Notifications or offline handling.
- Dependencies: Recipe data from Manuel and Moh.

## Joanna

- Responsibilities: Integrate RevenueCat for monetization, including tier enforcement, paywalls, and usage limits.
- Deliverables: Paywall modals, entitlement checks in Zustand, webhook sync with Supabase; tier-based feature gating.
- Explicitly not responsible for: Any AI or core feature implementation.
- Dependencies: Auth from Daniel; base state from Eyitayo.
