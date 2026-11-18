import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Board } from '@/components/numberMerge/Board';
import { ResultPanel } from '@/components/numberMerge/ResultPanel';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatTile } from '@/components/ui/StatTile';
import { useProfile } from '@/features/profile/ProfileProvider';
import { loadProgress, recordResult } from '@/features/progress/progressStore';
import { getGame } from '@/games/registry';
import { canMove } from '@/games/numberMerge/logic';
import { useNumberMergeGame } from '@/games/numberMerge/useNumberMergeGame';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const accent = getGame('numberMerge')?.accent ?? '#FF8A3D';

function NumberMergeGame({ level, tier, onAgain }: { level: number; tier: number; onAgain: () => void }) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { addXp } = useProfile();
  const [xp, setXp] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);

  const { phase, generated, board, swipe } = useNumberMergeGame({
    level,
    tier,
    onFinish: (result) => {
      const out = recordResult(result);
      addXp(out.xpEarned);
      setXp(out.xpEarned);
      setSaveFailed(!out.saved);
    },
  });

  const movesLeft = generated && board ? Math.max(0, generated.config.maxMoves - board.moves) : null;
  const finished = phase === 'won' || phase === 'lost';
  const lossReason = board && !canMove(board) ? 'The board is full.' : 'You used all your moves.';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}>
      <ScreenHeader title={`Number Merge · Level ${level}`} />

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

      {generated && board ? (
        <>
          <View style={styles.stats}>
            <StatTile label="Score" value={String(board.score)} />
            <StatTile label="Moves left" value={String(movesLeft)} />
            <StatTile label="Target" value={String(generated.config.target)} />
          </View>

          <Board board={board} onSwipe={swipe} />

          {finished ? (
            <>
              <ResultPanel
                won={phase === 'won'}
                level={level}
                score={board.score}
                xp={xp}
                lossReason={lossReason}
                accent={accent}
                onAgain={onAgain}
                onHome={() => router.back()}
              />
              {saveFailed ? <AppText tone="danger">Could not save progress on this device.</AppText> : null}
            </>
          ) : (
            <>
              <AppText variant="label" tone="muted" style={styles.hint}>
                Swipe to slide tiles. Merge equal numbers to reach {generated.config.target}.
              </AppText>
              <Button label="Restart level" variant="secondary" onPress={onAgain} />
            </>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

export default function NumberMergeScreen() {
  const [session, setSession] = useState(() => {
    const p = loadProgress('numberMerge');
    return { level: p.level, tier: p.tier, run: 0 };
  });

  const again = () => {
    const p = loadProgress('numberMerge');
    setSession((s) => ({ level: p.level, tier: p.tier, run: s.run + 1 }));
  };

  return <NumberMergeGame key={session.run} level={session.level} tier={session.tier} onAgain={again} />;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  stats: { flexDirection: 'row', gap: spacing.md },
  hint: { textAlign: 'center' },
});
