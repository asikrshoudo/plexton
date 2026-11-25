import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { palette } = useTheme();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  return (
    <View style={styles.row}>
      <PressableScale
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.back, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Icon name="back" size={22} color={palette.text} />
      </PressableScale>
      <View style={styles.text}>
        <AppText variant="title" accessibilityRole="header" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="label" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
