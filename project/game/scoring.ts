export function getStreakMultiplier(streak: number): number {
  if (streak >= 50) return 2.0;
  if (streak >= 20) return 1.5;
  if (streak >= 10) return 1.25;
  if (streak >= 5) return 1.1;
  return 1.0;
}

export function calculateScore(
  level: number,
  remainingAttempts: number,
  streak: number,
  modeMultiplier: number = 1
): number {
  const basePoints = level * 10;
  const attemptBonus = remainingAttempts * 5;
  const streakMultiplier = getStreakMultiplier(streak);
  const total = Math.floor((basePoints + attemptBonus) * streakMultiplier * modeMultiplier);
  return total;
}

export function calculateCoins(
  level: number,
  coinMultiplier: number = 1,
  isVictory: boolean = false
): number {
  const baseCoins = Math.max(1, Math.floor(level / 5));
  const bonus = isVictory ? 100 : 0;
  return Math.floor((baseCoins + bonus) * coinMultiplier);
}

export function formatScore(score: number): string {
  return score.toLocaleString('tr-TR');
}

export function formatCoins(coins: number): string {
  return coins.toLocaleString('tr-TR');
}
