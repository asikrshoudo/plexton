import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

export type IconName = 'back' | 'settings';

export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color?: string }) {
  const { palette } = useTheme();
  const c = color ?? palette.text;
  const hidden = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const;

  if (name === 'back') {
    const arm = size * 0.52;
    return (
      <View {...hidden} style={[styles.center, { width: size, height: size }]}>
        <View
          style={{
            width: arm,
            height: arm,
            borderLeftWidth: 3.5,
            borderBottomWidth: 3.5,
            borderColor: c,
            borderRadius: 2,
            marginLeft: size * 0.14,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    );
  }

  const knob = size * 0.34;
  const rows = [
    { y: 0.2, x: 0.7 },
    { y: 0.5, x: 0.3 },
    { y: 0.8, x: 0.6 },
  ];
  return (
    <View {...hidden} style={{ width: size, height: size }}>
      {rows.map((r) => (
        <View key={r.y}>
          <View
            style={{ position: 'absolute', left: 0, top: size * r.y - 1.5, width: size, height: 3, borderRadius: 2, backgroundColor: c }}
          />
          <View
            style={{
              position: 'absolute',
              left: size * r.x - knob / 2,
              top: size * r.y - knob / 2,
              width: knob,
              height: knob,
              borderRadius: knob / 2,
              backgroundColor: c,
              borderWidth: 3,
              borderColor: palette.surface,
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
