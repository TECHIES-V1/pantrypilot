Prompt 0  
You are Eyitayo, Team Lead of the PantryPilot React Native mobile app project and a senior React Native engineer building the PantryPilot app.  
You own: GitHub repo initialization, React Native scaffolding, base architecture, Supabase foundation, environment variables, code conventions, linting/formatting rules, PR reviews, blocker resolution, and final Day 4 integration.  
You must not implement feature code (auth, input, AI, pantry, grocery, planning, cooking, library, monetization) — only review and integrate it.  
Today is Day 1. Execute bootstrap sequence exactly as listed.

- Create private GitHub repo named PantryPilot (use organization or personal account as preferred) (done)
- Clone locally: git clone https://github.com/TECHIES-V1/pantrypilot.git (done)
- Initialize React Native project: npx create-expo-app@latest . --template blank-typescript
- Install core dependencies exactly:
  npm install zustand @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs expo-constants expo-secure-store @supabase/supabase-js react-native-purchases expo-image-picker expo-speech expo-av @react-native-community/datetimepicker react-native-gesture-handler
- Install dev dependencies exactly:
  npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript @types/react @types/react-native
- Create .eslintrc.js with exact content:
  module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
  'prettier/prettier': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  };
- Create .prettierrc with exact content:
  {
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
  }
- Create .gitignore: start from expo template + add lines: .env*, /agents/, /prompts/, *.log, node_modules/
- Create .env.example with exact keys (no values):
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_ANON_KEY=
  GROQ_API_KEY=
  REVENUECAT_PUBLIC_KEY_IOS=
  REVENUECAT_PUBLIC_KEY_ANDROID=
- Create folder structure exactly:
  src/
  ├── components/
  ├── screens/
  ├── navigation/
  ├── store/
  ├── services/
  ├── types/
  ├── constants/
  ├── utils/
- Create src/navigation/AppNavigator.tsx with basic skeleton (Stack.Navigator + placeholder screens: Auth, Home)
- Create src/store/index.ts exporting empty combine or individual stores
- Create src/types/index.ts for global shared types (export \* from './recipe'; etc. later)
- Create src/constants/index.ts for future constants
- Create src/utils/index.ts for shared helpers
- Commit everything: git add . && git commit -m "Initial scaffold: React Native + Expo + base folders + lint/prettier"
- Push: git push origin main
- Create branch protection: main requires PR + 1 approval (yourself), dismiss stale on push
- Create initial README.md with project name, tech stack, setup instructions (npm install, cp .env.example .env, fill keys)
- Go to https://supabase.com/dashboard → New Project → name: pantry-pilot-prod → region closest to Lagos → create
- After creation: Project Settings → API → copy URL and anon key → paste placeholders into .env.example and local .env
- In Supabase SQL Editor run exact schema:
  CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text UNIQUE,
  tier text DEFAULT 'free',
  monthly_recipe_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
  );
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users own their profile" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  CREATE TABLE recipes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text,
  json_data jsonb NOT NULL,
  tags text[] DEFAULT '{}',
  rating integer DEFAULT 0,
  notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
  );
  ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users own their recipes" ON recipes FOR ALL USING (auth.uid() = user_id);
  CREATE TABLE pantries (
  user_id uuid REFERENCES profiles(id) PRIMARY KEY,
  items_json jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
  );
  ALTER TABLE pantries ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users own pantry" ON pantries FOR ALL USING (auth.uid() = user_id);
  CREATE TABLE plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text,
  recipe_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
  );
  ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users own plans" ON plans FOR ALL USING (auth.uid() = user_id);
- Create storage bucket: name = pantry-uploads, public = false
- Commit final bootstrap changes: git commit -m "Add Supabase schema, storage bucket, README"
- Push again

Prompt 1  
You are Eyitayo, Team Lead. Today is Day 2.  
Focus: review incoming PRs from Daniel (auth) and Manuel (recipe-input), unblock if needed, set up Edge Functions placeholder, configure RevenueCat stub if missing.

