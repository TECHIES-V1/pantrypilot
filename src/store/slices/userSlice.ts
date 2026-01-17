import { StateCreator } from "zustand";

export interface UserSlice {
  user: DB.Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: DB.Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
});
