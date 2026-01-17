import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: DB.Profile | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setError: (error: string | null) => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// Helper to upsert profile after auth
const upsertProfile = async (user: User): Promise<DB.Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email || '',
        tier: 'free',
        monthly_recipe_count: 0,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Profile upsert error:', error);
    return null;
  }
  return data as DB.Profile;
};

// Fetch existing profile
const fetchProfile = async (userId: string): Promise<DB.Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
  return data as DB.Profile;
};

// Handle auth errors consistently
const handleAuthError = (error: AuthError | null): string | null => {
  if (!error) return null;
  return error.message;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,
  isOnline: true,

  // Initialize auth state from stored session
  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        set({ error: handleAuthError(error), loading: false });
        return;
      }

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({
          session,
          user: session.user,
          profile,
          loading: false,
        });
      } else {
        set({ session: null, user: null, profile: null, loading: false });
      }
    } catch (_err) {
      // Offline fallback - use cached session if available
      const isOnline = get().isOnline;
      if (!isOnline) {
        set({ error: 'No internet – using cached session', loading: false });
      } else {
        set({ error: 'Failed to initialize auth', loading: false });
      }
    }
  },

  // Email/password sign in
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: handleAuthError(error), loading: false });
        return;
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        set({
          session: data.session,
          user: data.user,
          profile,
          loading: false,
        });
      }
    } catch (_err) {
      set({ error: 'Sign in failed', loading: false });
    }
  },

  // Email/password sign up
  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ error: handleAuthError(error), loading: false });
        return;
      }

      if (data.user) {
        // Upsert profile for new user
        const profile = await upsertProfile(data.user);
        set({
          session: data.session,
          user: data.user,
          profile,
          loading: false,
        });
      }
    } catch (_err) {
      set({ error: 'Sign up failed', loading: false });
    }
  },

  // Google OAuth
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      // Import required modules
      const WebBrowser = await import('expo-web-browser');
      const { makeRedirectUri } = await import('expo-auth-session');

      // Complete any pending auth sessions
      WebBrowser.maybeCompleteAuthSession();

      // Create redirect URL using makeRedirectUri (correct for OAuth)
      const redirectUrl = makeRedirectUri({
        scheme: 'pantrypilot',
        path: 'auth/callback',
      });

      console.log('OAuth redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error('No OAuth URL returned');
      }

      // Open auth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success') {
        // Supabase handles PKCE flow - just get the session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (sessionData.session) {
          // Fetch profile for the user
          const profile = await fetchProfile(sessionData.session.user.id);

          set({
            session: sessionData.session,
            user: sessionData.session.user,
            profile,
            loading: false,
          });
        } else {
          throw new Error('Session not created after OAuth');
        }
      } else {
        // User cancelled or dismissed
        set({ loading: false });
      }
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      set({ error: message, loading: false });
    }
  },

  // Sign out
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        set({ error: handleAuthError(error), loading: false });
        return;
      }

      set({
        user: null,
        session: null,
        profile: null,
        loading: false,
      });
    } catch (_err) {
      set({ error: 'Sign out failed', loading: false });
    }
  },

  // Refresh profile from database
  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;

    const profile = await fetchProfile(user.id);
    set({ profile });
  },

  // Refresh session token
  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        set({ error: handleAuthError(error) });
        return;
      }

      if (data.session) {
        set({ session: data.session, user: data.user });
      }
    } catch (_err) {
      set({ error: 'Failed to refresh session' });
    }
  },

  // Password reset
  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        set({ error: handleAuthError(error), loading: false });
        return;
      }

      set({ loading: false });
    } catch (_err) {
      set({ error: 'Password reset failed', loading: false });
    }
  },

  // Utility setters
  setError: (error: string | null) => set({ error }),
  setOnlineStatus: (isOnline: boolean) => set({ isOnline }),
}));

export default useAuthStore;