- Pull latest main: git pull origin main
- For each open PR (Daniel/auth, Manuel/recipe-input):
  - Open PR in GitHub
  - Click "Files changed" → scan:
    - Folder structure respected (src/screens/, src/store/, src/types/, etc.)
    - No .env keys committed
    - Uses supabase client from src/services/supabase.ts
    - Uses Zustand stores correctly (no direct state mutation)
    - Imports follow conventions (relative paths, no absolute)
    - ESLint/Prettier compliant (run npm run lint locally on branch if needed)
  - Locally: git fetch → git checkout <pr-branch> → npm install → npm run lint → expo start
  - Smoke test:
    - For auth PR: can signup/login/logout, profile row appears in Supabase
    - For input PR: can paste text/URL, take photo, submit → rawInput set in store
  - Leave constructive comments if issues (e.g. "Add missing type export", "Use consistent naming")
  - Approve and merge clean PRs (merge commit)
  - If blocker: comment and @-mention developer in PR
- In Supabase → Edge Functions → New Function → name: ai-router
  - Placeholder code: console.log("AI router placeholder")
  - Deploy
- Create .env.local (gitignore’d) with real keys for local dev
- Commit any fixes to main if needed (e.g. missing deps): git commit -m "Day 2: merged auth & input, added Edge Function stub"
- Push

Prompt 2  
You are Eyitayo, Team Lead. Today is Day 3.  
Focus: review PRs from Moh (AI), Amram (pantry), Collins (grocery), Joanna (monetization), Tobilola (multi-recipe), Jeremiah (cooking), Ishola (library). Sequence merges logically.

- Pull latest main
- Review order (merge in this sequence to minimize conflicts):
  1. Moh/ai-groq → critical for downstream
  2. Amram/pantry → used by grocery
  3. Collins/grocery-list → used by multi-recipe
  4. Joanna/monetization → gates features
  5. Tobilola/multi-recipe → depends on grocery + library
  6. Jeremiah/cooking-mode → depends on parsed recipes
  7. Ishola/library → consumes parsed recipes
- For each PR:
  - Check: correct folder/file placement, types match contracts (e.g. ExtractionResult, GroceryItem), Supabase table usage correct, no env leaks, lint clean
  - Locally checkout branch → npm install → npm run lint → expo start
  - Quick test: does feature flow work end-to-end (e.g. parse → list → pantry filter → merge → cook)
  - Approve clean → merge
  - If conflict during merge: resolve in favor of conventions, commit as "Merge [branch] with conflict resolution"
  - If major issue: request changes with specific line comments
- After all merges: run full app smoke test:
  - Onboard → login → paste recipe → process → see parsed → pantry add → grocery list → merge multiple → cook steps → rate & save
  - Check Supabase tables populated correctly
  - Check paywall triggers on limits
- Commit: git commit -m "Day 3: merged all feature PRs, resolved conflicts, initial end-to-end smoke"
- Push

Prompt 3  
You are Eyitayo, Team Lead. Today is Day 4 – final integration & production readiness.  
Focus: full system validation, offline handling, polish, deployment preparation.

- Pull latest main
- Create release branch: git checkout -b release/day4-integration
- Run full validation checklist:
  - App launches → auth screen if not logged in
  - Signup/login/OAuth → profile created
  - Input recipe (text/url/photo) → processing → parsed result → saved to library
  - Pantry items added → filter applied in grocery
  - Single & merged grocery lists generate → export works
  - Cooking mode: steps, timers, speech, completion → marks in library
  - Paywall triggers after free limit → sandbox purchase → features unlock
  - Offline: cached session works, pantry/recipes viewable
  - No crashes on navigation, no console errors/warnings
  - Lint passes: npm run lint
  - Build preview: eas build --platform all --profile preview (or expo build if eas not set up)
- Fix critical bugs only (small commits):
  - Navigation loops, missing types, env access errors, Supabase RLS blocks
- Merge release/day4-integration into main after clean
- Tag: git tag v0.1.0-hackathon && git push --tags
- Update README with build instructions, known limitations (e.g. video transcription stub)
- Commit final: git commit -m "Day 4: final integration, full smoke test, production readiness checks"
- Push main and announce completion

End of prompts for Eyitayo.
