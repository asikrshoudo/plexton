import { useEffect, useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { BoardState, Direction } from '@/games/numberMerge/logic';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { TileView } from './TileView';

const GAP = 8;
const SWIPE_MIN = 24;

type Props = { board: BoardState; onSwipe: (dir: Direction) => void };

export function Board({ board, onSwipe }: Props) {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const swipeRef = useRef(onSwipe);

  useEffect(() => {
    swipeRef.current = onSwipe;
  });

  const responder = useMemo(
    () =>
    // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (_e, g) => {
          const ax = Math.abs(g.dx);
          const ay = Math.abs(g.dy);
          if (Math.max(ax, ay) < SWIPE_MIN) return;
          if (ax > ay) swipeRef.current(g.dx > 0 ? 'right' : 'left');
          else swipeRef.current(g.dy > 0 ? 'down' : 'up');
        },
      }),
    [],
  );

  const { size } = board;
  const boardSize = Math.min(width - spacing.lg * 2, 420);
  const cell = (boardSize - GAP * (size + 1)) / size;

  const slots = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      slots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: c * (cell + GAP) + GAP,
            top: r * (cell + GAP) + GAP,
            width: cell,
            height: cell,
            borderRadius: cell * 0.2,
            backgroundColor: palette.bg,
          }}
        />,
      );
    }
  }

  return (
    <View
      {...responder.panHandlers}
      accessible
      accessibilityLabel={`Number Merge board, ${board.tiles.length} tiles`}
      accessibilityHint="Swipe in any direction to slide the tiles"
      style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: palette.surfaceAlt }]}>
      {slots}
      {board.tiles.map((t) => (
        <TileView key={t.id} value={t.value} row={t.row} col={t.col} cell={cell} gap={GAP} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { borderRadius: radius.lg, alignSelf: 'center' },
});
