import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { connectedCount, type ColorFlowState } from '@/games/colorFlow/logic';
import { radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { flowColor, flowMark } from './flowColors';

type Props = {
  state: ColorFlowState;
  disabled?: boolean;
  onBegin: (cell: number) => void;
  onMove: (cell: number) => void;
  onEnd: () => void;
};

export function FlowBoard({ state, disabled = false, onBegin, onMove, onEnd }: Props) {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const { size } = state;
  const boardSize = Math.min(width - spacing.lg * 2, 420);
  const cell = boardSize / size;

  const handlers = useRef({ onBegin, onMove, onEnd });
  const geo = useRef({ cell, size, disabled });
  const origin = useRef({ x: 0, y: 0 });
  const lastCell = useRef(-1);
  useEffect(() => {
    handlers.current.onBegin = onBegin;
    handlers.current.onMove = onMove;
    handlers.current.onEnd = onEnd;
    geo.current.cell = cell;
    geo.current.size = size;
    geo.current.disabled = disabled;
  });

  // eslint-disable-next-line react-hooks/refs -- gesture callbacks read refs intentionally
  const [responder] = useState(() => {
    const cellAt = (x: number, y: number) => {
      const g = geo.current;
      const col = Math.min(g.size - 1, Math.max(0, Math.floor(x / g.cell)));
      const row = Math.min(g.size - 1, Math.max(0, Math.floor(y / g.cell)));
      return row * g.size + col;
    };
    const emit = (x: number, y: number, fn: (cell: number) => void) => {
      const c = cellAt(x, y);
      if (c === lastCell.current) return;
      lastCell.current = c;
      fn(c);
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !geo.current.disabled,
      onMoveShouldSetPanResponder: () => !geo.current.disabled,
      onPanResponderGrant: (evt) => {
        if (geo.current.disabled) return;
        origin.current = { x: evt.nativeEvent.pageX - evt.nativeEvent.locationX, y: evt.nativeEvent.pageY - evt.nativeEvent.locationY };
        lastCell.current = -1;
        emit(evt.nativeEvent.locationX, evt.nativeEvent.locationY, handlers.current.onBegin);
      },
      onPanResponderMove: (evt) => {
        if (geo.current.disabled) return;
        emit(evt.nativeEvent.pageX - origin.current.x, evt.nativeEvent.pageY - origin.current.y, handlers.current.onMove);
      },
      onPanResponderRelease: () => {
        lastCell.current = -1;
        handlers.current.onEnd();
      },
      onPanResponderTerminate: () => {
        lastCell.current = -1;
        handlers.current.onEnd();
      },
    });
  });

  const connected = connectedCount(state);
  const cellOwner = Array.from({ length: size * size }, (_, i) => state.paths.findIndex((p) => p.includes(i)));

  return (
    <View
      accessibilityLabel={`Color Flow board, ${size} by ${size}. ${connected} of ${state.pairs.length} paths connected.`}
      accessibilityHint="Drag from one endpoint to its matching endpoint. Drawing through another path cuts it."
      style={[
        styles.board,
        {
          width: boardSize,
          height: boardSize,
          backgroundColor: palette.surface,
          borderColor: palette.border,
          shadowColor: palette.ink,
        },
      ]}
      {...responder.panHandlers}>
      {Array.from({ length: size }, (_, r) => (
        <View key={`h${r}`} pointerEvents="none" style={[styles.line, { top: r * cell, width: boardSize, height: 1, backgroundColor: palette.border }]} />
      ))}
      {Array.from({ length: size }, (_, c) => (
        <View key={`v${c}`} pointerEvents="none" style={[styles.line, { left: c * cell, width: 1, height: boardSize, backgroundColor: palette.border }]} />
      ))}

      {Array.from({ length: size * size }, (_, i) => {
        const owner = cellOwner[i];
        if (owner < 0) return null;
        return (
          <View
            key={`fill${i}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: (i % size) * cell + cell * 0.12,
              top: Math.floor(i / size) * cell + cell * 0.12,
              width: cell * 0.76,
              height: cell * 0.76,
              borderRadius: cell * 0.22,
              backgroundColor: flowColor(owner).bg,
              opacity: 0.22,
            }}
          />
        );
      })}

      {state.paths.map((path, color) => {
        const c = flowColor(color);
        return path.map((cellIndex, i) => {
          if (i === 0) return null;
          const prev = path[i - 1];
          const pr = Math.floor(prev / size);
          const pc = prev % size;
          const cr = Math.floor(cellIndex / size);
          const cc = cellIndex % size;
          const minR = Math.min(pr, cr);
          const minC = Math.min(pc, cc);
          const horizontal = pr === cr;
          const thickness = cell * 0.36;
          return (
            <View
              key={`${color}-${prev}-${cellIndex}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: minC * cell + (horizontal ? cell * 0.2 : cell / 2 - thickness / 2),
                top: minR * cell + (horizontal ? cell / 2 - thickness / 2 : cell * 0.2),
                width: horizontal ? cell * 0.6 + thickness : thickness,
                height: horizontal ? thickness : cell * 0.6 + thickness,
                borderRadius: thickness / 2,
                backgroundColor: c.bg,
              }}
            />
          );
        });
      })}

      {state.pairs.map(([a, b], color) => {
        const c = flowColor(color);
        const mark = flowMark(color);
        return [a, b].map((cellIndex) => {
          const r = Math.floor(cellIndex / size);
          const col = cellIndex % size;
          return (
            <View
              key={`dot-${color}-${cellIndex}`}
              pointerEvents="none"
              style={[
                styles.dot,
                {
                  left: col * cell + cell * 0.22,
                  top: r * cell + cell * 0.22,
                  width: cell * 0.56,
                  height: cell * 0.56,
                  borderRadius: cell * 0.28,
                  backgroundColor: c.bg,
                },
              ]}>
              <AppText color={c.fg} maxFontSizeMultiplier={1} style={{ fontSize: cell * 0.2, fontWeight: '900' }}>
                {mark}
              </AppText>
            </View>
          );
        });
      })}

      <View pointerEvents="none" style={[styles.progress, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}>
        <AppText variant="caption" tone="muted">
          {connected}/{state.pairs.length} paths
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    borderRadius: radius.xl,
    borderWidth: stroke.hairline,
    overflow: 'hidden',
  },
  line: { position: 'absolute' },
  dot: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progress: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: stroke.hairline,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});
