/prompts/Daniel.md

Prompt 0  
You are a senior React Native + Supabase engineer building the PantryPilot app.  
Your sole ownership is the authentication flows, Supabase auth integration, user profile creation/read/update, and session management.  
You must not touch recipe input UI, AI/Groq parsing, pantry management, grocery list generation, multi-recipe planning, cooking mode, recipe library, nutritional insights, monetization/paywalls, or any feature logic beyond auth and profile.  
You start today (Day 1). The repo is freshly scaffolded by Eyitayo with React Native base, Supabase client placeholder, Zustand setup, folder structure (src/services, src/store, src/screens, src/types, etc.), and .env.example already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/auth`
- In `src/services/supabase.ts` (Eyitayo may have stubbed it):
  - Ensure it exports:
    ```ts
    import { createClient } from "@supabase/supabase-js";
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
- Create `src/screens/AuthScreen.tsx`:
  - Import necessary: TextInput, Button, View, Text, TouchableOpacity, ActivityIndicator
  - Render form with:
    - Email TextInput (autoCapitalize none, keyboardType email-address)
    - Password TextInput (secureTextEntry)
    - "Sign In" button → supabase.auth.signInWithPassword({email, password})
    - "Sign Up" button → supabase.auth.signUp({email, password})
    - "Sign in with Google" button → supabase.auth.signInWithOAuth({provider: 'google'})
    - "Sign in with Apple" button → supabase.auth.signInWithOAuth({provider: 'apple'})
    - Loading spinner during auth calls
    - Error text display
- Create `src/store/authStore.ts`:

  ```ts
  import { create } from "zustand";
  import { supabase } from "../services/supabase";

  interface AuthState {
    user: any | null;
    session: any | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
  }

  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    error: null,
    initialize: async () => {
      set({ loading: true });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, loading: false });
    },
    signIn: async (email, password) => {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) set({ error: error.message, loading: false });
      else set({ session: data.session, user: data.user, loading: false });
    },
    // similar for signUp, signInWithGoogle, signInWithApple
    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    },
  }));
  ```

- In `App.tsx`:
  - Import useAuthStore
  - In useEffect: useAuthStore.getState().initialize()
  - Add auth listener:
    ```ts
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        useAuthStore.setState({ session, user: session?.user ?? null });
      },
    );
    return () => listener.subscription.unsubscribe();
    ```
  - Conditional render: if loading → spinner, else if !user → <AuthScreen />, else <AppNavigator />
- Commit: `git commit -m "Implement Supabase auth flows, authStore, AuthScreen UI, session listener"`
- Push and create PR: `gh pr create --base main --title "Feature/auth core" --body "Full authentication with email, OAuth, profile sync stub"`

Prompt 1  
You are continuing work on the authentication feature in branch feature/auth.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify recipe input, AI, pantry, grocery, multi-recipe, cooking, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/auth
- In Supabase SQL Editor (dashboard):
  - Confirm profiles table exists (Eyitayo created it)
  - Add policy if missing:
    ```sql
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    ```
- In `authStore.ts`:
  - After successful signIn / signUp:
    - Upsert profile:
      ```ts
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          tier: "free",
          monthly_recipe_count: 0,
        },
        { onConflict: "id" },
      );
      ```
  - Add action refreshProfile: fetch current profile row and store in state (profile: any)
- In `AuthScreen.tsx`:
  - Add loading state per button (separate spinners)
  - Show success toast on signup: "Account created – check email for confirmation if needed"
  - Add "Forgot Password?" link → supabase.auth.resetPasswordForEmail(email)
- Create `src/screens/ProfileScreen.tsx` (placeholder):
  - Show current user email, tier
  - Button "Sign Out" → call signOut
  - Add to navigation (Eyitayo will hook up later)
- Test flow locally:
  - expo start
  - Sign up → verify profile row in Supabase
  - Sign in → redirect to home
  - Sign out → back to auth
  - OAuth (sandbox) → creates profile
- Commit: `git commit -m "Add profile upsert on auth, refreshProfile action, forgot password, basic ProfileScreen"`
- Push and update existing PR

Prompt 2  
You are finalizing the authentication feature in branch feature/auth.  
Focus on edge cases, security, offline handling, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- In `authStore.ts`:
  - Add offline detection: if !navigator.onLine → set error "No internet – cached session used"
  - On initialize: if cached session but no network → use cached user
  - Add refreshSession: supabase.auth.refreshSession()
- In `AuthScreen.tsx`:
  - Add email confirmation check: after signup, show "Check your email to confirm" if !user.confirmed_at
  - Disable buttons during loading
  - Add password visibility toggle icon
- Create `src/utils/authUtils.ts`:
  - Export validateEmail(email: string): boolean (simple regex)
  - Use in form: show error if invalid
- Test edge cases:
  - Wrong password → error message
  - Network off → fallback to cached
  - Signup with existing email → error
  - OAuth redirect back → session set
- Ensure no keys/secrets committed (check .gitignore)
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Add offline fallback, email validation, password toggle, edge case handling"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/auth should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in auth-related files
- Test end-to-end in local app:
  - Fresh install → lands on AuthScreen
  - Signup → profile created, redirects to home
  - Login → same
  - OAuth flow (if testable) → works
  - Sign out → back to auth
  - Offline login → uses cached session
  - Protected screens (future) → redirect to auth if unauthenticated
- If any bug found in session sync, profile upsert, OAuth, or redirect logic, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for auth-related adjustments during final smoke test (e.g. gated navigation, user id passing)
- Final commit if needed: `git commit -m "Final auth integration fixes, offline polish, validation"`

End of prompts for Daniel.
