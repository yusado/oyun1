import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ModeCard } from '@/components/ModeCard';
import { CoinDisplay } from '@/components/CoinDisplay';
import { GameMode } from '@/game/modes';
import { storage } from '@/utils/storage';
import { getDateKey } from '@/game/dailyChallenge';

export default function ModeSelectScreen() {
  const router = useRouter();
  const [coins, setCoins] = useState(0);
  const [classicBestScore, setClassicBestScore] = useState(0);
  const [classicBestLevel, setClassicBestLevel] = useState(0);
  const [riskBestScore, setRiskBestScore] = useState(0);
  const [riskBestLevel, setRiskBestLevel] = useState(0);
  const [dailyBestScore, setDailyBestScore] = useState(0);
  const [dailyBestLevel, setDailyBestLevel] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const coinTotal = await storage.getCoins();
    const stats = await storage.getStatistics();
    const completed = await storage.isDailyCompleted();
    const dailyScore = await storage.getDailyBestScore();
    const dailyLevel = await storage.getDailyBestLevel();

    setCoins(coinTotal);
    setClassicBestScore(stats.classicBestScore);
    setClassicBestLevel(stats.classicHighestLevel);
    setRiskBestScore(stats.riskBestScore);
    setRiskBestLevel(stats.riskHighestLevel);
    setDailyBestScore(dailyScore);
    setDailyBestLevel(dailyLevel);
    setDailyCompleted(completed);
  };

  const handleModeSelect = (mode: GameMode) => {
    // Navigate to game screen with mode parameter
    router.push({
      pathname: '/screens/GameScreen',
      params: { mode },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#FF6B00" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mod Seç</Text>
        <CoinDisplay coins={coins} size="medium" />
      </View>

      {/* Modes List */}
      <View style={styles.content}>
        <ModeCard
          mode="classic"
          onPress={() => handleModeSelect('classic')}
          bestScore={classicBestScore}
          bestLevel={classicBestLevel}
        />
        <ModeCard
          mode="risk"
          onPress={() => handleModeSelect('risk')}
          bestScore={riskBestScore}
          bestLevel={riskBestLevel}
        />
        <ModeCard
          mode="daily"
          onPress={() => handleModeSelect('daily')}
          bestScore={dailyBestScore}
          bestLevel={dailyBestLevel}
          dailyCompleted={dailyCompleted}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
});
