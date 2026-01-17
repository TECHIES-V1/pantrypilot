import { StateCreator } from "zustand";

export interface RecipeSlice {
  recipes: DB.Recipe[];
  currentRecipe: DB.Recipe | null;
  rawInput: string | null;
  isProcessing: boolean;
  setRecipes: (recipes: DB.Recipe[]) => void;
  addRecipe: (recipe: DB.Recipe) => void;
  updateRecipe: (id: string, updates: Partial<DB.Recipe>) => void;
  removeRecipe: (id: string) => void;
  setCurrentRecipe: (recipe: DB.Recipe | null) => void;
  setRawInput: (input: string | null) => void;
  setProcessing: (processing: boolean) => void;
}

export const createRecipeSlice: StateCreator<
  RecipeSlice,
  [],
  [],
  RecipeSlice
> = (set) => ({
  recipes: [],
  currentRecipe: null,
  rawInput: null,
  isProcessing: false,
  setRecipes: (recipes) => set({ recipes }),
  addRecipe: (recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),
  updateRecipe: (id, updates) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    })),
  removeRecipe: (id) =>
    set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),
  setCurrentRecipe: (currentRecipe) => set({ currentRecipe }),
  setRawInput: (rawInput) => set({ rawInput }),
  setProcessing: (isProcessing) => set({ isProcessing }),
});
