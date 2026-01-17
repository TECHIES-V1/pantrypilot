/prompts/Joanna.md

Prompt 0  
You are a senior React Native + monetization engineer building the PantryPilot app.  
Your sole ownership is the RevenueCat integration, tier enforcement, paywalls, and usage limit tracking.  
You must not touch authentication flows (except reading user id), recipe input, AI/Groq parsing, pantry management, grocery list generation, multi-recipe merging, cooking mode, recipe library, or any core feature logic.  
You start today (Day 2). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth (useAuthStore with user.id), and basic Zustand + Supabase client already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/monetization`
- Install RevenueCat: `npm install react-native-purchases`
- Create `src/services/revenuecat.ts`:

  ```ts
  import Purchases from "react-native-purchases";
  import { Platform } from "react-native";

  export const configureRevenueCat = () => {
    const apiKey =
      Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_IOS
        : process.env.EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_ANDROID;
    if (!apiKey) throw new Error("Missing RevenueCat public key");
    Purchases.configure({ apiKey });
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG); // for dev
  };

  export const getEntitlements = async () => {
    const purchaserInfo = await Purchases.getCustomerInfo();
    return purchaserInfo.entitlements.active;
  };

  export const purchasePlus = async () => {
    const offerings = await Purchases.getOfferings();
    const packageToPurchase = offerings.current?.availablePackages.find((p) =>
      p.identifier.includes("plus"),
    );
    if (!packageToPurchase) throw new Error("No Plus package found");
    return Purchases.purchasePackage(packageToPurchase);
  };

  // similar for Pro if needed
  ```

- In `App.tsx` (minimal change):
  - Import configureRevenueCat from revenuecat.ts
  - Call configureRevenueCat() inside useEffect on mount
- Create `src/store/subscriptionStore.ts`:

  ```ts
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
  ```

- In App.tsx or root component: call subscriptionStore.getState().fetchEntitlements() after auth is ready
- Commit: `git commit -m "Install RevenueCat, configure SDK, create subscription store with entitlement fetch"`
- Push and create PR: `gh pr create --base main --title "Feature/monetization core setup" --body "RevenueCat SDK init, store, basic fetch"`

Prompt 1  
You are continuing work on the monetization feature in branch feature/monetization.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth (except reading user), recipe input, AI parsing, pantry, grocery, multi-recipe, cooking, library, or core UI logic.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/monetization
- Create `src/components/PaywallModal.tsx`:
  - Modal component with:
    - Title: "Unlock Premium Features"
    - Description list:
      - Free: 5 recipes/month
      - Plus: Unlimited recipes, substitutions, merging
      - Pro: All Plus + nutrition, priority AI, exports
    - Pricing: Plus $4.99/mo, Pro $9.99/mo
    - Buttons: "Subscribe to Plus", "Subscribe to Pro", "Restore Purchases", "Close"
    - On subscribe: call purchasePlus() or purchasePro(), then refetch entitlements
- Create `src/components/UsageLimitBanner.tsx`:
  - If !isPlus && monthly_recipe_count >= 5: show banner "You've reached your free limit (5 recipes this month). Upgrade for unlimited."
  - Show current count / 5
  - Button "Upgrade Now" → open PaywallModal
- In `src/store/recipeStore.ts` (minimal gate addition):
  - In parseCurrentInput action: before calling Groq
    - Get from subscriptionStore: isPlus, monthly_recipe_count (fetch from Supabase if not in store)
    - If !isPlus && count >=5: throw new Error('LIMIT_REACHED') or set needsUpgrade: true
- Create Supabase table update logic:
  - After successful parse (in recipeStore success callback):
    - supabase.from('profiles').update({ monthly_recipe_count: count + 1 }).eq('id', user.id)
- Commit: `git commit -m "Add PaywallModal, UsageLimitBanner, basic limit gating in recipe parse, profile count increment"`
- Push and update existing PR

Prompt 2  
You are finalizing the monetization feature in branch feature/monetization.  
Focus on tier enforcement, paywall triggers, webhook sync, and polish.  
Do NOT touch any other feature areas.

Execute these steps:

- In subscriptionStore:
  - Add action restorePurchases: Purchases.restorePurchases() then fetchEntitlements
  - Add listener: Purchases.addCustomerInfoUpdateListener((info) => { set entitlements from info })
- In PaywallModal:
  - Implement Restore button: call restorePurchases
  - Implement subscribe buttons: call purchasePlus / purchasePro → on success close modal, refetch
  - Add loading state during purchase
  - Handle errors: show toast "Purchase failed" on error
- Add gates in UI:
  - In RecipeInputScreen: if !isPlus && count >=5: disable submit or show banner
  - In PlanningScreen: if !isPlus: disable "Generate Merged" or show upgrade prompt
  - In other premium spots (substitutions, nutrition): gate with PaywallModal on tap
- Implement webhook stub (future):
  - Note in README: "Deploy RevenueCat webhook to Supabase Edge Function to update profiles.tier on subscription events"
  - For now: rely on client-side fetchEntitlements on app focus
- Test flow locally (sandbox):
  - Set free tier → parse 5 recipes → on 6th: banner appears
  - Open paywall → simulate purchase (sandbox)
  - After purchase: isPlus true, limits removed
  - Restore purchases works
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Complete paywall UI, purchase/restore flow, tier gates in key flows, sandbox test"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/monetization should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in monetization-related files
- Test end-to-end in local app:
  - Free user: hit 5-recipe limit → banner + paywall on next attempt
  - Upgrade (sandbox): features unlock, count no longer blocks
  - Restore purchases: simulates upgrade
  - Profile count increments in Supabase after parse
  - Gates appear correctly in input, planning, etc.
- If any bug found in gating, purchase flow, entitlement sync, or banner display, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for monetization-related adjustments during final smoke test (e.g. limit enforcement, paywall triggers)
- Final commit if needed: `git commit -m "Final monetization integration fixes, sandbox validation, gate polish"`

End of prompts for Joanna.
