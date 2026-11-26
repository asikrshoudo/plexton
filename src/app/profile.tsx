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
import { MIN_TOUCH, radius, spacing, stroke } from '@/theme/tokens';
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
    setMessage(ok ? 'Name saved on this device.' : 'Could not save on this device. Try again.');
  };

  return (
    <Screen title="Profile" subtitle="Your progress, kept locally">
      <Card style={styles.hero} elevated>
        <View style={styles.heroTop}>
          <View style={[styles.avatar, { backgroundColor: palette.primarySoft, borderColor: palette.borderStrong }]}>
            <AppText variant="display" tone="primary">
              {profile.name.charAt(0).toUpperCase()}
            </AppText>
          </View>
          <View style={styles.heroCopy}>
            <AppText variant="caption" tone="subtle" style={styles.kicker}>
              PLAYER
            </AppText>
            <AppText variant="title">{profile.name}</AppText>
            <AppText variant="body" tone="muted">
              Level {info.level} with {profile.xp} total XP.
            </AppText>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressRow}>
            <AppText variant="label" tone="muted">
              Progress to level {info.level + 1}
            </AppText>
            <AppText variant="label">{Math.round(info.progress * 100)}%</AppText>
          </View>
          <ProgressBar progress={info.progress} />
          <AppText variant="caption" tone="muted">
            {info.xpIntoLevel} / {info.xpForNext} XP
          </AppText>
        </View>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Level" value={String(info.level)} />
        <StatTile label="Total XP" value={String(profile.xp)} />
      </View>

      <SectionLabel>Player name</SectionLabel>
      <Card style={styles.nameCard}>
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
          placeholderTextColor={palette.textSubtle}
          style={[styles.input, { backgroundColor: palette.surfaceAlt, borderColor: palette.border, color: palette.text }]}
        />
        <Button label="Save name" onPress={save} disabled={!canSave} />
        {message ? (
          <AppText variant="label" tone="muted" accessibilityLiveRegion="polite">
            {message}
          </AppText>
        ) : null}
      </Card>

      <Card muted style={styles.note}>
        <AppText variant="label">Stored on this device</AppText>
        <AppText variant="body" tone="muted">
          Your profile and progress stay local. No account, no sign-up.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    borderWidth: stroke.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, gap: 2 },
  kicker: { letterSpacing: 1.1 },
  progressBlock: { gap: spacing.sm },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.md },
  nameCard: { gap: spacing.md },
  input: {
    minHeight: MIN_TOUCH + 4,
    borderRadius: radius.md,
    borderWidth: stroke.hairline,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
  },
  note: { gap: spacing.xs },
});
