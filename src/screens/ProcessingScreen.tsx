import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipeStore } from '../store/recipeStore';
import { THEMES, SPACING, TYPOGRAPHY } from '../constants';
import { useAppStore } from '../store';

const PROCESSING_STEPS = [
    "Validating input...",
    "Sending to AI...",
    "Parsing recipe details...",
    "Finalizing..."
];

export default function ProcessingScreen() {
    const navigation = useNavigation();
    const { clearInput } = useRecipeStore();
    const currentTheme = useAppStore((state) => state.currentTheme);
    const theme = THEMES[currentTheme];

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Simulate progress steps
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < PROCESSING_STEPS.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 1000);

        // Simulate completion and navigation
        const timeout = setTimeout(() => {
            // Navigate to next screen (GroceryList or Review - placeholder)
            // For now, we'll just go back or to a placeholder, 
            // but prompt says "Mock navigation to next"
            // letting Moh hook real parse later.
            // We'll navigate back for now since we don't have GroceryListScreen yet.
            // actually Prompt says: "navigate to GroceryListScreen or ReviewScreen (placeholder)"
            // I'll just Alert and go back for now to keep it safe until those exist
            // Or better, just stay there with a "Done" message?
            // Prompt says: "After 3-5s auto-navigate to next"
            // I will navigate to "RecipeInput" again for now with a success parameter or just back.
            // But clearing input might be annoying if testing. 
            // Let's just log verification for now.
            console.log('Processing complete - would navigate to ReviewScreen');
            navigation.goBack();
        }, 4500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigation]);

    const handleRetry = () => {
        navigation.goBack();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: SPACING.xl,
        },
        content: {
            alignItems: 'center',
            width: '100%',
        },
        spinner: {
            transform: [{ scale: 1.5 }],
            marginBottom: SPACING.xl,
        },
        title: {
            color: theme.textPrimary,
            fontSize: TYPOGRAPHY.sizes.xl,
            fontWeight: TYPOGRAPHY.weights.bold,
            marginBottom: SPACING.lg,
            textAlign: 'center',
        },
        stepContainer: {
            marginTop: SPACING.lg,
            alignItems: 'center',
            width: '100%',
        },
        stepText: {
            fontSize: TYPOGRAPHY.sizes.md,
            marginBottom: SPACING.sm,
            fontWeight: TYPOGRAPHY.weights.medium,
        },
        activeStep: {
            color: theme.accent,
        },
        inactiveStep: {
            color: theme.textSecondary,
            opacity: 0.5,
        },
        retryButton: {
            marginTop: SPACING.xxl,
            padding: SPACING.md,
        },
        retryText: {
            color: theme.textSecondary,
            fontSize: TYPOGRAPHY.sizes.sm,
            textDecorationLine: 'underline',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator
                    size="large"
                    color={theme.accent}
                    style={styles.spinner}
                />

                <Text style={styles.title}>Extracting your recipe...</Text>

                <View style={styles.stepContainer}>
                    {PROCESSING_STEPS.map((step, index) => (
                        <Text
                            key={step}
                            style={[
                                styles.stepText,
                                index === currentStep ? styles.activeStep : styles.inactiveStep
                            ]}
                        >
                            {step}
                        </Text>
                    ))}
                </View>

                {/* Error/Retry Placeholder (hidden for happy path) */}
                {/* <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Cancel & Try Again</Text>
        </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}
