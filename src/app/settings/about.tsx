import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen title="About Plexton">
      <Card style={styles.card}>
        <AppText variant="display">Plexton</AppText>
        <AppText variant="heading" tone="primary">
          Play. Think. Ponder.
        </AppText>
        <AppText tone="muted">
          A collection of casual puzzle games that works fully offline. No account, no sign-up.
        </AppText>
      </Card>
      <Card style={styles.card}>
        <AppText variant="label" tone="muted">
          Version
        </AppText>
        <AppText variant="heading">{version}</AppText>
        <AppText variant="label" tone="muted">
          Publisher
        </AppText>
        <AppText variant="heading">TheKami</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
});
