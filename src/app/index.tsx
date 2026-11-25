import { StyleSheet, View } from 'react-native';
import { DailyCard } from '@/components/home/DailyCard';
import { GameCard } from '@/components/home/GameCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PlayerCard } from '@/components/home/PlayerCard';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { GAMES } from '@/games/registry';
import { spacing } from '@/theme/tokens';

const RELEASE_GAMES = GAMES.filter((game) => game.id === 'numberMerge' || game.id === 'colorFlow');

export default function HomeScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <HomeHeader />
      <PlayerCard />
      <DailyCard />
      <SectionLabel>Games</SectionLabel>
      <View style={styles.grid}>
        {RELEASE_GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
