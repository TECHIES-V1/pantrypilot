import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createUserSlice,
  createRecipeSlice,
  createPantrySlice,
  createGrocerySlice,
  createPlanSlice,
  createThemeSlice,
  type UserSlice,
  type RecipeSlice,
  type PantrySlice,
  type GrocerySlice,
  type PlanSlice,
  type ThemeSlice,
} from "./slices";

export type AppStore = UserSlice &
  RecipeSlice &
  PantrySlice &
  GrocerySlice &
  PlanSlice &
  ThemeSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createUserSlice(...args),
      ...createRecipeSlice(...args),
      ...createPantrySlice(...args),
      ...createGrocerySlice(...args),
      ...createPlanSlice(...args),
      ...createThemeSlice(...args),
    }),
    {
      name: "pantrypilot-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persist only essential state
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentTheme: state.currentTheme,
        items: state.items, // pantry items
        recipes: state.recipes,
        plans: state.plans,
      }),
    },
  ),
);

// Selector hooks for performance optimization
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.currentTheme);
export const useRecipes = () => useAppStore((state) => state.recipes);
export const usePantryItems = () => useAppStore((state) => state.items);
export const useGroceryItems = () => useAppStore((state) => state.items);
export const usePlans = () => useAppStore((state) => state.plans);

export default useAppStore;
