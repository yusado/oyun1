export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  classicHighestLevel: number;
  riskHighestLevel: number;
  dailyChallengesCompleted: number;
  dailyChallengesPlayed: number;
  totalWrongTaps: number;
  totalTaps: number;
  classicCompleted: boolean;
  riskCompleted: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: 'İlk Adım',
    description: '1. bölümü tamamla.',
    condition: (stats) => stats.classicHighestLevel >= 1 || stats.riskHighestLevel >= 1,
  },
  {
    id: 'warming_up',
    name: 'Şans Isınıyor',
    description: '10. bölüme ulaş.',
    condition: (stats) => stats.classicHighestLevel >= 10,
  },
  {
    id: 'quarter_way',
    name: 'Yolun Yarısı Değil Ama Güzel',
    description: '25. bölüme ulaş.',
    condition: (stats) => stats.classicHighestLevel >= 25,
  },
  {
    id: 'serious_business',
    name: 'Ciddi Ciddi Gidiyorsun',
    description: '50. bölüme ulaş.',
    condition: (stats) => stats.classicHighestLevel >= 50,
  },
  {
    id: 'legendary_luck',
    name: 'Efsane Şans',
    description: '75. bölüme ulaş.',
    condition: (stats) => stats.classicHighestLevel >= 75,
  },
  {
    id: 'conqueror_100',
    name: '100. Bölüm Fatihi',
    description: '100. bölümü tamamla.',
    condition: (stats) => stats.classicCompleted,
  },
  {
    id: 'risk_lover',
    name: 'Risk Seven',
    description: 'Risk modunda 10. bölüme ulaş.',
    condition: (stats) => stats.riskHighestLevel >= 10,
  },
  {
    id: 'one_chance_master',
    name: 'Tek Hak Ustası',
    description: 'Risk modunda 25. bölümü tamamla.',
    condition: (stats) => stats.riskHighestLevel >= 25,
  },
  {
    id: 'daily_player',
    name: 'Günlük Oyuncu',
    description: 'Günlük meydan okumayı bir kez oyna.',
    condition: (stats) => stats.dailyChallengesPlayed >= 1,
  },
  {
    id: 'disciplined_luck',
    name: 'Disiplinli Şans',
    description: '7 günlük meydan okuma tamamla.',
    condition: (stats) => stats.dailyChallengesCompleted >= 7,
  },
  {
    id: 'no_fear_wrong',
    name: 'Yanlışlardan Korkmam',
    description: 'Toplam 100 yanlış tap yap.',
    condition: (stats) => stats.totalWrongTaps >= 100,
  },
  {
    id: 'square_hunter',
    name: 'Kare Avcısı',
    description: 'Toplam 1000 tap yap.',
    condition: (stats) => stats.totalTaps >= 1000,
  },
];

export function checkAchievements(
  unlockedIds: string[],
  stats: AchievementStats
): string[] {
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
