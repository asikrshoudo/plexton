import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { getLevelInfo } from '@/features/profile/xp';
import { useProfile } from '@/features/profile/ProfileProvider';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { ProgressBar } from '../ui/ProgressBar';

export function PlayerCard() {
  const { palette } = useTheme();
  const { profile } = useProfile();
  const info = getLevelInfo(profile.xp);

  return (
    <PressableScale
      onPress={() => router.push('/profile')}
      accessibilityRole="button"
      accessibilityLabel={`Profile. ${profile.name}, level ${info.level}, ${info.xpIntoLevel} of ${info.xpForNext} XP`}
      style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={[styles.avatar, { backgroundColor: palette.primary }]}>
        <AppText variant="title" color={palette.onPrimary}>
          {profile.name.charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <AppText variant="heading" numberOfLines={1} style={styles.name}>
            {profile.name}
          </AppText>
          <AppText variant="label" tone="primary">
            Level {info.level}
          </AppText>
        </View>
        <ProgressBar progress={info.progress} />
        <AppText variant="caption" tone="muted">
          {info.xpIntoLevel} / {info.xpForNext} XP
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { flex: 1 },
});
