import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { THEMES } from '../constants';

// Import real screens
import { AuthScreen } from '../screens/AuthScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Use Rainforest theme as default
const theme = THEMES.rainforest;

// Placeholder screens - to be replaced by other feature developers
const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Home Screen</Text>
    <Text style={styles.subtext}>Paste your first recipe to get started!</Text>
  </View>
);

const RecipeInputScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Recipe Input Screen</Text>
  </View>
);

const PantryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantry Screen</Text>
  </View>
);

const LibraryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Library Screen</Text>
  </View>
);

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RecipeInput: undefined;
  CookingMode: { recipeId: string };
  GroceryList: { recipeId?: string; planId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Pantry: undefined;
  Library: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: false, // Disable to fix Fabric compatibility
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.primary,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  // Use authStore for authentication state
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          freezeOnBlur: false, // Disable to fix Fabric compatibility
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="RecipeInput" component={RecipeInputScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  text: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  subtext: {
    color: theme.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});

export default AppNavigator;
