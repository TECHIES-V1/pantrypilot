import { create } from 'zustand';

interface GroceryState {
  groceryItems: DB.GroceryItem[];
  groceryLoading: boolean;
  setGroceryItems: (items: DB.GroceryItem[]) => void;
  addGroceryItem: (item: DB.GroceryItem) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  updateGroceryItem: (id: string, updates: Partial<DB.GroceryItem>) => void;
  clearGroceryList: () => void;
  setGroceryLoading: (loading: boolean) => void;
}

export const useGroceryStore = create<GroceryState>()((set) => ({
  groceryItems: [],
  groceryLoading: false,
  setGroceryItems: (groceryItems) => set({ groceryItems }),
  addGroceryItem: (item) => set((state) => ({ groceryItems: [...state.groceryItems, item] })),
  toggleGroceryItem: (id) =>
    set((state) => ({
      groceryItems: state.groceryItems.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      ),
    })),
  removeGroceryItem: (id) =>
    set((state) => ({ groceryItems: state.groceryItems.filter((i) => i.id !== id) })),
  updateGroceryItem: (id, updates) =>
    set((state) => ({
      groceryItems: state.groceryItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  clearGroceryList: () => set({ groceryItems: [] }),
  setGroceryLoading: (groceryLoading) => set({ groceryLoading }),
}));

export default useGroceryStore;
