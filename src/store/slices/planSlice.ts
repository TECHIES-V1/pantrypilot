import { StateCreator } from "zustand";

export interface PlanSlice {
  plans: DB.Plan[];
  currentPlan: DB.Plan | null;
  isLoading: boolean;
  setPlans: (plans: DB.Plan[]) => void;
  addPlan: (plan: DB.Plan) => void;
  updatePlan: (id: string, updates: Partial<DB.Plan>) => void;
  removePlan: (id: string) => void;
  setCurrentPlan: (plan: DB.Plan | null) => void;
  setLoading: (loading: boolean) => void;
}

export const createPlanSlice: StateCreator<PlanSlice, [], [], PlanSlice> = (
  set,
) => ({
  plans: [],
  currentPlan: null,
  isLoading: false,
  setPlans: (plans) => set({ plans }),
  addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
  updatePlan: (id, updates) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePlan: (id) =>
    set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),
  setCurrentPlan: (currentPlan) => set({ currentPlan }),
  setLoading: (isLoading) => set({ isLoading }),
});
