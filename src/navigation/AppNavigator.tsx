import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { useAppStore } from "../store";

// Placeholder screens - to be replaced by feature developers
const AuthScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Auth Screen</Text>
  </View>
);

const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Home Screen</Text>
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

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
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
        tabBarStyle: {
          backgroundColor: "#1B5E20",
          borderTopColor: "#2E7D32",
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#A5D6A7",
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
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1B5E20" },
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B5E20",
  },
  text: {
    color: "#E8F5E9",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AppNavigator;
