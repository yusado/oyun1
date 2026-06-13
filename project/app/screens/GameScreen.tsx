import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pause, Volume2, VolumeX, RefreshCw, Hop as Home, Play } from 'lucide-react-native';
import { SquareGrid } from '@/components/SquareGrid';
import { GamePopup } from '@/components/GamePopup';
import { AchievementToast } from '@/components/AchievementToast';
import { CoinDisplay } from '@/components/CoinDisplay';
import { generateLevel, generateCorrectSquareIndex, LevelConfig } from '@/game/levelGenerator';
import { calculateScore, calculateCoins, formatScore } from '@/game/scoring';
import { GameMode, getModeConfig } from '@/game/modes';
import { getDailyCorrectIndex, getDateKey } from '@/game/dailyChallenge';
import { getCosmeticById, BorderStyle } from '@/game/cosmetics';
import { storage } from '@/utils/storage';
import { soundManager } from '@/utils/sound';
import { triggerHaptic } from '@/utils/haptics';
import { checkAchievements } from '@/game/achievements';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type GamePhase = 'playing' | 'levelComplete' | 'gameOver' | 'victory' | 'paused';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: GameMode = (params.mode as GameMode) || 'classic';

  // Game state
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coinsEarnedThisRun, setCoinsEarnedThisRun] = useState(0);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(1);
  const [totalAttemptsForLevel, setTotalAttemptsForLevel] = useState(1);
  const [phase, setPhase] = useState<GamePhase>('playing');

  // Cosmetic
  const [selectedBorderStyle, setSelectedBorderStyle] = useState<BorderStyle>(
    getCosmeticById('default').borderStyle
  );

  // Popup state
  const [popupType, setPopupType] = useState<'levelComplete' | 'gameOver' | 'victory'>('levelComplete');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);
  const [popupCoins, setPopupCoins] = useState(0);
  const [popupTotalScore, setPopupTotalScore] = useState(0);
  const [popupStreak, setPopupStreak] = useState(0);

  // Persistent data
  const [bestScore, setBestScore] = useState(0);
  const [bestLevel, setBestLevel] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Achievement toast
  const [achievementToastVisible, setAchievementToastVisible] = useState(false);
  const [achievementToastId, setAchievementToastId] = useState('');

  // Refs
  const isProcessingRef = useRef(false);
  const levelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupClosedRef = useRef(false);
  const runCountedRef = useRef(false);
  const reached10CountedRef = useRef(false);
  const reached50CountedRef = useRef(false);
  const dailyPlayedCountedRef = useRef(false);

  const modeConfig = getModeConfig(mode);

  useEffect(() => {
    initGame();
    return () => {
      if (levelTimerRef.current) clearTimeout(levelTimerRef.current);
    };
  }, []);

  const initGame = async () => {
    const stats = await storage.getStatistics();
    const coinTotal = await storage.getCoins();
    const sound = await storage.isSoundEnabled();
    const selectedCosmeticId = await storage.getSelectedCosmetic();
    const cosmetic = getCosmeticById(selectedCosmeticId);

    if (mode === 'classic') {
      setBestScore(stats.classicBestScore);
      setBestLevel(stats.classicHighestLevel);
    } else if (mode === 'risk') {
      setBestScore(stats.riskBestScore);
      setBestLevel(stats.riskHighestLevel);
    } else if (mode === 'daily') {
      const dailyScore = await storage.getDailyBestScore();
      const dailyLevel = await storage.getDailyBestLevel();
      setBestScore(dailyScore);
      setBestLevel(dailyLevel);
    }

    setTotalCoins(coinTotal);
    soundManager.setEnabled(sound);
    setSoundEnabled(sound);
    setSelectedBorderStyle(cosmetic.borderStyle);
    runCountedRef.current = false;
    reached10CountedRef.current = false;
    reached50CountedRef.current = false;
    dailyPlayedCountedRef.current = false;

    startLevel(1);
  };

  const startLevel = async (levelNum: number) => {
    const config = generateLevel(levelNum);
    const attemptsForLevel = modeConfig.getAttempts(levelNum);

    let correct: number;
    if (mode === 'daily') {
      correct = getDailyCorrectIndex(levelNum, config.squaresCount);
    } else {
      correct = generateCorrectSquareIndex(config.squaresCount);
    }

    setLevel(levelNum);
    setLevelConfig(config);
    setCorrectIndex(correct);
    setWrongIndices([]);
    setAttempts(attemptsForLevel);
    setTotalAttemptsForLevel(attemptsForLevel);
    setPhase('playing');
    isProcessingRef.current = false;

    // Update highest reached level and reached-level counters in one write
    const stats = await storage.getStatistics();
    let statsChanged = false;

    if (mode === 'classic') {
      if (levelNum > stats.classicHighestLevel) {
        stats.classicHighestLevel = levelNum;
        setBestLevel(levelNum);
        statsChanged = true;
      }
      if (levelNum >= 10 && !reached10CountedRef.current) {
        reached10CountedRef.current = true;
        stats.reachedLevel10 += 1;
        statsChanged = true;
      }
      if (levelNum >= 50 && !reached50CountedRef.current) {
        reached50CountedRef.current = true;
        stats.reachedLevel50 += 1;
        statsChanged = true;
      }
    } else if (mode === 'risk') {
      if (levelNum > stats.riskHighestLevel) {
        stats.riskHighestLevel = levelNum;
        setBestLevel(levelNum);
        statsChanged = true;
      }
    } else if (mode === 'daily') {
      const dailyKey = getDateKey();
      const currentDailyLevel = await storage.getDailyBestLevel(dailyKey);
      if (levelNum > currentDailyLevel) {
        await storage.setDailyBestLevel(levelNum, dailyKey);
        setBestLevel(levelNum);
      }
    }

    if (statsChanged) {
      await storage.setStatistics(stats);
    }

    // Check achievements immediately after updating highest level
    await checkAndUnlockAchievements();
  };

  const handleSquarePress = useCallback((index: number) => {
    if (phase !== 'playing' || isProcessingRef.current) return;
    if (wrongIndices.includes(index)) return;

    isProcessingRef.current = true;

    if (index === correctIndex) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer(index);
    }
  }, [phase, correctIndex, wrongIndices, level]);

  const handleCorrectAnswer = async () => {
    triggerHaptic('success');
    soundManager.playCorrect();

    const newStreak = streak + 1;
    const scoreMultiplier = modeConfig.getScoreMultiplier();
    const points = calculateScore(level, attempts, newStreak, scoreMultiplier);
    const coinMultiplier = modeConfig.getCoinMultiplier();
    const coins = calculateCoins(level, coinMultiplier, false);

    const currentScore = score + points;
    const newCoinsEarned = coinsEarnedThisRun + coins;

    setScore(currentScore);
    setStreak(newStreak);
    setCoinsEarnedThisRun(newCoinsEarned);

    // Save coins immediately to permanent storage
    const newTotalCoins = await storage.addCoins(coins);
    setTotalCoins(newTotalCoins);

    // Update tap stats: correct tap
    await updateTapStats(true);

    // Save best and check achievements immediately
    await saveBest(currentScore);
    await checkAndUnlockAchievements();

    // Check for victory
    if (level >= modeConfig.totalLevels) {
      handleVictory(currentScore, newCoinsEarned);
      return;
    }

    setPopupPoints(points);
    setPopupCoins(coins);
    setPopupTotalScore(currentScore);
    setPopupStreak(newStreak);
    setPopupType('levelComplete');
    setPopupVisible(true);
    popupClosedRef.current = false;
    setPhase('levelComplete');
  };

  const handleWrongAnswer = async (index: number) => {
    triggerHaptic('error');
    soundManager.playWrong();

    // Update tap stats: wrong tap
    await updateTapStats(false);

    const newWrongIndices = [...wrongIndices, index];
    setWrongIndices(newWrongIndices);

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    // Check achievements after tap stats update
    await checkAndUnlockAchievements();

    if (newAttempts <= 0) {
      setTimeout(() => handleGameOver(), 450);
    } else {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 350);
    }
  };

  const countRunIfNeeded = async () => {
    if (!runCountedRef.current) {
      runCountedRef.current = true;
      const stats = await storage.getStatistics();
      stats.totalGamesPlayed += 1;
      await storage.setStatistics(stats);
    }
  };

  const handleGameOver = async () => {
    triggerHaptic('error');
    soundManager.playGameOver();

    setPopupTotalScore(score);
    setPopupType('gameOver');
    setPopupVisible(true);
    setPhase('gameOver');

    // Count run
    await countRunIfNeeded();

    // Save best
    await saveBest(score);

    // Update mode-specific stats
    const stats = await storage.getStatistics();
    if (mode === 'daily' && !dailyPlayedCountedRef.current) {
      dailyPlayedCountedRef.current = true;
      stats.dailyChallengesPlayed += 1;
      await storage.setStatistics(stats);
    }

    await checkAndUnlockAchievements();
  };

  const handleVictory = async (finalScore: number, finalCoins: number) => {
    triggerHaptic('success');
    soundManager.playVictory();

    // Mode-aware victory bonus
    let victoryBonusCoins: number;
    if (mode === 'daily') {
      victoryBonusCoins = 25;
    } else {
      victoryBonusCoins = calculateCoins(100, modeConfig.getCoinMultiplier(), true);
    }
    const totalCoinsEarned = finalCoins + victoryBonusCoins;

    // Add victory bonus to permanent storage (level coins already saved)
    const newTotalCoins = await storage.addCoins(victoryBonusCoins);
    setTotalCoins(newTotalCoins);
    setCoinsEarnedThisRun(totalCoinsEarned);

    setPopupTotalScore(finalScore);
    setPopupType('victory');
    setPopupVisible(true);
    setPhase('victory');

    // Count run
    await countRunIfNeeded();

    // Save best
    await saveBest(finalScore);

    // Update victory stats
    const stats = await storage.getStatistics();
    if (mode === 'classic') {
      stats.classicCompleted = true;
      stats.classicCompletedLevel100 += 1;
    } else if (mode === 'risk') {
      stats.riskCompleted = true;
      stats.riskCompletedLevel100 += 1;
    } else if (mode === 'daily') {
      if (!dailyPlayedCountedRef.current) {
        dailyPlayedCountedRef.current = true;
        stats.dailyChallengesPlayed += 1;
      }
      stats.dailyChallengesCompleted += 1;
      await storage.setDailyCompleted(true);
    }
    await storage.setStatistics(stats);

    await checkAndUnlockAchievements();
  };

  const saveBest = async (currentScore: number) => {
    const stats = await storage.getStatistics();
    let updated = false;

    if (mode === 'classic') {
      if (currentScore > stats.classicBestScore) {
        stats.classicBestScore = currentScore;
        setBestScore(currentScore);
        updated = true;
      }
    } else if (mode === 'risk') {
      if (currentScore > stats.riskBestScore) {
        stats.riskBestScore = currentScore;
        setBestScore(currentScore);
        updated = true;
      }
    } else if (mode === 'daily') {
      const dailyKey = getDateKey();
      const currentDaily = await storage.getDailyBestScore(dailyKey);
      if (currentScore > currentDaily) {
        await storage.setDailyBestScore(currentScore, dailyKey);
        setBestScore(currentScore);
        updated = true;
      }
    }

    if (updated) {
      await storage.setStatistics(stats);
    }
  };

  const updateTapStats = async (isCorrect: boolean) => {
    const stats = await storage.getStatistics();
    stats.totalTaps += 1;
    if (isCorrect) {
      stats.totalCorrectTaps += 1;
    } else {
      stats.totalWrongTaps += 1;
    }
    await storage.setStatistics(stats);
  };

  const checkAndUnlockAchievements = async () => {
    const stats = await storage.getStatistics();
    const unlocked = await storage.getUnlockedAchievements();

    const newUnlocks = checkAchievements(unlocked, {
      classicHighestLevel: stats.classicHighestLevel,
      riskHighestLevel: stats.riskHighestLevel,
      dailyChallengesCompleted: stats.dailyChallengesCompleted,
      dailyChallengesPlayed: stats.dailyChallengesPlayed,
      totalWrongTaps: stats.totalWrongTaps,
      totalTaps: stats.totalTaps,
      classicCompleted: stats.classicCompleted,
      riskCompleted: stats.riskCompleted,
    });

    for (const achievementId of newUnlocks) {
      await storage.unlockAchievement(achievementId);
      if (newUnlocks.indexOf(achievementId) === 0) {
        setAchievementToastId(achievementId);
        setAchievementToastVisible(true);
        soundManager.playAchievement();
        triggerHaptic('success');
      }
    }
  };

  const handlePopupClose = () => {
    if (popupClosedRef.current) return;
    popupClosedRef.current = true;

    setPopupVisible(false);
    if (levelTimerRef.current) clearTimeout(levelTimerRef.current);
    levelTimerRef.current = setTimeout(() => {
      startLevel(level + 1);
    }, 100);
  };

  const handleRestart = () => {
    setPopupVisible(false);
    setScore(0);
    setStreak(0);
    setCoinsEarnedThisRun(0);
    setWrongIndices([]);
    runCountedRef.current = false;
    reached10CountedRef.current = false;
    reached50CountedRef.current = false;
    dailyPlayedCountedRef.current = false;
    if (levelTimerRef.current) clearTimeout(levelTimerRef.current);
    startLevel(1);
  };

  const handleMainMenu = async () => {
    // Count this as an abandoned run if not already counted and some progress was made
    if (level > 1 && !runCountedRef.current) {
      await countRunIfNeeded();
    }
    router.replace('/');
  };

  const handlePause = () => {
    setPhase('paused');
  };

  const handleResume = () => {
    setPhase('playing');
  };

  const handleRestartRun = async () => {
    await countRunIfNeeded();
    setPhase('playing');
    setScore(0);
    setStreak(0);
    setCoinsEarnedThisRun(0);
    setWrongIndices([]);
    runCountedRef.current = false;
    reached10CountedRef.current = false;
    reached50CountedRef.current = false;
    dailyPlayedCountedRef.current = false;
    startLevel(1);
  };

  const handleToggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    soundManager.setEnabled(newValue);
    await storage.setSoundEnabled(newValue);
  };

  if (!levelConfig) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundPattern}>
          <View style={styles.gradientTop} />
        </View>
        <Text style={styles.loading}>Yükleniyor...</Text>
      </View>
    );
  }

  const isInteractionEnabled = phase === 'playing' && !popupVisible;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Background */}
      <View style={styles.backgroundPattern}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Pause color="#FF6B00" size={22} />
        </TouchableOpacity>

        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>{modeConfig.name}</Text>
        </View>

        <View style={styles.headerRight}>
          <CoinDisplay coins={coinsEarnedThisRun} size="small" />
        </View>
      </View>

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudPanel}>
          <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>BÖLÜM</Text>
            <Text style={styles.hudLevelValue}>{level}</Text>
          </View>

          <View style={styles.hudAttemptsItem}>
            <Text style={styles.hudLabel}>HAK</Text>
            <Text style={styles.hudAttemptsValue}>
              <Text style={styles.attemptsCurrent}>{attempts}</Text>
              <Text style={styles.attemptsSeparator}>/</Text>
              <Text style={styles.attemptsTotal}>{totalAttemptsForLevel}</Text>
            </Text>
          </View>

          <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>PUAN</Text>
            <Text style={styles.hudScoreValue}>{formatScore(score)}</Text>
          </View>
        </View>

        {/* Streak display */}
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>Seri: {streak}</Text>
          </View>
        )}
      </View>

      {/* Mission */}
      <View style={styles.missionContainer}>
        <View style={styles.missionBanner}>
          <Text style={styles.missionText}>Doğru kareyi bul</Text>
        </View>
        <View style={styles.missionUnderline} />
      </View>

      {/* Game Grid */}
      <View style={styles.gameArea}>
        <SquareGrid
          squaresCount={levelConfig.squaresCount}
          columns={levelConfig.gridColumns}
          wrongIndices={wrongIndices}
          onSquarePress={handleSquarePress}
          isInteractionEnabled={isInteractionEnabled}
          borderStyle={selectedBorderStyle}
        />
      </View>

      {/* Pause Modal */}
      <Modal visible={phase === 'paused' && !popupVisible} transparent animationType="fade">
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Duraklatıldı</Text>

            <TouchableOpacity style={styles.pauseMenuItem} onPress={handleResume}>
              <Play color="#FF6B00" size={22} />
              <Text style={styles.pauseMenuText}>Devam</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pauseMenuItem} onPress={handleRestartRun}>
              <RefreshCw color="#888" size={22} />
              <Text style={styles.pauseMenuText}>Baştan Başla</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pauseMenuItem} onPress={handleToggleSound}>
              {soundEnabled ? (
                <Volume2 color="#FF6B00" size={22} />
              ) : (
                <VolumeX color="#888" size={22} />
              )}
              <Text style={styles.pauseMenuText}>Ses: {soundEnabled ? 'Açık' : 'Kapalı'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pauseMenuItem} onPress={handleMainMenu}>
              <Home color="#888" size={22} />
              <Text style={styles.pauseMenuText}>Ana Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Game Popup */}
      <GamePopup
        visible={popupVisible}
        type={popupType}
        points={popupPoints}
        totalScore={popupTotalScore}
        level={level}
        bestScore={bestScore}
        bestLevel={bestLevel}
        coins={popupCoins}
        streak={popupStreak}
        modeName={modeConfig.name}
        coinsEarnedThisRun={coinsEarnedThisRun}
        totalCoins={totalCoins}
        isDaily={mode === 'daily'}
        totalLevels={modeConfig.totalLevels}
        onClose={popupType === 'levelComplete' ? handlePopupClose : undefined}
        onRestart={handleRestart}
        onMainMenu={handleMainMenu}
        autoClose={popupType === 'levelComplete'}
        autoCloseDelay={1600}
      />

      {/* Achievement Toast */}
      <AchievementToast
        visible={achievementToastVisible}
        achievementId={achievementToastId}
        onHide={() => setAchievementToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientTop: {
    position: 'absolute',
    top: -200,
    left: -200,
    right: -200,
    height: 400,
    backgroundColor: '#0a0805',
    borderRadius: 400,
    opacity: 0.6,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: -300,
    left: -200,
    right: -200,
    height: 500,
    backgroundColor: '#080505',
    borderRadius: 400,
    opacity: 0.4,
  },
  loading: {
    flex: 1,
    color: '#FF6B00',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pauseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modeBadge: {
    backgroundColor: '#1a0a00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  modeText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 13,
  },
  headerRight: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  hud: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  hudPanel: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  hudItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudAttemptsItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1a1a1a',
  },
  hudLabel: {
    fontSize: 10,
    color: '#444',
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 4,
  },
  hudLevelValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  hudAttemptsValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  attemptsCurrent: {
    color: '#FF6B00',
  },
  attemptsSeparator: {
    color: '#333',
  },
  attemptsTotal: {
    color: '#666',
  },
  hudScoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: '#2a1a0a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '600',
  },
  missionContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  missionBanner: {
    backgroundColor: '#0a0805',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  missionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B00',
  },
  missionUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#FF6B00',
    borderRadius: 1,
    marginTop: 8,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    backgroundColor: '#141414',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 24,
  },
  pauseMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  pauseMenuText: {
    fontSize: 16,
    color: '#fff',
  },
});
