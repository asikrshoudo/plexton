import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WordLetterRack } from '@/components/wordGame/WordLetterRack';
import { WordResult } from '@/components/wordGame/WordResult';
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
import { useWordGame } from '@/games/wordGame/useWordGame';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const accent = getGame('wordGame')?.accent ?? '#5A6DA8';

function WordGameScreen({ level, tier, onAgain }: { level: number; tier: number; onAgain: () => void }) {
  const { palette } = useTheme();
  const { addXp } = useProfile();
  const [xpEarned, setXpEarned] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);

  const { phase, generated, state, displayLetters, feedback, inputLetter, backspace, clear, submit, shuffle, pause, resume, restart, endRun } = useWordGame({
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
      <Screen title="Word Game" subtitle={`Level ${level}`} scroll={false}>
        <LoadingState label="Preparing your letters" />
      </Screen>
    );
  }

  if (phase === 'error') {
    return (
      <Screen title="Word Game" subtitle={`Level ${level}`}>
        <Card style={styles.messageCard}>
          <AppText variant="heading">Could not prepare this level</AppText>
          <AppText tone="muted">Please return to the lobby and try again.</AppText>
          <Button label="Back to lobby" onPress={() => router.replace('/game/wordGame')} />
        </Card>
      </Screen>
    );
  }

  const ended = phase === 'won' || phase === 'lost';
  const canPause = phase === 'playing';

  const requestExit = () => { if (canPause) pause(); setExitOpen(true); };
  const closeExit = () => { setExitOpen(false); if (phase === 'paused') resume(); };
  const confirmExit = () => { setExitOpen(false); router.replace('/game/wordGame'); };

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Word Game</AppText>
          <AppText variant="label" tone="muted">Level {level} • Target {state.config.targetScore} pts</AppText>
        </View>
        {canPause ? <Button label="Pause" variant="secondary" onPress={pause} /> : null}
      </View>

      <Card muted style={styles.objective}>
        <AppText variant="label" color={accent}>Objective</AppText>
        <AppText variant="bodyStrong">Form valid words from the letters to reach the target score.</AppText>
        <AppText variant="caption" tone="muted">Words must be {state.config.minWordLength}+ letters. Duplicates and invalid words don&apos;t count. Word Game uses no hearts.</AppText>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Score" value={`${state.score}/${state.config.targetScore}`} />
        <StatTile label="Found" value={`${state.found.length}/${state.config.targetWords.length}`} />
        <StatTile label="Input" value={state.currentInput.toUpperCase() || '—'} />
      </View>

      <Card style={styles.inputCard}>
        <AppText variant="caption" tone="muted" accessibilityLiveRegion="polite">
          {feedback ? feedback.text : state.currentInput ? 'Tap Submit when ready' : 'Tap letters to build a word'}
        </AppText>
        <View style={[styles.currentWord, { borderColor: feedback?.kind === 'bad' ? palette.danger : feedback?.kind === 'dup' ? palette.warning : feedback?.kind === 'ok' ? palette.success : palette.border }]}>
          <AppText variant="heading" style={styles.currentWordText}>{state.currentInput.toUpperCase() || ' '}</AppText>
        </View>
        <WordLetterRack letters={displayLetters} input={state.currentInput} disabled={ended || phase === 'paused'} onPressLetter={(_, ch) => inputLetter(ch)} />
        <View style={styles.actionRow}>
          <Button label="Back" variant="secondary" onPress={backspace} disabled={ended || !state.currentInput} />
          <Button label="Shuffle" variant="secondary" onPress={shuffle} disabled={ended} />
          <Button label="Clear" variant="secondary" onPress={clear} disabled={ended || !state.currentInput} />
        </View>
        <Button label="Submit word" onPress={submit} disabled={ended || state.currentInput.length < state.config.minWordLength} />
      </Card>

      <Card muted style={styles.foundCard}>
        <AppText variant="label" color={accent}>Found words</AppText>
        <AppText variant="body" tone="muted">{state.found.length ? state.found.map((w) => w.toUpperCase()).join('  •  ') : 'No words found yet.'}</AppText>
      </Card>

      <View style={styles.footerRow}>
        <Button label="Restart" variant="secondary" onPress={restart} disabled={ended} />
        <Button label="End run" variant="ghost" onPress={() => { endRun(); }} disabled={ended} />
        <Button label="Exit" variant="ghost" onPress={requestExit} />
      </View>

      {ended ? (
        <WordResult
          won={phase === 'won'}
          level={level}
          score={state.score}
          xp={xpEarned}
          found={state.found.length}
          targetWords={state.config.targetWords.length}
          targetScore={state.config.targetScore}
          accent={accent}
          onAgain={onAgain}
          onHome={() => router.replace('/game/wordGame')}
        />
      ) : null}

      <AppDialog
        visible={phase === 'paused' && !exitOpen}
        title="Paused"
        message="Take a break. Your found words and score are safe while paused."
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

export default function WordGamePlayScreen() {
  const progress = loadProgress('wordGame');
  const [level, setLevel] = useState(progress.level);
  return <WordGameScreen key={level} level={level} tier={progress.tier} onAgain={() => setLevel(loadProgress('wordGame').level)} />;
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: spacing.xs },
  objective: { gap: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.sm },
  inputCard: { gap: spacing.md, alignItems: 'stretch' },
  currentWord: { minHeight: 52, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  currentWordText: { letterSpacing: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', flexWrap: 'wrap' },
  foundCard: { gap: spacing.sm },
  footerRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  messageCard: { gap: spacing.md },
});


