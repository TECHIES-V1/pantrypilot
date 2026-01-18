import { create } from 'zustand';
import type { RawInput, RecipeState } from '../types/recipe';

export const useRecipeStore = create<RecipeState>((set) => ({
  rawInput: null,
  loading: false,
  error: null,
  setRawInput: (input: RawInput) => set({ rawInput: input, error: null }),
  clearInput: () => set({ rawInput: null, error: null }),
}));

export default useRecipeStore;
