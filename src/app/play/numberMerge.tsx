import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Board } from '@/components/numberMerge/Board';
import { ResultPanel } from '@/components/numberMerge/ResultPanel';
import { TileFace } from '@/components/numberMerge/TileView';
import { AppDialog } from '@/components/ui/AppDialog';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HeartStatus } from '@/components/ui/HeartStatus';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { StatTile } from '@/components/ui/StatTile';
import { useHearts } from '@/features/hearts/HeartsProvider';
import { useProfile } from '@/features/profile/ProfileProvider';
import { loadProgress, recordResult } from '@/features/progress/progressStore';
import { getGame } from '@/games/registry';
import { canMerge, maxTile, spawnValue } from '@/games/numberMerge/logic';
import { useNumberMergeGame } from '@/games/numberMerge/useNumberMergeGame';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const accent = getGame('numberMerge')?.accent ?? '#C96F3C';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function newAttemptId(): string {
  return `nm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

type Props = {
  level: number;
  tier: number;
  attemptId: string;
  onAgain: () => void;
  onBlocked: () => void;
};

function NumberMergeGame({ level, tier, attemptId, onAgain, onBlocked }: Props) {
  const { palette } = useTheme();
  const { addXp } = useProfile();
  const { hearts, maxHearts, msToNextHeart, consumeNumberMergeLoss, refresh } = useHearts();
  const [xpEarned, setXpEarned] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [heartConsumed, setHeartConsumed] = useState(false);
  const consumedRef = useRef(false);

  const { phase, board, generated, drop, pause, resume, restart } = useNumberMergeGame({
    level,
    tier,
    onFinish: (result) => {
      if (!result.won && !consumedRef.current) {
        const consumed = consumeNumberMergeLoss(attemptId);
        consumedRef.current = consumedRef.current || consumed;
        setHeartConsumed(consumedRef.current);
      }
      const { xpEarned: xp } = recordResult(result);
      if (xp > 0) addXp(xp);
      setXpEarned(xp);
    },
  });

  useEffect(() => {
    refresh();
  }, [refresh, phase]);

  if (phase === 'loading' || !board || !generated) {
    return (
      <Screen title="Number Merge" subtitle={`Level ${level}`} scroll={false}>
        <LoadingState label="Preparing your board" />
      </Screen>
    );
  }

  if (phase === 'error') {
    return (
      <Screen title="Number Merge" subtitle={`Level ${level}`}>
        <Card style={styles.messageCard}>
          <AppText variant="heading">Could not prepare this level</AppText>
          <AppText tone="muted">Please return to the lobby and try again.</AppText>
          <Button label="Back to lobby" onPress={() => router.replace('/game/numberMerge')} />
        </Card>
      </Screen>
    );
  }

  const movesLeft = Math.max(0, generated.config.maxMoves - board.moves);
  const next = spawnValue(generated.config.seed, board.nextId, generated.config.pool);
  const highest = maxTile(board);
  const hasMoves = canMerge(board);
  const ended = phase === 'won' || phase === 'lost';
  const lossReason = !hasMoves ? 'No more merges available.' : 'Out of moves.';
  const canRetry = hearts > 0;

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
    router.replace('/game/numberMerge');
  };

  const handleAgain = () => {
    if (!canRetry) {
      onBlocked();
      return;
    }
    onAgain();
  };

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Number Merge</AppText>
          <AppText variant="label" tone="muted">
            Level {level} � Build {generated.config.target}
          </AppText>
        </View>
        {!ended ? <Button label="Pause" variant="secondary" onPress={pause} /> : null}
      </View>

      <HeartStatus />

      <Card muted style={styles.objective}>
        <AppText variant="label" color={accent}>
          Objective
        </AppText>
        <AppText variant="bodyStrong">Merge equal tiles to reach {generated.config.target}.</AppText>
        <AppText variant="caption" tone="muted">
          Drag onto an equal tile to merge, or onto an empty space to move. Losing an attempt uses 1 heart.
        </AppText>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Score" value={String(board.score)} />
        <StatTile label="Moves left" value={String(movesLeft)} />
        <StatTile label="Target" value={String(generated.config.target)} />
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaPill, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          <AppText variant="caption" tone="muted">
            Highest
          </AppText>
          <AppText variant="bodyStrong">{highest}</AppText>
        </View>
        <View
          style={[styles.metaPill, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}
          accessibilityLabel={`Next tile ${next}`}>
          <AppText variant="caption" tone="muted">
            Next tile
          </AppText>
          <TileFace value={next} cell={36} />
        </View>
      </View>

      <Board board={board} disabled={ended || phase === 'paused'} onDrop={drop} />

      <View style={styles.footerRow}>
        <Button label="Restart" variant="secondary" onPress={restart} disabled={ended} />
        <Button label="Exit" variant="ghost" onPress={requestExit} />
      </View>

      {ended ? (
        <ResultPanel
          won={phase === 'won'}
          level={level}
          score={board.score}
          xp={xpEarned}
          moves={board.moves}
          moveLimit={generated.config.maxMoves}
          target={generated.config.target}
          highest={highest}
          lossReason={lossReason}
          accent={accent}
          onAgain={handleAgain}
          onHome={() => router.replace('/game/numberMerge')}
          heartConsumed={heartConsumed}
          hearts={hearts}
          maxHearts={maxHearts}
          nextHeartMs={msToNextHeart}
        />
      ) : null}

      <AppDialog
        visible={phase === 'paused' && !exitOpen}
        title="Paused"
        message="Take a breath. Your board is waiting exactly as you left it. Pausing does not use a heart."
        onClose={resume}
        actions={[
          { label: 'Resume', onPress: resume },
          { label: 'Restart level', variant: 'secondary', onPress: () => { setExitOpen(false); restart(); } },
          { label: 'Exit to lobby', variant: 'ghost', onPress: confirmExit },
        ]}
      />

      <AppDialog
        visible={exitOpen}
        title="Leave this level?"
        message="Your current round progress will be lost, but no heart is used for leaving. Your saved level and XP stay safe."
        onClose={closeExit}
        actions={[
          { label: 'Keep playing', onPress: closeExit },
          { label: 'Leave level', variant: 'secondary', onPress: confirmExit },
        ]}
      />

      <AppDialog
        visible={ended && phase === 'lost' && !canRetry}
        title="No hearts left"
        message={`You used a heart on this attempt. You can try Number Merge again in ${formatCountdown(msToNextHeart)} when the next heart recovers.`}
        onClose={() => {}}
        actions={[{ label: 'Back to lobby', onPress: () => router.replace('/game/numberMerge') }]}
      />
    </Screen>
  );
}

export default function NumberMergePlayScreen() {
  const { canStartNumberMerge, hearts, maxHearts, msToNextHeart } = useHearts();
  const progress = loadProgress('numberMerge');
  const [level, setLevel] = useState(progress.level);
  const [attemptId, setAttemptId] = useState(() => newAttemptId());
  const [blocked, setBlocked] = useState(() => !canStartNumberMerge);

  const onAgain = useCallback(() => {
    const latest = loadProgress('numberMerge');
    setLevel(latest.level);
    setAttemptId(newAttemptId());
    setBlocked(false);
  }, []);

  if (blocked || !canStartNumberMerge) {
    return (
      <Screen title="Number Merge" subtitle={`Level ${level}`}>
        <HeartStatus />
        <Card style={styles.messageCard}>
          <AppText variant="heading">No hearts available</AppText>
          <AppText tone="muted">
            You have {hearts}/{maxHearts} hearts. Number Merge needs 1 heart to start a new attempt. A heart is used only when an attempt is lost.
          </AppText>
          <AppText variant="label" color={accent}>
            Next heart in {formatCountdown(msToNextHeart)}
          </AppText>
          <Button label="Back to lobby" onPress={() => router.replace('/game/numberMerge')} />
        </Card>
      </Screen>
    );
  }

  return (
    <NumberMergeGame
      key={`${level}-${attemptId}`}
      level={level}
      tier={progress.tier}
      attemptId={attemptId}
      onAgain={onAgain}
      onBlocked={() => setBlocked(true)}
    />
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: spacing.xs },
  objective: { gap: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.sm },
  metaPill: {
    flex: 1,
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerRow: { flexDirection: 'row', gap: spacing.sm },
  messageCard: { gap: spacing.md },
});
