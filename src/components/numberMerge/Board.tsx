import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import type { BoardState } from '@/games/numberMerge/logic';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { TileFace, TileView } from './TileView';

const GAP = 6;

type Cell = { row: number; col: number };
type Props = {
  board: BoardState;
  disabled?: boolean;
  onDrop: (tileId: number, row: number, col: number) => void;
};

export function Board({ board, disabled = false, onDrop }: Props) {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const { size } = board;
  const boardSize = Math.min(width - spacing.lg * 2, 420);
  const cell = (boardSize - GAP * (size + 1)) / size;
  const lift = cell * 0.55; // the dragged tile floats above the finger so it stays visible

  const [dragId, setDragId] = useState<number | null>(null);
  const [hover, setHover] = useState<Cell | null>(null);
  const fx = useSharedValue(0);
  const fy = useSharedValue(0);

  const live = useRef({ board, disabled, onDrop, cell, size, lift });
  const drag = useRef<{ id: number | null; ox: number; oy: number; at: Cell | null }>({ id: null, ox: 0, oy: 0, at: null });

  useEffect(() => {
    live.current = { board, disabled, onDrop, cell, size, lift };
  });

  const responder = useMemo(() => {
    const locate = (x: number, y: number): Cell | null => {
      const L = live.current;
      const step = L.cell + GAP;
      const col = Math.floor((x - GAP / 2) / step);
      const row = Math.floor((y - GAP / 2) / step);
      if (col < 0 || row < 0 || col >= L.size || row >= L.size) return null;
      return { row, col };
    };

    const finish = (dropIt: boolean) => {
      const d = drag.current;
      if (d.id === null) return;
      const { id, at } = d;
      drag.current = { id: null, ox: 0, oy: 0, at: null };
      setDragId(null);
      setHover(null);
      if (dropIt && at) live.current.onDrop(id, at.row, at.col);
    };

    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const L = live.current;
        if (L.disabled) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        const from = locate(x, y);
        const tile = from ? L.board.tiles.find((t) => t.row === from.row && t.col === from.col) : undefined;
        if (!tile) return;
        const at = locate(x, y - L.lift);
        drag.current = { id: tile.id, ox: x, oy: y, at };
        fx.set(x);
        fy.set(y - L.lift);
        setDragId(tile.id);
        setHover(at);
      },
      onPanResponderMove: (_e, g) => {
        const d = drag.current;
        if (d.id === null) return;
        const x = d.ox + g.dx;
        const y = d.oy + g.dy - live.current.lift;
        fx.set(x);
        fy.set(y);
        const at = locate(x, y);
        if (at?.row !== d.at?.row || at?.col !== d.at?.col) {
          d.at = at;
          setHover(at);
        }
      },
      onPanResponderRelease: () => finish(true),
      onPanResponderTerminate: () => finish(false),
    });
  }, [fx, fy]);

  const overlay = useAnimatedStyle(() => ({
    transform: [{ translateX: fx.get() - cell / 2 }, { translateY: fy.get() - cell / 2 }, { scale: 1.08 }],
  }));

  const dragged = dragId === null ? undefined : board.tiles.find((t) => t.id === dragId);
  const hoverTile = hover ? board.tiles.find((t) => t.row === hover.row && t.col === hover.col) : undefined;
  const validMerge = !!dragged && !!hoverTile && hoverTile.id !== dragged.id && hoverTile.value === dragged.value;

  const slots = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      slots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: GAP + c * (cell + GAP),
            top: GAP + r * (cell + GAP),
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
      accessibilityHint="Drag a tile onto a tile with the same number to merge them"
      style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: palette.surfaceAlt, borderBottomColor: palette.edge }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {slots}
        {hover && dragged ? (
          <View
            style={{
              position: 'absolute',
              left: GAP / 2 + hover.col * (cell + GAP),
              top: GAP / 2 + hover.row * (cell + GAP),
              width: cell + GAP,
              height: cell + GAP,
              borderRadius: cell * 0.26,
              borderWidth: 3,
              borderColor: validMerge ? palette.success : hoverTile ? 'transparent' : palette.textMuted,
            }}
          />
        ) : null}
        {board.tiles.map((t) => (
          <TileView key={t.id} value={t.value} row={t.row} col={t.col} cell={cell} gap={GAP} dim={t.id === dragId} />
        ))}
        {dragged ? (
          <Animated.View style={[styles.floating, { width: cell, height: cell }, overlay]}>
            <TileFace value={dragged.value} cell={cell} />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { borderRadius: radius.lg, borderBottomWidth: 5, alignSelf: 'center' },
  floating: { position: 'absolute', left: 0, top: 0 },
});
