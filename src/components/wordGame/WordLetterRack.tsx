import { StyleSheet, View } from 'react-native';
import { radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

type Props = {
  letters: string;
  input: string;
  disabled: boolean;
  onPressLetter: (index: number, ch: string) => void;
};

export function WordLetterRack({ letters, input, disabled, onPressLetter }: Props) {
  const { palette } = useTheme();
  const usedIndices = new Set<number>();
  for (const ch of input) {
    const idx = letters.split('').findIndex((c, i) => c === ch && !usedIndices.has(i));
    if (idx >= 0) usedIndices.add(idx);
  }

  return (
    <View style={styles.rack}>
      {letters.split('').map((ch, i) => {
        const used = usedIndices.has(i);
        return (
          <PressableScale
            key={`${ch}-${i}`}
            accessibilityRole="button"
            accessibilityLabel={`Letter ${ch.toUpperCase()}${used ? ', used' : ''}`}
            accessibilityState={{ disabled: disabled || used }}
            disabled={disabled || used}
            onPress={() => onPressLetter(i, ch)}
            style={[styles.tile, { backgroundColor: used ? palette.surfaceAlt : palette.surface, borderColor: used ? palette.border : palette.borderStrong, opacity: used ? 0.45 : 1 }]}>
            <AppText variant="heading" style={styles.letter}>{ch.toUpperCase()}</AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rack: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  tile: { width: 52, height: 58, borderRadius: radius.md, borderWidth: stroke.strong, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 24, lineHeight: 30 },
});
