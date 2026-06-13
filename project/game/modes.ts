export type GameMode = 'classic' | 'risk' | 'daily';

export interface ModeConfig {
  id: GameMode;
  name: string;
  description: string;
  totalLevels: number;
  getAttempts: (level: number) => number;
  getScoreMultiplier: () => number;
  getCoinMultiplier: () => number;
  warning?: string;
}

export const GAME_MODES: Record<GameMode, ModeConfig> = {
  classic: {
    id: 'classic',
    name: 'Klasik Mod',
    description: '100 bölüm. Her bölümde N-1 hak.',
    totalLevels: 100,
    getAttempts: (level: number) => level === 1 ? 1 : level - 1,
    getScoreMultiplier: () => 1,
    getCoinMultiplier: () => 1,
  },
  risk: {
    id: 'risk',
    name: 'Risk Modu',
    description: 'Her bölümde tek hak. Puanlar 3 kat.',
    totalLevels: 100,
    getAttempts: () => 1,
    getScoreMultiplier: () => 3,
    getCoinMultiplier: () => 2,
    warning: 'Risk Modu: Her bölümde tek hakkın var. Puanlar 3 kat.',
  },
  daily: {
    id: 'daily',
    name: 'Günlük Meydan Okuma',
    description: '20 bölüm. Herkes için aynı sıralama.',
    totalLevels: 20,
    getAttempts: (level: number) => level === 1 ? 1 : level - 1,
    getScoreMultiplier: () => 1,
    getCoinMultiplier: () => 1,
  },
};

export function getModeConfig(mode: GameMode): ModeConfig {
  return GAME_MODES[mode];
}

export function getModeDisplayName(mode: GameMode): string {
  return GAME_MODES[mode].name;
}
