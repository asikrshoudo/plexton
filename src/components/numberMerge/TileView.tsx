import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { AppText } from '../ui/AppText';
import { tileColors } from './tileColors';

type Props = { value: number; row: number; col: number; cell: number; gap: number };

export function TileView({ value, row, col, cell, gap }: Props) {
  const tx = col * (cell + gap) + gap;
  const ty = row * (cell + gap) + gap;
  const x = useSharedValue(tx);
  const y = useSharedValue(ty);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    x.set(withTiming(tx, { duration: 110 }));
    y.set(withTiming(ty, { duration: 110 }));
  }, [tx, ty, x, y]);

  useEffect(() => {
    scale.set(withSequence(withTiming(1.12, { duration: 90 }), withTiming(1, { duration: 110 })));
  }, [value, scale]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: scale.get() }],
  }));

  const colors = tileColors(value);
  const digits = String(value).length;
  const fontSize = cell * (digits >= 4 ? 0.3 : digits === 3 ? 0.36 : 0.44);

  return (
    <Animated.View
      style={[styles.tile, { width: cell, height: cell, borderRadius: cell * 0.2, backgroundColor: colors.bg }, animated]}>
      <AppText color={colors.fg} style={{ fontSize, lineHeight: fontSize * 1.2, fontWeight: '800' }}>
        {value}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: { position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center' },
});
