import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { elevation, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { Button } from './Button';

type Action = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  actions?: Action[];
  children?: ReactNode;
};

export function AppDialog({ visible, title, message, onClose, actions = [], children }: Props) {
  const { palette } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: palette.overlay }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.panel,
            elevation.raised,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.ink,
            },
          ]}>
          <View style={styles.text}>
            <AppText variant="heading" accessibilityRole="header">
              {title}
            </AppText>
            {message ? (
              <AppText variant="body" tone="muted">
                {message}
              </AppText>
            ) : null}
          </View>
          {children}
          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action) => (
                <View key={action.label} style={styles.action}>
                  <Button
                    label={action.label}
                    onPress={action.onPress}
                    variant={action.variant}
                    disabled={action.disabled}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  panel: {
    borderRadius: radius.xl,
    borderWidth: stroke.hairline,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  text: { gap: spacing.sm },
  actions: { gap: spacing.sm },
  action: { minWidth: 0 },
});
