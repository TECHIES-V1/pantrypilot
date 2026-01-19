import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { THEMES, SPACING, TYPOGRAPHY } from '../constants';
import { PaywallModal } from '../components/PaywallModal';
import { useSubscriptionStore } from '../store/subscriptionStore';

// Use Rainforest theme as default
const theme = THEMES.rainforest;

export const ProfileScreen: React.FC = () => {
  const { profile, user, signOut, loading } = useAuthStore();
  const { isPlus, isPro } = useSubscriptionStore();
  const [showPaywall, setShowPaywall] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || 'Not available'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tier</Text>
            <View style={styles.tierContainer}>
              <View style={[styles.tierBadge, { backgroundColor: (isPlus || isPro) ? theme.accent : theme.primary }]}>
                <Text style={styles.tierText}>{profile?.tier?.toUpperCase() || 'FREE'}</Text>
              </View>
              {(!isPlus && !isPro) && (
                <TouchableOpacity onPress={() => setShowPaywall(true)} style={styles.upgradeBtn}>
                  <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Recipes This Month</Text>
            <Text style={styles.value}>{profile?.monthly_recipe_count || 0}</Text>
          </View>
        </View>

        {/* Settings Placeholder */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingRow} disabled>
            <Text style={styles.settingText}>Dietary Preferences</Text>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} disabled>
            <Text style={styles.settingText}>Unit Preferences</Text>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} disabled>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, loading && styles.buttonDisabled]}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#F44336" />
          ) : (
            <Text style={styles.signOutText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
      <PaywallModal isVisible={showPaywall} onClose={() => setShowPaywall(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.large,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: theme.shadow.shadowColor,
    shadowOffset: theme.shadow.shadowOffset,
    shadowOpacity: theme.shadow.shadowOpacity,
    shadowRadius: theme.shadow.shadowRadius,
    elevation: theme.shadow.elevation,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  value: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.background,
    marginVertical: SPACING.sm,
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierBadge: {
    backgroundColor: theme.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: theme.radius.small,
  },
  tierText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    color: theme.background,
  },
  upgradeBtn: {
    marginLeft: SPACING.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  upgradeBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.accent,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    opacity: 0.5, // Disabled state for placeholder
  },
  settingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: theme.textPrimary,
  },
  arrowText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: theme.textSecondary,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.medium,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
    marginTop: 'auto',
    minHeight: 50,
  },
  signOutText: {
    color: '#F44336',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ProfileScreen;
