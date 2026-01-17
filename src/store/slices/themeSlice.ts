import { StateCreator } from "zustand";

export interface ThemeSlice {
  currentTheme: App.ThemeName;
  setTheme: (theme: App.ThemeName) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (
  set,
) => ({
  currentTheme: "rainforest",
  setTheme: (currentTheme) => set({ currentTheme }),
});
