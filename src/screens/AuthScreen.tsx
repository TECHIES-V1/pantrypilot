import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { THEMES, SPACING, TYPOGRAPHY } from '../constants';
import { validateEmail } from '../utils/authUtils';

// Use Rainforest theme as default (dark mode only per design.md)
const theme = THEMES.rainforest;

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

export const AuthScreen: React.FC = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Loading states per button
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Success messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auth store
  const { signIn, signUp, signInWithGoogle, resetPassword, error, setError } = useAuthStore();

  // Get user type for email confirmation check
  type UserType = ReturnType<typeof useAuthStore.getState>['user'];

  // Clear error when switching modes
  useEffect(() => {
    setError(null);
    setEmailError(null);
    setSuccessMessage(null);
  }, [mode, setError]);

  // Email validation on blur
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  // Check if user needs email confirmation
  const checkEmailConfirmation = (authUser: UserType) => {
    if (authUser && !authUser.email_confirmed_at) {
      setSuccessMessage('Account created! Check your email to confirm.');
    }
  };

  // Sign In handler
  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setSignInLoading(true);
    await signIn(email, password);
    setSignInLoading(false);
  };

  // Sign Up handler
  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setSignUpLoading(true);
    await signUp(email, password);
    setSignUpLoading(false);

    // Check if email confirmation needed
    const currentUser = useAuthStore.getState().user;
    checkEmailConfirmation(currentUser);
  };

  // Google OAuth handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    setGoogleLoading(false);
  };

  // Password reset handler
  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setResetLoading(true);
    await resetPassword(email);
    setResetLoading(false);
    setSuccessMessage('Password reset email sent! Check your inbox.');
    setMode('signIn');
  };

  const isAnyLoading = signInLoading || signUpLoading || googleLoading || resetLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>PantryPilot</Text>
              <Text style={styles.subtitle}>
                {mode === 'signIn'
                  ? 'Welcome back!'
                  : mode === 'signUp'
                    ? 'Create your account'
                    : 'Reset your password'}
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Success Message */}
            {successMessage && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isAnyLoading}
              />
              {emailError && <Text style={styles.fieldError}>{emailError}</Text>}
            </View>

            {/* Password Input (hidden in forgot password mode) */}
            {mode !== 'forgotPassword' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    editable={!isAnyLoading}
                  />
                  <TouchableOpacity
                    style={styles.togglePassword}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isAnyLoading}
                  >
                    <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Forgot Password Link */}
            {mode === 'signIn' && (
              <TouchableOpacity
                onPress={() => setMode('forgotPassword')}
                disabled={isAnyLoading}
                style={styles.forgotPassword}
              >
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {mode === 'signIn' && (
                <>
                  <TouchableOpacity
                    style={[styles.primaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={handleSignIn}
                    disabled={isAnyLoading}
                  >
                    {signInLoading ? (
                      <ActivityIndicator color={theme.textPrimary} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.secondaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={() => setMode('signUp')}
                    disabled={isAnyLoading}
                  >
                    <Text style={styles.secondaryButtonText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              )}

              {mode === 'signUp' && (
                <>
                  <TouchableOpacity
                    style={[styles.primaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={handleSignUp}
                    disabled={isAnyLoading}
                  >
                    {signUpLoading ? (
                      <ActivityIndicator color={theme.textPrimary} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.secondaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={() => setMode('signIn')}
                    disabled={isAnyLoading}
                  >
                    <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
                  </TouchableOpacity>
                </>
              )}

              {mode === 'forgotPassword' && (
                <>
                  <TouchableOpacity
                    style={[styles.primaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={isAnyLoading}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color={theme.textPrimary} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Reset Password</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.secondaryButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={() => setMode('signIn')}
                    disabled={isAnyLoading}
                  >
                    <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* OAuth Divider */}
            {mode !== 'forgotPassword' && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* OAuth Buttons */}
                <View style={styles.oauthContainer}>
                  <TouchableOpacity
                    style={[styles.oauthButton, isAnyLoading && styles.buttonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={isAnyLoading}
                  >
                    {googleLoading ? (
                      <ActivityIndicator color={theme.textPrimary} />
                    ) : (
                      <Text style={styles.oauthButtonText}>Continue with Google</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: '700',
    color: theme.accent,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderRadius: theme.radius.small,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: '#F44336',
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: theme.radius.small,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  successText: {
    color: theme.accent,
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.medium,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#F44336',
  },
  fieldError: {
    color: '#F44336',
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: SPACING.xs,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 60,
  },
  togglePassword: {
    position: 'absolute',
    right: SPACING.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  togglePasswordText: {
    color: theme.accent,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  linkText: {
    color: theme.accent,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: theme.radius.medium,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  primaryButtonText: {
    color: theme.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.medium,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.accent,
    minHeight: 50,
  },
  secondaryButtonText: {
    color: theme.accent,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.surface,
  },
  dividerText: {
    color: theme.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    marginHorizontal: SPACING.md,
  },
  oauthContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  oauthButton: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.medium,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  oauthButtonText: {
    color: theme.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
  },
});

export default AuthScreen;
