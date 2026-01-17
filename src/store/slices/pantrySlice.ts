import { StateCreator } from "zustand";

export interface PantrySlice {
  items: DB.PantryItem[];
  isLoading: boolean;
  setItems: (items: DB.PantryItem[]) => void;
  addItem: (item: DB.PantryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<DB.PantryItem>) => void;
  setLoading: (loading: boolean) => void;
  clearPantry: () => void;
}

export const createPantrySlice: StateCreator<
  PantrySlice,
  [],
  [],
  PantrySlice
> = (set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearPantry: () => set({ items: [] }),
});
