import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { useAuthStore } from './authStore';
import { useSubscriptionStore } from './subscriptionStore';
import type { RawInput, RecipeState } from '../types/recipe';

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      rawInput: null,
      loading: false,
      error: null,
      draft: null,
      history: [],
      needsUpgrade: false,

      setRawInput: (input: RawInput) => set({ rawInput: input, error: null, needsUpgrade: false }),
      clearInput: () => set({ rawInput: null, error: null, needsUpgrade: false }),
      setDraft: (draft) => set({ draft }),
      addToHistory: (input) =>
        set((state) => {
          const newHistory = [input, ...state.history.filter((item) => item !== input)].slice(0, 3);
          return { history: newHistory };
        }),
      parseCurrentInput: async () => {
        const { isPlus } = useSubscriptionStore.getState();
        const { profile, user } = useAuthStore.getState();
        const count = profile?.monthly_recipe_count || 0;

        if (!isPlus && count >= 5) {
          set({ needsUpgrade: true });
          throw new Error('LIMIT_REACHED');
        }

        set({ loading: true, error: null, needsUpgrade: false });
        try {
          // AI Extraction logic will be triggered here (handled by Moh)
          // For now, we simulate success and increment count
          
          if (user) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ monthly_recipe_count: count + 1 })
              .eq('id', user.id);
            
            if (updateError) {
              console.error("Failed to update recipe count:", updateError);
            } else {
              await useAuthStore.getState().refreshProfile();
            }
          }
          set({ loading: false });
        } catch (e) {
          set({ loading: false, error: (e as Error).message });
          throw e;
        }
      },
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        draft: state.draft,
        history: state.history,
      }),
    }
  )
);

export default useRecipeStore;
