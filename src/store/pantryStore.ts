import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PantryState {
  pantryItems: DB.PantryItem[];
  pantryLoading: boolean;
  setPantryItems: (items: DB.PantryItem[]) => void;
  addPantryItem: (item: DB.PantryItem) => void;
  removePantryItem: (id: string) => void;
  updatePantryItem: (id: string, updates: Partial<DB.PantryItem>) => void;
  setPantryLoading: (loading: boolean) => void;
  clearPantry: () => void;
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      pantryItems: [],
      pantryLoading: false,
      setPantryItems: (pantryItems) => set({ pantryItems }),
      addPantryItem: (item) => set((state) => ({ pantryItems: [...state.pantryItems, item] })),
      removePantryItem: (id) =>
        set((state) => ({ pantryItems: state.pantryItems.filter((i) => i.id !== id) })),
      updatePantryItem: (id, updates) =>
        set((state) => ({
          pantryItems: state.pantryItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      setPantryLoading: (pantryLoading) => set({ pantryLoading }),
      clearPantry: () => set({ pantryItems: [] }),
    }),
    {
      name: 'pantry-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePantryStore;
