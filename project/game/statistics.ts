export interface GameStatistics {
  totalGamesPlayed: number;
  totalTaps: number;
  totalCorrectTaps: number;
  totalWrongTaps: number;
  classicHighestLevel: number;
  riskHighestLevel: number;
  classicBestScore: number;
  riskBestScore: number;
  dailyBestScore: number;
  dailyChallengesCompleted: number;
  dailyChallengesPlayed: number;
  reachedLevel10: number;
  reachedLevel50: number;
  completedLevel100: number;
  classicCompleted: boolean;
  riskCompleted: boolean;
}

export const DEFAULT_STATISTICS: GameStatistics = {
  totalGamesPlayed: 0,
  totalTaps: 0,
  totalCorrectTaps: 0,
  totalWrongTaps: 0,
  classicHighestLevel: 0,
  riskHighestLevel: 0,
  classicBestScore: 0,
  riskBestScore: 0,
  dailyBestScore: 0,
  dailyChallengesCompleted: 0,
  dailyChallengesPlayed: 0,
  reachedLevel10: 0,
  reachedLevel50: 0,
  completedLevel100: 0,
  classicCompleted: false,
  riskCompleted: false,
};

export function createEmptyStatistics(): GameStatistics {
  return { ...DEFAULT_STATISTICS };
}
