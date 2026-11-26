import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { getLevelInfo } from '@/features/profile/xp';
import { useProfile } from '@/features/profile/ProfileProvider';
import { elevation, MIN_TOUCH, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function HomeHeader() {
  const { palette } = useTheme();
  const { profile } = useProfile();
  const info = getLevelInfo(profile.xp);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={[styles.eyebrowWrap, { borderColor: palette.border, backgroundColor: palette.surfaceAlt }]}>
          <AppText variant="caption" tone="subtle" style={styles.eyebrow}>
            PLEXTON
          </AppText>
        </View>
        <PressableScale
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={[styles.iconButton, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Icon name="settings" color={palette.text} />
        </PressableScale>
      </View>

      <View style={styles.hero}>
        <View style={styles.copy}>
          <AppText variant="display" accessibilityRole="header" style={styles.title}>
            Quiet puzzles,{'\n'}clever wins.
          </AppText>
          <AppText variant="body" tone="muted" style={styles.subtitle}>
            A premium puzzle arcade designed for focus, calm progress, and satisfying little breakthroughs.
          </AppText>
        </View>

        <PressableScale
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          accessibilityLabel={`Open profile. ${profile.name}, level ${info.level}`}
          style={[
            styles.profileCard,
            elevation.card,
            { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.ink },
          ]}>
          <View style={styles.profileTop}>
            <View style={[styles.avatar, { backgroundColor: palette.primarySoft, borderColor: palette.borderStrong }]}>
              <AppText variant="heading" tone="primary">
                {profile.name.charAt(0).toUpperCase()}
              </AppText>
            </View>
            <View style={styles.profileMeta}>
              <AppText variant="caption" tone="subtle" style={styles.kicker}>
                PLAYER
              </AppText>
              <AppText variant="heading" numberOfLines={1}>
                {profile.name}
              </AppText>
            </View>
          </View>
          <View style={styles.profileBottom}>
            <AppText variant="label" tone="muted">
              Level {info.level} · {profile.xp} XP
            </AppText>
            <Icon name="chevron" size={18} color={palette.textSubtle} />
          </View>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  eyebrowWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: stroke.hairline,
  },
  eyebrow: { letterSpacing: 1.5 },
  iconButton: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.md,
    borderWidth: stroke.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { gap: spacing.lg },
  copy: { gap: spacing.sm },
  title: { maxWidth: 340 },
  subtitle: { maxWidth: 340 },
  profileCard: {
    borderRadius: radius.lg,
    borderWidth: stroke.hairline,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: stroke.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMeta: { flex: 1, gap: 2 },
  kicker: { letterSpacing: 1.1 },
  profileBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
});
