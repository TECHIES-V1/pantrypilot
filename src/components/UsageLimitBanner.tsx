import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { THEMES, SPACING, TYPOGRAPHY } from '../constants';
import { useAppStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';

interface UsageLimitBannerProps {
  onUpgradePress: () => void;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({ onUpgradePress }) => {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const theme = THEMES[currentTheme];
  const { profile } = useAuthStore();
  const { isPlus } = useSubscriptionStore();

  const count = profile?.monthly_recipe_count || 0;
  const limit = 5;

  if (isPlus || count < limit) {
    return null;
  }

  return (
    <MotiView
      from={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.accent }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Free Limit Reached ({count}/{limit})
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Upgrade for unlimited recipes and premium features.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={onUpgradePress}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>Upgrade Now</Text>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: 'bold',
  },
});
