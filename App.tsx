import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { supabase } from './src/services/supabase';
import { THEMES } from './src/constants';
import { configureRevenueCat } from './src/services/revenuecat';
import { useSubscriptionStore } from './src/store/subscriptionStore';

// Use Rainforest theme as default
const theme = THEMES.rainforest;

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.accent} />
  </View>
);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = async () => {
      await initialize();
      useSubscriptionStore.getState().fetchEntitlements();
      setIsReady(true);
    };

    initAuth();
    configureRevenueCat();

    // Set up auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Update auth store when auth state changes
      if (session?.user) {
        useAuthStore.setState({
          session,
          user: session.user,
          loading: false,
        });

        // Upsert profile for OAuth sign-ins
        if (event === 'SIGNED_IN') {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (!existingProfile) {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              email: session.user.email || '',
              tier: 'free',
              monthly_recipe_count: 0,
            });
          }

          // Fetch full profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            useAuthStore.setState({ profile: profile as DB.Profile });
          }
        }
      } else {
        useAuthStore.setState({
          session: null,
          user: null,
          profile: null,
          loading: false,
        });
      }
    });

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [initialize]);

  // Show loading screen while initializing
  if (!isReady || loading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <LoadingScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});
