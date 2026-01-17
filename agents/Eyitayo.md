Role Summary

- Team Lead – owns project bootstrap, architecture conventions, Supabase foundation, code reviews, and final integration

What You Are Building

- GitHub repo structure and initial commit
- React Native base project with navigation and state
- Supabase project + auth/DB/storage setup with RLS
- Environment variable template
- Code style/linting/formatting rules
- PR review process and merge authority

Step-by-Step Tasks (Execution-Level)

- Create new private GitHub repo named PantryPilot
- Clone repo locally: git clone https://github.com/<your-org>/PantryPilot.git
- Run: npx create-expo-app@latest . --template blank-typescript
- Install core deps: npm install zustand @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs expo-constants expo-secure-store @supabase/supabase-js
- Install dev deps: npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
- Create .eslintrc.js with: { extends: ["expo", "prettier"], plugins: ["prettier"], rules: { "prettier/prettier": "error" } }
- Create .prettierrc with: { "semi": true, "trailingComma": "es5", "singleQuote": true, "printWidth": 100 }
- Create .gitignore from expo template + add /agents, .env.local
- Create .env.example with: EXPO_PUBLIC_SUPABASE_URL= EXPO_PUBLIC_SUPABASE_ANON_KEY= GROQ_API_KEY= REVENUECAT_PUBLIC_KEY_IOS= REVENUECAT_PUBLIC_KEY_ANDROID=
- Create folder structure: src/ ├── components/ ├── screens/ ├── navigation/ ├── store/ ├── services/ ├── types/ ├── constants/ ├── utils/
- In src/navigation/AppNavigator.tsx create basic stack + tab navigator skeleton
- In src/store/index.ts create empty Zustand store export
- Go to https://supabase.com/dashboard → New Project → name: pantry-pilot-prod → region: closest to Lagos → create
- In Supabase → Project Settings → API → copy URL and anon key → paste into .env.example and local .env
- In Supabase SQL Editor run:
  CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text UNIQUE,
  tier text DEFAULT 'free',
  monthly_recipe_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
  );
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
- Create storage bucket: pantry-uploads with public false
- Create Edge Function placeholder: supabase functions new ai-router
- Commit all changes: git add . && git commit -m "Initial scaffold + Supabase foundation"
- Create branch protection rule: main requires PR + 1 approval (yourself)
- Days 2–4: For each incoming PR:
  - Pull locally
  - npm run lint && npm test (if tests exist)
  - Verify folder/file locations match agreed structure
  - Check env vars not committed
  - Run app locally → smoke test affected flows
  - Approve and merge if clean
- Day 4 morning: Create integration branch feature/full-integration
- Merge approved PRs in this order: auth → recipe-input → ai → pantry → grocery → multi-recipe → cooking → library → monetization
- Resolve conflicts
- Run full app smoke test: onboard → paste recipe → extract → pantry → list → cook → paywall trigger
- Create final commit: "Day 4 integration complete"
- Build expo preview: eas build --platform all --profile preview

Files & Directories You Own

- .github/
- .eslintrc.js
- .prettierrc
- .env.example
- App.tsx
- src/navigation/
- src/store/index.ts
- src/types/
- src/constants/
- src/utils/
- Root package.json, tsconfig.json, app.json

Interfaces With Other Work

- Provides: Supabase URL/key, auth table structure, folder conventions, Zustand store shape
- Expects from others: PRs targeting feature/ branches
- Publishes: merged main branch daily

Validation Checklist

- Repo exists and is cloned
- App runs with expo start --dev-client
- .env keys are present (not committed)
- Supabase tables profiles and policies exist
- Storage bucket pantry-uploads created
- All Day 1–3 PRs merged before Day 4 integration
- Final build succeeds without auth/supabase errors
