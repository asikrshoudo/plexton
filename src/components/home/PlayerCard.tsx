import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { getLevelInfo } from '@/features/profile/xp';
import { useProfile } from '@/features/profile/ProfileProvider';
import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
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
      style={[styles.card, elevation.card, { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.edge }]}>
      <View style={[styles.avatar, { backgroundColor: palette.primarySoft, borderColor: palette.borderStrong }]}>
        <AppText variant="title" tone="primary">
          {profile.name.charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.nameWrap}>
            <AppText variant="caption" tone="subtle" style={styles.kicker}>PLAYER</AppText>
            <AppText variant="heading" numberOfLines={1}>
              {profile.name}
            </AppText>
          </View>
          <View style={[styles.levelPill, { backgroundColor: palette.primarySoft }]}>
            <AppText variant="caption" tone="primary">LEVEL {info.level}</AppText>
          </View>
        </View>
        <ProgressBar progress={info.progress} />
        <View style={styles.bottom}>
          <AppText variant="label" tone="muted">
            {info.xpIntoLevel} / {info.xpForNext} XP
          </AppText>
          <Icon name="chevron" size={18} color={palette.textSubtle} />
        </View>
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  nameWrap: { flex: 1, gap: 2 },
  kicker: { letterSpacing: 1 },
  levelPill: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
