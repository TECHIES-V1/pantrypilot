import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useRecipeStore } from '../../store/recipeStore';
import { useAppStore } from '../../store';
import { THEMES, SPACING, TYPOGRAPHY } from '../../constants';
import type { RawInput } from '../../types/recipe';

export default function RecipeInputScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { setRawInput, clearInput, loading } = useRecipeStore();
  const currentTheme = useAppStore((state) => state.currentTheme);
  const theme = THEMES[currentTheme];

  const [textInput, setTextInput] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);
  const [detectedType, setDetectedType] = useState<'text' | 'url' | 'image' | null>(null);

  // Auth guard: Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to add recipes.');
      // navigation.navigate('Auth' as never);
    }
  }, [user, navigation]);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || libraryPermission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera and photo library access is needed to add recipe images.'
        );
      }
    })();
  }, []);

  // Update detected type based on input
  useEffect(() => {
    if (imageUri) {
      setDetectedType('image');
    } else if (textInput.trim()) {
      const trimmed = textInput.trim().toLowerCase();
      if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.includes('youtube.com') ||
        trimmed.includes('youtu.be') ||
        trimmed.includes('tiktok.com') ||
        trimmed.includes('instagram.com')
      ) {
        setDetectedType('url');
      } else {
        setDetectedType('text');
      }
    } else {
      setDetectedType(null);
    }
  }, [textInput, imageUri]);

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        setTextInput(clipboardContent);
        setImageUri(null);
        setImageMimeType(undefined);
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  // Handle camera capture
  const handleCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Check file size (10MB limit)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 10MB.');
          return;
        }
        setImageUri(asset.uri);
        setImageMimeType(asset.mimeType);
        setTextInput('');
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  // Handle image library pick
  const handleLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Check file size (10MB limit)
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 10MB.');
          return;
        }
        setImageUri(asset.uri);
        setImageMimeType(asset.mimeType);
        setTextInput('');
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  // Clear all input
  const handleClear = () => {
    setTextInput('');
    setImageUri(null);
    setImageMimeType(undefined);
    clearInput();
  };

  // Validate and submit input
  const handleSubmit = () => {
    let input: RawInput | null = null;

    if (imageUri) {
      input = { type: 'image', uri: imageUri, mimeType: imageMimeType };
    } else if (textInput.trim()) {
      const trimmed = textInput.trim();

      // Check if it's a URL
      if (
        trimmed.toLowerCase().startsWith('http://') ||
        trimmed.toLowerCase().startsWith('https://') ||
        trimmed.includes('youtube.com') ||
        trimmed.includes('youtu.be') ||
        trimmed.includes('tiktok.com') ||
        trimmed.includes('instagram.com')
      ) {
        // Validate URL format
        try {
          new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
          input = { type: 'url', content: trimmed };
        } catch {
          Alert.alert('Invalid URL', 'Please enter a valid URL.');
          return;
        }
      } else {
        // Text input - must be at least 20 characters
        if (trimmed.length < 20) {
          Alert.alert('Text Too Short', 'Please enter at least 20 characters for recipe text.');
          return;
        }
        input = { type: 'text', content: trimmed };
      }
    }

    if (!input) {
      Alert.alert('No Input', 'Please enter a URL, paste recipe text, or take a photo.');
      return;
    }

    setRawInput(input);
    // Navigate to processing screen (placeholder for now)
    navigation.navigate('Processing' as never);
  };

  const hasInput = Boolean(textInput.trim() || imageUri);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: SPACING.md,
    },
    header: {
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: TYPOGRAPHY.sizes.xl,
      fontWeight: TYPOGRAPHY.weights.bold,
      color: theme.textPrimary,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.sizes.sm,
      color: theme.textSecondary,
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    textInput: {
      backgroundColor: theme.surface,
      borderRadius: theme.radius.medium,
      padding: SPACING.md,
      color: theme.textPrimary,
      fontSize: TYPOGRAPHY.sizes.md,
      minHeight: 150,
      textAlignVertical: 'top',
      ...theme.shadow,
    },
    detectedLabel: {
      marginTop: SPACING.sm,
      fontSize: TYPOGRAPHY.sizes.sm,
      color: theme.accent,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.lg,
      gap: SPACING.sm,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: theme.radius.small,
      padding: SPACING.md,
      alignItems: 'center',
      ...theme.shadow,
    },
    actionButtonText: {
      color: theme.textSecondary,
      fontSize: TYPOGRAPHY.sizes.xs,
      marginTop: SPACING.xs,
      textAlign: 'center',
    },
    actionButtonIcon: {
      fontSize: 24,
    },
    previewContainer: {
      marginBottom: SPACING.lg,
    },
    previewLabel: {
      fontSize: TYPOGRAPHY.sizes.sm,
      color: theme.textSecondary,
      marginBottom: SPACING.sm,
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: theme.radius.medium,
      backgroundColor: theme.surface,
    },
    removeImageButton: {
      position: 'absolute',
      top: SPACING.sm,
      right: SPACING.sm,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeImageText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    clearButton: {
      alignSelf: 'flex-end',
      padding: SPACING.sm,
      marginBottom: SPACING.sm,
    },
    clearButtonText: {
      color: theme.textSecondary,
      fontSize: TYPOGRAPHY.sizes.sm,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.radius.medium,
      padding: SPACING.md,
      alignItems: 'center',
      opacity: hasInput ? 1 : 0.5,
      ...theme.shadow,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: theme.textPrimary,
      fontSize: TYPOGRAPHY.sizes.lg,
      fontWeight: TYPOGRAPHY.weights.semibold,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} accessible accessibilityRole="header">
            Add New Recipe
          </Text>
          <Text style={styles.subtitle}>Paste a recipe URL, enter text, or take a photo</Text>
        </View>

        {/* Clear Button */}
        {hasInput && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            accessible
            accessibilityLabel="Clear input"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>✕ Clear</Text>
          </TouchableOpacity>
        )}

        {/* Text Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Paste recipe text, URL, or use camera..."
            placeholderTextColor={theme.textSecondary}
            value={textInput}
            onChangeText={(text) => {
              setTextInput(text);
              if (text) setImageUri(null);
            }}
            multiline
            numberOfLines={6}
            accessible
            accessibilityLabel="Recipe input field"
            accessibilityHint="Enter recipe URL or text"
          />
          {detectedType && !imageUri && (
            <Text style={styles.detectedLabel}>Detected: {detectedType.toUpperCase()}</Text>
          )}
        </View>

        {/* Action Buttons Row */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePaste}
            accessible
            accessibilityLabel="Paste from clipboard"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonIcon}>📋</Text>
            <Text style={styles.actionButtonText}>Paste from{'\n'}Clipboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCamera}
            accessible
            accessibilityLabel="Open camera"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonIcon}>📷</Text>
            <Text style={styles.actionButtonText}>Open{'\n'}Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLibrary}
            accessible
            accessibilityLabel="Pick from photo library"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonIcon}>🖼️</Text>
            <Text style={styles.actionButtonText}>Pick from{'\n'}Library</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Image Preview:</Text>
            <View>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  setImageUri(null);
                  setImageMimeType(undefined);
                }}
                accessible
                accessibilityLabel="Remove image"
                accessibilityRole="button"
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detectedLabel}>Detected: IMAGE</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !hasInput && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!hasInput || loading}
          accessible
          accessibilityLabel="Process recipe"
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasInput || loading }}
        >
          {loading ? (
            <ActivityIndicator color={theme.textPrimary} />
          ) : (
            <Text style={styles.submitButtonText}>Process Recipe</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
