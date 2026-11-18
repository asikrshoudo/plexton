import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export function ScreenHeader({ title }: { title: string }) {
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
        <AppText variant="title">←</AppText>
      </PressableScale>
      <AppText variant="title" accessibilityRole="header" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1 },
});
