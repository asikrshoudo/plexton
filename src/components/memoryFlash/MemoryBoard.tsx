import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

type Props = {
  gridSize: number;
  sequence: number[];
  input: number[];
  activeCell: number | null;
  disabled: boolean;
  wrongCell?: number | null;
  onCellPress: (cell: number) => void;
};

export function MemoryBoard({ gridSize, sequence, input, activeCell, disabled, wrongCell = null, onCellPress }: Props) {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();
  const total = gridSize * gridSize;
  const cells = Array.from({ length: total }, (_, i) => i);

  return (
    <View
      accessibilityRole="none"
      accessibilityLabel={`Memory board ${gridSize} by ${gridSize}`}
      style={styles.board}>
      {cells.map((cell) => {
        const isActive = activeCell === cell;
        const inputIndex = input.indexOf(cell);
        const isInput = inputIndex >= 0;
        const isWrong = wrongCell === cell;
        const order = isInput ? inputIndex + 1 : null;
        return (
          <Cell
            key={cell}
            cell={cell}
            gridSize={gridSize}
            isActive={isActive}
            isInput={isInput}
            isWrong={isWrong}
            disabled={disabled}
            reducedMotion={Boolean(reducedMotion)}
            order={order}
            onPress={onCellPress}
            palette={palette}
          />
        );
      })}
    </View>
  );
}

function Cell({
  cell, gridSize, isActive, isInput, isWrong, disabled, reducedMotion, order, onPress, palette,
}: {
  cell: number; gridSize: number; isActive: boolean; isInput: boolean; isWrong: boolean;
  disabled: boolean; reducedMotion: boolean; order: number | null; onPress: (cell: number) => void;
  palette: ReturnType<typeof useTheme>['palette'];
}) {
  const bg = isWrong ? palette.dangerSoft : isActive ? palette.primary : isInput ? palette.primarySoft : palette.surface;
  const border = isWrong ? palette.danger : isActive ? palette.focus : isInput ? palette.primary : palette.border;
  const textColor = isActive ? palette.onPrimary : isWrong ? palette.danger : palette.text;
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(isActive ? 1.03 : 1, { duration: reducedMotion ? 0 : 140 }) }],
  }));

  return (
    <Animated.View style={[styles.cellWrap, { width: `${100 / gridSize}%` }, anim]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Row ${Math.floor(cell / gridSize) + 1}, column ${cell % gridSize + 1}${isInput ? `, selected step ${order}` : ''}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => onPress(cell)}
        style={[styles.cell, { backgroundColor: bg, borderColor: border }]}>
        <AppText variant="caption" color={textColor}>
          {isInput ? String(order) : ''}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  cellWrap: { padding: spacing.xs, aspectRatio: 1 },
  cell: {
    flex: 1,
    borderWidth: stroke.strong,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
