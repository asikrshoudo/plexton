import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { shade } from '@/theme/shade';
import { AppText } from '../ui/AppText';
import { tileColors } from './tileColors';

export function TileFace({ value, cell }: { value: number; cell: number }) {
  const colors = tileColors(value);
  const digits = String(value).length;
  const fontSize = cell * (digits >= 4 ? 0.3 : digits === 3 ? 0.38 : 0.46);
  return (
    <View
      style={[
        styles.face,
        {
          width: cell,
          height: cell,
          borderRadius: cell * 0.2,
          backgroundColor: colors.bg,
          borderBottomWidth: cell * 0.07,
          borderBottomColor: shade(colors.bg, -0.25),
        },
      ]}>
      <AppText color={colors.fg} style={{ fontSize, lineHeight: fontSize * 1.2, fontWeight: '900' }}>
        {value}
      </AppText>
    </View>
  );
}

type Props = { value: number; row: number; col: number; cell: number; gap: number; dim?: boolean };

export function TileView({ value, row, col, cell, gap, dim = false }: Props) {
  const scale = useSharedValue(0.6);

  useEffect(() => {
    scale.set(withSequence(withTiming(1.12, { duration: 100 }), withTiming(1, { duration: 120 })));
  }, [value, scale]);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View
      style={[
        styles.tile,
        { left: gap + col * (cell + gap), top: gap + row * (cell + gap), width: cell, height: cell, opacity: dim ? 0.3 : 1 },
        animated,
      ]}>
      <TileFace value={value} cell={cell} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  face: { alignItems: 'center', justifyContent: 'center' },
  tile: { position: 'absolute' },
});
