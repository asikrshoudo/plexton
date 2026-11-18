import type { GameId } from './registry';

// Games listed here are playable; others show "coming soon" in their lobby.
export const PLAY_ROUTES: Partial<Record<GameId, string>> = {
  numberMerge: '/play/numberMerge',
};
