import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MemoryBoard } from '@/components/memoryFlash/MemoryBoard';
import { MemoryResult } from '@/components/memoryFlash/MemoryResult';
import { AppDialog } from '@/components/ui/AppDialog';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { StatTile } from '@/components/ui/StatTile';
import { useProfile } from '@/features/profile/ProfileProvider';
import { loadProgress, recordResult } from '@/features/progress/progressStore';
import { getGame } from '@/games/registry';
import { useMemoryFlashGame } from '@/games/memoryFlash/useMemoryFlashGame';
import { spacing } from '@/theme/tokens';

const accent = getGame('memoryFlash')?.accent ?? '#B4556C';

function phaseLabel(phase: string): string {
  if (phase === 'showing') return 'Watch the sequence';
  if (phase === 'input') return 'Your turn';
  if (phase === 'roundWon') return 'Round complete';
  if (phase === 'paused') return 'Paused';
  if (phase === 'won') return 'Level cleared';
  if (phase === 'lost') return 'Run over';
  return 'Loading';
}

function MemoryFlashGame({ level, tier, onAgain }: { level: number; tier: number; onAgain: () => void }) {
  const { addXp } = useProfile();
  const [xpEarned, setXpEarned] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [wrongCell, setWrongCell] = useState<number | null>(null);

  const { phase, generated, state, activeCell, input, pause, resume, restart } = useMemoryFlashGame({
    level,
    tier,
    onFinish: (result) => {
      const { xpEarned: xp } = recordResult(result);
      if (xp > 0) addXp(xp);
      setXpEarned(xp);
    },
  });

  if (phase === 'loading' || !state || !generated) {
    return (
      <Screen title="Memory Flash" subtitle={`Level ${level}`} scroll={false}>
        <LoadingState label="Preparing your sequence" />
      </Screen>
    );
  }

  if (phase === 'error') {
    return (
      <Screen title="Memory Flash" subtitle={`Level ${level}`}>
        <Card style={styles.messageCard}>
          <AppText variant="heading">Could not prepare this level</AppText>
          <AppText tone="muted">Please return to the lobby and try again.</AppText>
          <Button label="Back to lobby" onPress={() => router.replace('/game/memoryFlash')} />
        </Card>
      </Screen>
    );
  }

  const ended = phase === 'won' || phase === 'lost';
  const canPause = phase === 'showing' || phase === 'input' || phase === 'roundWon';
  const inputLocked = phase !== 'input';

  const requestExit = () => { if (canPause) pause(); setExitOpen(true); };
  const closeExit = () => { setExitOpen(false); if (phase === 'paused') resume(); };
  const confirmExit = () => { setExitOpen(false); router.replace('/game/memoryFlash'); };

  const onCellPress = (cell: number) => {
    if (phase !== 'input') return;
    const expected = state.sequence[state.input.length];
    if (cell !== expected) {
      setWrongCell(cell);
      setTimeout(() => setWrongCell(null), 350);
    }
    input(cell);
  };

  const sequenceLen = state.sequence.length;

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Memory Flash</AppText>
          <AppText variant="label" tone="muted">Level {level} • Round {Math.min(state.round + 1, state.config.targetRounds)}/{state.config.targetRounds}</AppText>
        </View>
        {canPause ? <Button label="Pause" variant="secondary" onPress={pause} /> : null}
      </View>

      <Card muted style={styles.objective}>
        <AppText variant="label" color={accent}>Objective</AppText>
        <AppText variant="bodyStrong">Watch the sequence, then repeat it in the same order.</AppText>
        <AppText variant="caption" tone="muted">{phaseLabel(phase)}{phase === 'input' ? ` • ${state.input.length}/${sequenceLen} selected` : ''}. Memory Flash uses no hearts and is always playable.</AppText>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Score" value={String(state.score)} />
        <StatTile label="Sequence" value={String(sequenceLen)} />
        <StatTile label="Cleared" value={`${state.roundsCleared}/${state.config.targetRounds}`} />
      </View>

      <MemoryBoard
        gridSize={state.config.gridSize}
        sequence={state.sequence}
        input={state.input}
        activeCell={activeCell}
        disabled={inputLocked || ended}
        wrongCell={wrongCell}
        onCellPress={onCellPress}
      />

      <View style={styles.footerRow}>
        <Button label="Restart" variant="secondary" onPress={() => { setWrongCell(null); restart(); }} disabled={ended} />
        <Button label="Exit" variant="ghost" onPress={requestExit} />
      </View>

      {ended ? (
        <MemoryResult
          won={phase === 'won'}
          level={level}
          score={state.score}
          xp={xpEarned}
          roundsCleared={state.roundsCleared}
          targetRounds={state.config.targetRounds}
          accent={accent}
          onAgain={onAgain}
          onHome={() => router.replace('/game/memoryFlash')}
        />
      ) : null}

      <AppDialog
        visible={phase === 'paused' && !exitOpen}
        title="Paused"
        message="Take a break. When you resume, the current sequence will replay so you can continue fairly."
        onClose={resume}
        actions={[
          { label: 'Resume', onPress: resume },
          { label: 'Restart level', variant: 'secondary', onPress: () => { setExitOpen(false); setWrongCell(null); restart(); } },
          { label: 'Exit to lobby', variant: 'ghost', onPress: confirmExit },
        ]}
      />

      <AppDialog
        visible={exitOpen}
        title="Leave this level?"
        message="Your current run progress will be lost, but your saved level and XP stay safe."
        onClose={closeExit}
        actions={[
          { label: 'Keep playing', onPress: closeExit },
          { label: 'Leave level', variant: 'secondary', onPress: confirmExit },
        ]}
      />
    </Screen>
  );
}

export default function MemoryFlashPlayScreen() {
  const progress = loadProgress('memoryFlash');
  const [level, setLevel] = useState(progress.level);
  return <MemoryFlashGame key={level} level={level} tier={progress.tier} onAgain={() => setLevel(loadProgress('memoryFlash').level)} />;
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: spacing.xs },
  objective: { gap: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.sm },
  footerRow: { flexDirection: 'row', gap: spacing.sm },
  messageCard: { gap: spacing.md },
});
