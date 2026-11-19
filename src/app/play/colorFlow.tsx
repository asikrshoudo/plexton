import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlowBoard } from '@/components/colorFlow/FlowBoard';
import { FlowResult } from '@/components/colorFlow/FlowResult';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatTile } from '@/components/ui/StatTile';
import { useProfile } from '@/features/profile/ProfileProvider';
import { loadProgress, recordResult } from '@/features/progress/progressStore';
import { connectedCount, filledCount } from '@/games/colorFlow/logic';
import { useColorFlowGame } from '@/games/colorFlow/useColorFlowGame';
import { getGame } from '@/games/registry';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const accent = getGame('colorFlow')?.accent ?? '#19B8A6';

function ColorFlowGame({ level, tier, onAgain }: { level: number; tier: number; onAgain: () => void }) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { addXp } = useProfile();
  const [xp, setXp] = useState(0);
  const [score, setScore] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);

  const { phase, generated, state, begin, move, end, clear } = useColorFlowGame({
    level,
    tier,
    onFinish: (result) => {
      const out = recordResult(result);
      addXp(out.xpEarned);
      setXp(out.xpEarned);
      setScore(result.score);
      setSaveFailed(!out.saved);
    },
  });

  const total = generated ? generated.config.size * generated.config.size : 0;
  const filled = state ? Math.round((filledCount(state) / total) * 100) : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
      }}
      scrollEnabled={phase !== 'playing'}
      showsVerticalScrollIndicator={false}>
      <ScreenHeader title={`Color Flow · Level ${level}`} />

      {phase === 'loading' ? (
        <View style={styles.center} accessibilityLiveRegion="polite">
          <ActivityIndicator size="large" color={palette.primary} />
          <AppText tone="muted">Preparing level…</AppText>
        </View>
      ) : null}

      {phase === 'error' ? (
        <View style={styles.center}>
          <AppText tone="danger">Could not prepare this level.</AppText>
          <Button label="Try again" onPress={onAgain} />
        </View>
      ) : null}

      {generated && state ? (
        <>
          <View style={styles.stats}>
            <StatTile label="Pairs" value={`${connectedCount(state)}/${state.pairs.length}`} />
            <StatTile label="Filled" value={`${filled}%`} />
          </View>

          <FlowBoard state={state} onBegin={begin} onMove={move} onEnd={end} />

          {phase === 'won' ? (
            <>
              <FlowResult level={level} score={score} xp={xp} accent={accent} onNext={onAgain} onHome={() => router.back()} />
              {saveFailed ? <AppText tone="danger">Could not save progress on this device.</AppText> : null}
            </>
          ) : (
            <>
              <AppText variant="label" tone="muted" style={styles.hint}>
                Connect every matching pair and fill the whole grid.
              </AppText>
              <Button label="Clear paths" variant="secondary" onPress={clear} />
            </>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

export default function ColorFlowScreen() {
  const [session, setSession] = useState(() => {
    const p = loadProgress('colorFlow');
    return { level: p.level, tier: p.tier, run: 0 };
  });

  const again = () => {
    const p = loadProgress('colorFlow');
    setSession((s) => ({ level: p.level, tier: p.tier, run: s.run + 1 }));
  };

  return <ColorFlowGame key={session.run} level={session.level} tier={session.tier} onAgain={again} />;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  stats: { flexDirection: 'row', gap: spacing.md },
  hint: { textAlign: 'center' },
});
