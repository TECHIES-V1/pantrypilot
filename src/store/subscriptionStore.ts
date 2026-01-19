import { create } from "zustand";
import { persist } from "zustand/middleware";
import Purchases from "react-native-purchases";
import { getEntitlements } from "../services/revenuecat";

interface SubscriptionState {
  entitlements: any;
  isPlus: boolean;
  isPro: boolean;
  loading: boolean;
  fetchEntitlements: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  initializeListener: () => () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
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
      restorePurchases: async () => {
        set({ loading: true });
        try {
          await Purchases.restorePurchases();
          await get().fetchEntitlements();
        } catch (e) {
          set({ loading: false });
        }
      },
      initializeListener: () => {
        const listener = (customerInfo: any) => {
          const ents = customerInfo.entitlements.active;
          set({
            entitlements: ents,
            isPlus: !!ents["plus"],
            isPro: !!ents["pro"],
          });
        };
        const cleanup = Purchases.addCustomerInfoUpdateListener(listener);
        return () => cleanup;
      },
    }),
    { name: "subscription-storage" },
  ),
);
