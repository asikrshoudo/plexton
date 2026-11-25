import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

export type IconName = 'back' | 'settings' | 'chevron';

export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color?: string }) {
  const { palette } = useTheme();
  const c = color ?? palette.text;
  const hidden = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const;

  if (name === 'back' || name === 'chevron') {
    const arm = size * 0.42;
    return (
      <View {...hidden} style={[styles.center, { width: size, height: size }]}>
        <View
          style={{
            width: arm,
            height: arm,
            borderLeftWidth: 2.5,
            borderBottomWidth: 2.5,
            borderColor: c,
            borderRadius: 1.5,
            marginLeft: name === 'back' ? size * 0.12 : -size * 0.08,
            transform: [{ rotate: name === 'back' ? '45deg' : '-135deg' }],
          }}
        />
      </View>
    );
  }

  const knob = size * 0.28;
  const rows = [0.22, 0.5, 0.78];
  return (
    <View {...hidden} style={{ width: size, height: size }}>
      {rows.map((y, i) => (
        <View key={y}>
          <View
            style={{
              position: 'absolute',
              left: size * 0.08,
              top: size * y - 1.25,
              width: size * 0.84,
              height: 2.5,
              borderRadius: 2,
              backgroundColor: c,
              opacity: 0.85,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: size * (i === 1 ? 0.28 : i === 0 ? 0.62 : 0.52) - knob / 2,
              top: size * y - knob / 2,
              width: knob,
              height: knob,
              borderRadius: knob / 2,
              backgroundColor: palette.surface,
              borderWidth: 2,
              borderColor: c,
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
