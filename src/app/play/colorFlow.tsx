import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlowBoard } from '@/components/colorFlow/FlowBoard';
import { FlowResult } from '@/components/colorFlow/FlowResult';
import { AppDialog } from '@/components/ui/AppDialog';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { StatTile } from '@/components/ui/StatTile';
import { useProfile } from '@/features/profile/ProfileProvider';
import { loadProgress, recordResult } from '@/features/progress/progressStore';
import { connectedCount, filledCount } from '@/games/colorFlow/logic';
import { useColorFlowGame } from '@/games/colorFlow/useColorFlowGame';
import { getGame } from '@/games/registry';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const accent = getGame('colorFlow')?.accent ?? '#2F7C72';

type FinishSummary = { moves: number; durationMs: number; score: number };

function ColorFlowGame({ level, tier, onAgain }: { level: number; tier: number; onAgain: () => void }) {
  const { palette } = useTheme();
  const { addXp } = useProfile();
  const [xpEarned, setXpEarned] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [summary, setSummary] = useState<FinishSummary | null>(null);
  const { phase, generated, state, begin, move, end, pause, resume, restart } = useColorFlowGame({
    level,
    tier,
    onFinish: (result) => {
      const { xpEarned: xp } = recordResult(result);
      setSummary({ moves: result.moves, durationMs: result.durationMs, score: result.score });
      if (xp > 0) addXp(xp);
      setXpEarned(xp);
    },
  });

  if (phase === 'loading' || !state || !generated) {
    return (
      <Screen title="Color Flow" subtitle={`Level ${level}`} scroll={false}>
        <LoadingState label="Preparing your puzzle" />
      </Screen>
    );
  }

  if (phase === 'error') {
    return (
      <Screen title="Color Flow" subtitle={`Level ${level}`}>
        <Card style={styles.messageCard}>
          <AppText variant="heading">Could not prepare this puzzle</AppText>
          <AppText tone="muted">Please return to the lobby and try again.</AppText>
          <Button label="Back to lobby" onPress={() => router.replace('/game/colorFlow')} />
        </Card>
      </Screen>
    );
  }

  const connected = connectedCount(state);
  const filled = filledCount(state);
  const total = state.size * state.size;
  const remaining = total - filled;
  const ended = phase === 'won';

  const requestExit = () => {
    if (phase === 'playing') pause();
    setExitOpen(true);
  };
  const closeExit = () => {
    setExitOpen(false);
    if (phase === 'paused') resume();
  };
  const confirmExit = () => {
    setExitOpen(false);
    router.replace('/game/colorFlow');
  };

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Color Flow</AppText>
          <AppText variant="label" tone="muted">
            Level {level} · Connect every pair
          </AppText>
        </View>
        {!ended ? <Button label="Pause" variant="secondary" onPress={pause} /> : null}
      </View>

      <Card muted style={styles.objective}>
        <AppText variant="label" color={accent}>
          Objective
        </AppText>
        <AppText variant="bodyStrong">Connect matching endpoints and fill every square.</AppText>
        <AppText variant="caption" tone="muted">
          Drag from an endpoint to its match. Crossing a path cuts it. Endpoint marks help distinguish similar colors.
        </AppText>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Paths" value={`${connected}/${state.pairs.length}`} />
        <StatTile label="Filled" value={`${filled}/${total}`} />
        <StatTile label="Open" value={String(remaining)} />
      </View>

      <View style={[styles.metaPill, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
        <AppText variant="caption" tone="muted">
          Grid {state.size}x{state.size} · {state.pairs.length} color pairs
        </AppText>
      </View>

      <FlowBoard state={state} disabled={ended || phase === 'paused'} onBegin={begin} onMove={move} onEnd={end} />

      <View style={styles.footerRow}>
        <Button label="Restart" variant="secondary" onPress={restart} disabled={ended} />
        <Button label="Exit" variant="ghost" onPress={requestExit} />
      </View>

      {ended ? (
        <FlowResult
          level={level}
          score={summary?.score ?? 0}
          xp={xpEarned}
          moves={summary?.moves ?? 0}
          durationMs={summary?.durationMs ?? 0}
          accent={accent}
          onNext={onAgain}
          onReplay={restart}
          onHome={() => router.replace('/game/colorFlow')}
        />
      ) : null}

      <AppDialog
        visible={phase === 'paused' && !exitOpen}
        title="Paused"
        message="Take a break. Your current paths will be here when you return."
        onClose={resume}
        actions={[
          { label: 'Resume', onPress: resume },
          { label: 'Restart puzzle', variant: 'secondary', onPress: () => { setExitOpen(false); restart(); } },
          { label: 'Exit to lobby', variant: 'ghost', onPress: confirmExit },
        ]}
      />

      <AppDialog
        visible={exitOpen}
        title="Leave this puzzle?"
        message="Your current puzzle progress will be lost, but your saved level and XP stay safe."
        onClose={closeExit}
        actions={[
          { label: 'Keep playing', onPress: closeExit },
          { label: 'Leave puzzle', variant: 'secondary', onPress: confirmExit },
        ]}
      />
    </Screen>
  );
}

export default function ColorFlowPlayScreen() {
  const progress = loadProgress('colorFlow');
  const [level, setLevel] = useState(progress.level);
  return <ColorFlowGame key={level} level={level} tier={progress.tier} onAgain={() => setLevel(loadProgress('colorFlow').level)} />;
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: spacing.xs },
  objective: { gap: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.sm },
  metaPill: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  footerRow: { flexDirection: 'row', gap: spacing.sm },
  messageCard: { gap: spacing.md },
});
