import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { radius, spacing, stroke } from '@/theme/tokens';
import { AppText } from './AppText';
import { useHearts } from '@/features/hearts/HeartsProvider';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours}h ${remMinutes}m`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

type Props = {
  showCountdown?: boolean;
  compact?: boolean;
};

export function HeartStatus({ showCountdown = true, compact = false }: Props) {
  const { palette } = useTheme();
  const { hearts, maxHearts, msToNextHeart, isFull } = useHearts();
  const countdown = !isFull && showCountdown ? `Next in ${formatCountdown(msToNextHeart)}` : null;

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Hearts ${hearts} of ${maxHearts}${countdown ? `. ${countdown}` : '. Full'}`}
      style={[
        styles.wrap,
        compact ? styles.compact : null,
        { backgroundColor: palette.surfaceAlt, borderColor: palette.border },
      ]}>
      <View style={styles.row}>
        <AppText variant="label">♥ {hearts}/{maxHearts}</AppText>
        {!compact ? <AppText variant="caption" tone="muted">Hearts</AppText> : null}
      </View>
      {countdown ? (
        <AppText variant="caption" tone="muted">
          {countdown}
        </AppText>
      ) : !compact ? (
        <AppText variant="caption" tone="muted">Full</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: stroke.hairline,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  compact: {
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
