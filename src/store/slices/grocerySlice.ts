import { StateCreator } from "zustand";

export interface GrocerySlice {
  items: DB.GroceryItem[];
  isLoading: boolean;
  setItems: (items: DB.GroceryItem[]) => void;
  addItem: (item: DB.GroceryItem) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<DB.GroceryItem>) => void;
  clearList: () => void;
  setLoading: (loading: boolean) => void;
}

export const createGrocerySlice: StateCreator<
  GrocerySlice,
  [],
  [],
  GrocerySlice
> = (set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  toggleItem: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i,
      ),
    })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  clearList: () => set({ items: [] }),
  setLoading: (isLoading) => set({ isLoading }),
});
