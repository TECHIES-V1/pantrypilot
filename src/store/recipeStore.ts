import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RawInput, RecipeState } from '../types/recipe';

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      rawInput: null,
      loading: false,
      error: null,
      draft: null,
      history: [],

      setRawInput: (input: RawInput) => set({ rawInput: input, error: null }),
      clearInput: () => set({ rawInput: null, error: null }),
      setDraft: (draft) => set({ draft }),
      addToHistory: (input) =>
        set((state) => {
          // Keep only last 3 unique items
          const newHistory = [input, ...state.history.filter((item) => item !== input)].slice(0, 3);
          return { history: newHistory };
        }),
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
