import { useEffect, useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { connectedCount, type ColorFlowState } from '@/games/colorFlow/logic';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { flowColor } from './flowColors';

type Props = {
  state: ColorFlowState;
  onBegin: (cell: number) => void;
  onMove: (cell: number) => void;
  onEnd: () => void;
};

export function FlowBoard({ state, onBegin, onMove, onEnd }: Props) {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const { size } = state;
  const boardSize = Math.min(width - spacing.lg * 2, 420);
  const cell = boardSize / size;

  const handlers = useRef({ onBegin, onMove, onEnd });
  const geo = useRef({ cell, size });
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    handlers.current = { onBegin, onMove, onEnd };
    geo.current = { cell, size };
  });

  const responder = useMemo(() => {
    const cellAt = (x: number, y: number) => {
      const g = geo.current;
      const col = Math.min(g.size - 1, Math.max(0, Math.floor(x / g.cell)));
      const row = Math.min(g.size - 1, Math.max(0, Math.floor(y / g.cell)));
      return row * g.size + col;
    };
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        origin.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        handlers.current.onBegin(cellAt(origin.current.x, origin.current.y));
      },
      onPanResponderMove: (_e, g) => {
        handlers.current.onMove(cellAt(origin.current.x + g.dx, origin.current.y + g.dy));
      },
      onPanResponderRelease: () => handlers.current.onEnd(),
      onPanResponderTerminate: () => handlers.current.onEnd(),
    });
  }, []);

  const thick = cell * 0.3;
  const dot = cell * 0.64;
  const center = (idx: number) => ({
    x: (idx % size) * cell + cell / 2,
    y: Math.floor(idx / size) * cell + cell / 2,
  });

  const tints: React.ReactNode[] = [];
  const bars: React.ReactNode[] = [];
  state.paths.forEach((path, color) => {
    const bg = flowColor(color).bg;
    path.forEach((idx, k) => {
      const c = center(idx);
      tints.push(
        <View
          key={`t${idx}`}
          style={{ position: 'absolute', left: c.x - cell / 2, top: c.y - cell / 2, width: cell, height: cell, backgroundColor: `${bg}30` }}
        />,
      );
      if (k === 0) return;
      const p = center(path[k - 1]);
      const horizontal = p.y === c.y;
      bars.push(
        <View
          key={`b${color}-${k}`}
          style={{
            position: 'absolute',
            left: horizontal ? Math.min(p.x, c.x) - thick / 2 : c.x - thick / 2,
            top: horizontal ? c.y - thick / 2 : Math.min(p.y, c.y) - thick / 2,
            width: horizontal ? cell + thick : thick,
            height: horizontal ? thick : cell + thick,
            borderRadius: thick / 2,
            backgroundColor: bg,
          }}
        />,
      );
    });
  });

  const dots = state.pairs.flatMap(([a, b], color) =>
    [a, b].map((idx) => {
      const c = center(idx);
      const fc = flowColor(color);
      return (
        <View
          key={`d${idx}`}
          style={[
            styles.dot,
            { left: c.x - dot / 2, top: c.y - dot / 2, width: dot, height: dot, borderRadius: dot / 2, backgroundColor: fc.bg },
          ]}>
          <AppText variant="label" color={fc.fg}>
            {color + 1}
          </AppText>
        </View>
      );
    }),
  );

  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= size; i += 1) {
    lines.push(
      <View key={`h${i}`} style={{ position: 'absolute', left: 0, top: i * cell - 0.5, width: boardSize, height: 1, backgroundColor: palette.border }} />,
      <View key={`v${i}`} style={{ position: 'absolute', top: 0, left: i * cell - 0.5, height: boardSize, width: 1, backgroundColor: palette.border }} />,
    );
  }

  return (
    <View
      {...responder.panHandlers}
      accessible
      accessibilityLabel={`Color Flow board, ${connectedCount(state)} of ${state.pairs.length} pairs connected`}
      accessibilityHint="Drag from a numbered dot to its matching dot"
      style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {tints}
        {lines}
        {bars}
        {dots}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { alignSelf: 'center', borderRadius: radius.md, borderWidth: 1, overflow: 'hidden' },
  dot: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
