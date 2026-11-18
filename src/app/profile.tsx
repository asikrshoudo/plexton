import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatTile } from '@/components/ui/StatTile';
import { MAX_NAME_LENGTH, useProfile } from '@/features/profile/ProfileProvider';
import { getLevelInfo } from '@/features/profile/xp';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function ProfileScreen() {
  const { palette } = useTheme();
  const { profile, rename } = useProfile();
  const [draft, setDraft] = useState(profile.name);
  const [message, setMessage] = useState<string | null>(null);
  const info = getLevelInfo(profile.xp);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== profile.name;

  const save = () => {
    const ok = rename(draft);
    setMessage(ok ? 'Name saved.' : 'Could not save on this device. Try again.');
  };

  return (
    <Screen title="Profile">
      <View style={styles.stats}>
        <StatTile label="Level" value={String(info.level)} />
        <StatTile label="Total XP" value={String(profile.xp)} />
      </View>

      <Card style={styles.card}>
        <AppText variant="label" tone="muted">
          Progress to level {info.level + 1}
        </AppText>
        <ProgressBar progress={info.progress} />
        <AppText variant="caption" tone="muted">
          {info.xpIntoLevel} / {info.xpForNext} XP
        </AppText>
      </Card>

      <SectionLabel>Player name</SectionLabel>
      <TextInput
        value={draft}
        onChangeText={(t) => {
          setDraft(t);
          setMessage(null);
        }}
        maxLength={MAX_NAME_LENGTH}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        accessibilityLabel="Player name"
        placeholder="Your name"
        placeholderTextColor={palette.textMuted}
        style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
      />
      <Button label="Save name" onPress={save} disabled={!canSave} />
      {message ? (
        <AppText variant="label" tone="muted" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}
      <AppText variant="caption" tone="muted">
        Your profile is stored only on this device. No account needed.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.md },
  card: { gap: spacing.sm },
  input: {
    minHeight: MIN_TOUCH + 4,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
  },
});
