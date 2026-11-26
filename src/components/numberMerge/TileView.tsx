import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { motion } from '@/theme/tokens';
import { shade } from '@/theme/shade';
import { AppText } from '../ui/AppText';
import { tileColors } from './tileColors';

export function TileFace({ value, cell, label }: { value: number; cell: number; label?: string }) {
  const colors = tileColors(value);
  const digits = String(value).length;
  const fontSize = cell * (digits >= 4 ? 0.3 : digits === 3 ? 0.38 : 0.46);
  const displayLabel = label ?? String.fromCharCode(65 + Math.round(Math.log2(Math.max(2, value)) - 1));
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Tile ${value}, mark ${displayLabel}`}
      style={[
        styles.face,
        {
          width: cell,
          height: cell,
          borderRadius: cell * 0.2,
          backgroundColor: colors.bg,
          borderBottomWidth: Math.max(2, cell * 0.07),
          borderBottomColor: shade(colors.bg, -0.25),
        },
      ]}>
      <AppText
        color={colors.fg}
        maxFontSizeMultiplier={1.1}
        style={{ fontSize, lineHeight: fontSize * 1.15, fontWeight: '900' }}>
        {value}
      </AppText>
      <View style={[styles.mark, { backgroundColor: shade(colors.bg, -0.18) }]}>
        <AppText color={colors.fg} maxFontSizeMultiplier={1} style={{ fontSize: Math.max(9, cell * 0.16), fontWeight: '800' }}>
          {displayLabel}
        </AppText>
      </View>
    </View>
  );
}

type Props = { value: number; row: number; col: number; cell: number; gap: number; dim?: boolean; label?: string };

export function TileView({ value, row, col, cell, gap, dim = false, label }: Props) {
  const scale = useSharedValue(0.75);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSequence(
      withTiming(1.06, { duration: motion.duration.fast }),
      withTiming(1, { duration: motion.duration.normal }),
    );
  }, [reducedMotion, scale, value]);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const x = gap + col * (cell + gap);
  const y = gap + row * (cell + gap);

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: x, top: y, opacity: dim ? 0.25 : 1 }, animated]}>
      <TileFace value={value} cell={cell} label={label} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  face: { alignItems: 'center', justifyContent: 'center' },
  mark: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 999,
    alignItems: 'center',
  },
});
