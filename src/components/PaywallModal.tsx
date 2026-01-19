import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { THEMES, SPACING, TYPOGRAPHY } from '../constants';
import { useAppStore } from '../store';
import { purchasePlus, purchasePro } from '../services/revenuecat';
import { useSubscriptionStore } from '../store/subscriptionStore';

interface PaywallModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isVisible, onClose }) => {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const theme = THEMES[currentTheme];
  const { fetchEntitlements, restorePurchases, loading: subLoading } = useSubscriptionStore();
  const [localLoading, setLocalLoading] = React.useState(false);

  const loading = subLoading || localLoading;

  const handleSubscribePlus = async () => {
    setLocalLoading(true);
    try {
      await purchasePlus();
      await fetchEntitlements();
      onClose();
    } catch (e) {
      console.error("Purchase Plus failed:", e);
      // In a real app, use a Toast here
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSubscribePro = async () => {
    setLocalLoading(true);
    try {
      await purchasePro();
      await fetchEntitlements();
      onClose();
    } catch (e) {
      console.error("Purchase Pro failed:", e);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRestore = async () => {
    setLocalLoading(true);
    try {
      await restorePurchases();
      onClose();
    } catch (e) {
      console.error("Restore failed:", e);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={[styles.modalContent, { backgroundColor: theme.surface, borderRadius: theme.radius.large }]}
        >
          <Text style={[styles.title, { color: theme.textPrimary }]}>Unlock Premium Features</Text>
          
          <ScrollView style={styles.benefitScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.benefit}>
              <Text style={[styles.benefitTitle, { color: theme.accent }]}>Free Plan</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• 5 recipes/month</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Basic extraction</Text>
            </View>
            
            <View style={styles.benefit}>
              <Text style={[styles.benefitTitle, { color: theme.accent }]}>Plus Plan ($4.99/mo)</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Unlimited recipes</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Ingredient substitutions</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Multi-recipe merging</Text>
            </View>

            <View style={styles.benefit}>
              <Text style={[styles.benefitTitle, { color: theme.accent }]}>Pro Plan ($9.99/mo)</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• All Plus features</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Nutritional analysis</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Priority AI & Weekly plans</Text>
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>• Advanced exports</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}
              onPress={handleSubscribePlus}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Subscribe to Plus</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.accent, marginTop: SPACING.sm }, loading && styles.buttonDisabled]}
              onPress={handleSubscribePro}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Subscribe to Pro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.restoreButton} 
              onPress={handleRestore}
              disabled={loading}
            >
              <Text style={[styles.restoreButtonText, { color: theme.textSecondary }]}>Restore Purchases</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={loading}>
              <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  benefitScroll: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  benefit: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  benefitTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  benefitText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: TYPOGRAPHY.sizes.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  restoreButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    textDecorationLine: 'underline',
  },
  closeButton: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
  }
});
