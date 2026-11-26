import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import type { BoardState } from '@/games/numberMerge/logic';
import { motion, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { TileFace, TileView } from './TileView';

const GAP = 6;

type Cell = { row: number; col: number };
type Props = {
  board: BoardState;
  disabled?: boolean;
  onDrop: (tileId: number, row: number, col: number) => void;
};

function cellForValue(value: number): string {
  return String.fromCharCode(65 + Math.round(Math.log2(Math.max(2, value)) - 1));
}

export function Board({ board, disabled = false, onDrop }: Props) {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { size } = board;
  const boardSize = Math.min(width - spacing.lg * 2, 420);
  const cell = (boardSize - GAP * (size + 1)) / size;
  const lift = cell * 0.55;

  const [dragId, setDragId] = useState<number | null>(null);
  const [hover, setHover] = useState<Cell | null>(null);
  const fx = useSharedValue(0);
  const fy = useSharedValue(0);

  const live = useRef({ board, disabled, cell, size, onDrop, dragId: null as number | null, hover: null as Cell | null });
  useEffect(() => {
    live.current.board = board;
    live.current.disabled = disabled;
    live.current.cell = cell;
    live.current.size = size;
    live.current.onDrop = onDrop;
  });
  useEffect(() => {
    live.current.hover = hover;
  }, [hover]);
  const effectiveDragId = dragId !== null && board.tiles.some((t) => t.id === dragId) ? dragId : null;
  useEffect(() => {
    live.current.dragId = effectiveDragId;
  }, [effectiveDragId]);

  // eslint-disable-next-line react-hooks/refs -- gesture handlers intentionally read refs and shared values at callback time
  const [responder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.disabled && live.current.dragId === null,
      onMoveShouldSetPanResponder: (_, g) =>
        !live.current.disabled && live.current.dragId !== null && (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
      onPanResponderGrant: (_, g) => {
        const { board: b, cell: cs, size: n } = live.current;
        const col = Math.floor((g.x0 - GAP) / (cs + GAP));
        const row = Math.floor((g.y0 - GAP) / (cs + GAP));
        if (row < 0 || row >= n || col < 0 || col >= n) return;
        const tile = b.tiles.find((t) => t.row === row && t.col === col);
        if (!tile) return;
        live.current.dragId = tile.id;
        setDragId(tile.id);
        setHover({ row, col });
        fx.value = 0;
        fy.value = 0;
      },
      onPanResponderMove: (_, g) => {
        const { cell: cs, size: n, board: b, dragId: id } = live.current;
        if (id === null) return;
        fx.value = g.dx;
        fy.value = g.dy - lift;
        const src = b.tiles.find((t) => t.id === id);
        if (!src) return;
        const col = Math.min(n - 1, Math.max(0, Math.floor((src.col * (cs + GAP) + GAP + g.dx + cs / 2) / (cs + GAP))));
        const row = Math.min(n - 1, Math.max(0, Math.floor((src.row * (cs + GAP) + GAP + g.dy + cs / 2) / (cs + GAP))));
        setHover((h) => (h && h.row === row && h.col === col ? h : { row, col }));
      },
      onPanResponderRelease: () => {
        const { dragId: id, hover: h, onDrop: drop } = live.current;
        if (id !== null && h) drop(id, h.row, h.col);
        setDragId(null);
        setHover(null);
        fx.value = 0;
        fy.value = 0;
      },
      onPanResponderTerminate: () => {
        setDragId(null);
        setHover(null);
        fx.value = 0;
        fy.value = 0;
      },
    }),
  );

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fx.value },
      { translateY: fy.value },
      { scale: withTiming(1.04, { duration: reducedMotion ? 0 : motion.duration.fast }) },
    ],
  }));

  const dragTile = effectiveDragId === null ? undefined : board.tiles.find((t) => t.id === effectiveDragId);

  return (
    <View
      accessibilityLabel={`Number Merge board, ${size} by ${size}. Drag a tile onto an equal tile to merge, or onto an empty space to move.`}
      style={[
        styles.board,
        {
          width: boardSize,
          height: boardSize,
          padding: GAP,
          backgroundColor: palette.surfaceAlt,
          borderColor: palette.border,
          shadowColor: palette.ink,
        },
      ]}
      {...responder.panHandlers}>
      {Array.from({ length: size * size }, (_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const hot = hover?.row === row && hover?.col === col && effectiveDragId !== null;
        return (
          <View
            key={i}
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.cell,
              {
                width: cell,
                height: cell,
                borderRadius: cell * 0.2,
                backgroundColor: hot ? palette.primarySoft : palette.bgElevated,
                borderColor: hot ? palette.borderStrong : palette.border,
              },
            ]}
          />
        );
      })}
      {board.tiles.map((t) => (
        <TileView
          key={t.id}
          value={t.value}
          row={t.row}
          col={t.col}
          cell={cell}
          gap={GAP}
          dim={t.id === effectiveDragId}
          label={cellForValue(t.value)}
        />
      ))}
      {dragTile ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: GAP + dragTile.col * (cell + GAP),
              top: GAP + dragTile.row * (cell + GAP),
              zIndex: 20,
            },
            floatStyle,
          ]}>
          <TileFace value={dragTile.value} cell={cell} label={cellForValue(dragTile.value)} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    borderRadius: radius.xl,
    borderWidth: stroke.hairline,
    alignSelf: 'center',
  },
  cell: {
    borderWidth: stroke.hairline,
  },
});
