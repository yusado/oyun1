import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStatistics, DEFAULT_STATISTICS } from '@/game/statistics';
import { getDateKey } from '@/game/dailyChallenge';

const KEYS = {
  SOUND_ENABLED: 'sound_enabled',
  COINS: 'coins',
  OWNED_COSMETICS: 'owned_cosmetics',
  SELECTED_COSMETIC: 'selected_cosmetic',
  ACHIEVEMENTS: 'achievements',
  STATISTICS: 'statistics',
  DAILY_BEST_SCORE: 'daily_best_score',
  DAILY_COMPLETED: 'daily_completed',
};

export const storage = {
  // Sound
  async isSoundEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.SOUND_ENABLED);
      return value === null ? true : value === 'true';
    } catch {
      return true;
    }
  },

  async setSoundEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SOUND_ENABLED, enabled.toString());
    } catch (e) {
      console.error('Failed to save sound setting:', e);
    }
  },

  // Coins
  async getCoins(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(KEYS.COINS);
      return value ? parseInt(value, 10) : 0;
    } catch {
      return 0;
    }
  },

  async setCoins(coins: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.COINS, coins.toString());
    } catch (e) {
      console.error('Failed to save coins:', e);
    }
  },

  async addCoins(amount: number): Promise<number> {
    const current = await this.getCoins();
    const newTotal = current + amount;
    await this.setCoins(newTotal);
    return newTotal;
  },

  // Cosmetics
  async getOwnedCosmetics(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.OWNED_COSMETICS);
      return value ? JSON.parse(value) : ['default'];
    } catch {
      return ['default'];
    }
  },

  async setOwnedCosmetics(cosmetics: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.OWNED_COSMETICS, JSON.stringify(cosmetics));
    } catch (e) {
      console.error('Failed to save cosmetics:', e);
    }
  },

  async addOwnedCosmetic(cosmeticId: string): Promise<void> {
    const owned = await this.getOwnedCosmetics();
    if (!owned.includes(cosmeticId)) {
      owned.push(cosmeticId);
      await this.setOwnedCosmetics(owned);
    }
  },

  async getSelectedCosmetic(): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(KEYS.SELECTED_COSMETIC);
      return value || 'default';
    } catch {
      return 'default';
    }
  },

  async setSelectedCosmetic(cosmeticId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SELECTED_COSMETIC, cosmeticId);
    } catch (e) {
      console.error('Failed to save selected cosmetic:', e);
    }
  },

  // Achievements
  async getUnlockedAchievements(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  },

  async setUnlockedAchievements(achievements: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements:', e);
    }
  },

  async unlockAchievement(achievementId: string): Promise<boolean> {
    const unlocked = await this.getUnlockedAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      await this.setUnlockedAchievements(unlocked);
      return true;
    }
    return false;
  },

  async isAchievementUnlocked(achievementId: string): Promise<boolean> {
    const unlocked = await this.getUnlockedAchievements();
    return unlocked.includes(achievementId);
  },

  // Statistics
  async getStatistics(): Promise<GameStatistics> {
    try {
      const value = await AsyncStorage.getItem(KEYS.STATISTICS);
      return value ? { ...DEFAULT_STATISTICS, ...JSON.parse(value) } : { ...DEFAULT_STATISTICS };
    } catch {
      return { ...DEFAULT_STATISTICS };
    }
  },

  async setStatistics(stats: GameStatistics): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.STATISTICS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save statistics:', e);
    }
  },

  async updateStatistics(updates: Partial<GameStatistics>): Promise<GameStatistics> {
    const stats = await this.getStatistics();
    const newStats = { ...stats, ...updates };
    await this.setStatistics(newStats);
    return newStats;
  },

  // Daily Challenge
  async getDailyBestScore(dateKey?: string): Promise<number> {
    try {
      const key = `daily_best_${dateKey || getDateKey()}`;
      const value = await AsyncStorage.getItem(key);
      return value ? parseInt(value, 10) : 0;
    } catch {
      return 0;
    }
  },

  async setDailyBestScore(score: number, dateKey?: string): Promise<void> {
    try {
      const key = `daily_best_${dateKey || getDateKey()}`;
      await AsyncStorage.setItem(key, score.toString());
    } catch (e) {
      console.error('Failed to save daily best score:', e);
    }
  },

  async isDailyCompleted(dateKey?: string): Promise<boolean> {
    try {
      const key = `daily_completed_${dateKey || getDateKey()}`;
      const value = await AsyncStorage.getItem(key);
      return value === 'true';
    } catch {
      return false;
    }
  },

  async setDailyCompleted(completed: boolean, dateKey?: string): Promise<void> {
    try {
      const key = `daily_completed_${dateKey || getDateKey()}`;
      await AsyncStorage.setItem(key, completed.toString());
    } catch (e) {
      console.error('Failed to save daily completion:', e);
    }
  },
};
