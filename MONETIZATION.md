# Monetization System

## RevenueCat Integration
- SDK: `react-native-purchases`
- Store: `useSubscriptionStore` (Zustand)
- Tiers: `free`, `plus`, `pro`

## Deployment Checklist
- [ ] Configure Offerings and Packages in RevenueCat Dashboard.
- [ ] Set `EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_IOS` and `EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY_ANDROID` in environment.
- [ ] **Webhook Sync**: Deploy RevenueCat webhook to Supabase Edge Function to update `profiles.tier` on subscription events.
- [ ] Verify Sandbox testing handles `isPlus` and `isPro` toggling correctly in the UI.
