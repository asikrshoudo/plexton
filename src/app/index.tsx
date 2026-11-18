import { StyleSheet, View } from 'react-native';
import { DailyCard } from '@/components/home/DailyCard';
import { GameCard } from '@/components/home/GameCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PlayerCard } from '@/components/home/PlayerCard';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { GAMES } from '@/games/registry';
import { spacing } from '@/theme/tokens';

export default function HomeScreen() {
  return (
    <Screen>
      <HomeHeader />
      <PlayerCard />
      <DailyCard />
      <SectionLabel>Games</SectionLabel>
      <View style={styles.grid}>
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
