Role Summary

- Authentication & user profile owner

What You Are Building

- Login / signup / logout flows
- Supabase auth integration
- Profile creation and basic read/update

Step-by-Step Tasks (Execution-Level)

- Wait for Eyitayo to merge initial scaffold (main branch)
- Create branch: git checkout -b feature/auth
- Install @supabase/supabase-js if not present
- Create src/services/supabase.ts:
  import { createClient } from '@supabase/supabase-js';
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  export const supabase = createClient(supabaseUrl, supabaseKey);
- Create src/screens/AuthScreen.tsx with email/password + Google/Apple buttons
- Use supabase.auth.signInWithPassword / signUp / signInWithOAuth
- On successful auth → upsert profile:
  await supabase.from('profiles').upsert({ id: user.id, email: user.email });
- Create src/store/authStore.ts with Zustand:
  interface AuthState { user: any | null; loading: boolean; }
  export const useAuthStore = create<AuthState & Actions>((set) => ({ ... }))
- Add auth listener in App.tsx: supabase.auth.onAuthStateChange(...)
- Create logout button in profile placeholder screen
- Add loading state + redirect logic: if !user → AuthScreen else Home
- Commit & push: git commit -m "Implement Supabase auth + profile" && gh pr create

Files & Directories You Own

- src/screens/AuthScreen.tsx
- src/services/supabase.ts (auth parts)
- src/store/authStore.ts
- App.tsx (auth listener & initial route)

Interfaces With Other Work

- Expects: Supabase client from Eyitayo, profiles table schema
- Provides: useAuthStore hook, authenticated Supabase client usage pattern

Validation Checklist

- Can sign up with email
- Can login
- Google/Apple OAuth works
- Profile row appears in Supabase after signup
- App redirects to home after login
- Logout clears session and returns to auth
