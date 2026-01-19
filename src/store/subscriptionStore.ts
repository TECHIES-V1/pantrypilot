import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getEntitlements } from "../services/revenuecat";

interface SubscriptionState {
  entitlements: any;
  isPlus: boolean;
  isPro: boolean;
  loading: boolean;
  fetchEntitlements: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      entitlements: null,
      isPlus: false,
      isPro: false,
      loading: true,
      fetchEntitlements: async () => {
        set({ loading: true });
        try {
          const ents = await getEntitlements();
          set({
            entitlements: ents,
            isPlus: !!ents["plus"],
            isPro: !!ents["pro"],
            loading: false,
          });
        } catch (e) {
          set({ loading: false });
        }
      },
    }),
    { name: "subscription-storage" },
  ),
);
