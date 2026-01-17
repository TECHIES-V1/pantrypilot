Role Summary

- RevenueCat monetization & paywall owner

What You Are Building

- Tier enforcement
- Paywall UI
- Usage limit tracking

Step-by-Step Tasks (Execution-Level)

- Create branch feature/monetization from main
- Install react-native-purchases
- In App.tsx: Purchases.configure({ apiKey: Platform.OS === 'ios' ? ... : ... })
- Create src/store/subscriptionStore.ts with entitlements
- Add paywall modal src/components/PaywallModal.tsx with tiers description
- In recipeStore parse action: if free && monthly_count >=5 → show paywall
- Create Supabase trigger or client-side increment on parse success
- Webhook: listen for RevenueCat events → update profiles.tier
- Commit & PR

Files & Directories You Own

- src/components/PaywallModal.tsx
- src/store/subscriptionStore.ts
- App.tsx (Purchases.configure)

Interfaces With Other Work

- Expects: auth user id from Daniel
- Provides: isPlus / isPro booleans to gate features

Validation Checklist

- Paywall shows after free limit
- Subscription succeeds in sandbox
- Tier updates in Supabase
- Gated buttons disabled for free users
