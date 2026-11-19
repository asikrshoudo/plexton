import { StyleSheet, View } from 'react-native';
import type { GameId } from '@/games/registry';
import { FLOW_COLORS } from '../colorFlow/flowColors';
import { tileColors } from '../numberMerge/tileColors';
import { AppText } from '../ui/AppText';

const INK = '#1B1A2E';

function MergeArt({ size }: { size: number }) {
  const gap = size * 0.08;
  const tile = (size - gap) / 2;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {[2, 2, 4, 8].map((v, i) => {
        const c = tileColors(v);
        return (
          <View key={i} style={[styles.center, { width: tile, height: tile, borderRadius: tile * 0.22, backgroundColor: c.bg }]}>
            <AppText color={c.fg} style={{ fontSize: tile * 0.5, lineHeight: tile * 0.6, fontWeight: '900' }}>
              {v}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

function FlowArt({ size }: { size: number }) {
  const dot = size * 0.22;
  const rows = [
    { color: FLOW_COLORS[0].bg, left: 0, right: 0 },
    { color: FLOW_COLORS[1].bg, left: size * 0.16, right: 0 },
    { color: FLOW_COLORS[3].bg, left: 0, right: size * 0.16 },
  ];
  return (
    <View style={{ width: size, height: size, justifyContent: 'space-between' }}>
      {rows.map((r, i) => (
        <View key={i} style={[styles.row, { height: dot, marginLeft: r.left, marginRight: r.right }]}>
          <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: r.color }} />
          <View style={{ flex: 1, height: dot * 0.42, backgroundColor: r.color }} />
          <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: r.color }} />
        </View>
      ))}
    </View>
  );
}

function MemoryArt({ size }: { size: number }) {
  const gap = size * 0.07;
  const sq = (size - gap * 2) / 3;
  const lit = new Set([0, 4, 5, 7]);
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {Array.from({ length: 9 }, (_, i) => (
        <View
          key={i}
          style={{ width: sq, height: sq, borderRadius: sq * 0.24, backgroundColor: lit.has(i) ? INK : 'rgba(255,255,255,0.5)' }}
        />
      ))}
    </View>
  );
}

function WordArt({ size }: { size: number }) {
  const gap = size * 0.08;
  const tile = (size - gap) / 2;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {['W', 'O', 'R', 'D'].map((ch) => (
        <View key={ch} style={[styles.center, { width: tile, height: tile, borderRadius: tile * 0.22, backgroundColor: INK }]}>
          <AppText color="#FFFFFF" style={{ fontSize: tile * 0.5, lineHeight: tile * 0.6, fontWeight: '900' }}>
            {ch}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function GameArt({ id, size }: { id: GameId; size: number }) {
  const art =
    id === 'numberMerge' ? <MergeArt size={size} /> : id === 'colorFlow' ? <FlowArt size={size} /> : id === 'memoryFlash' ? <MemoryArt size={size} /> : <WordArt size={size} />;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {art}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
