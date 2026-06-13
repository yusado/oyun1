import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StatCard, StatRow } from '@/components/StatCard';
import { CoinDisplay } from '@/components/CoinDisplay';
import { GameStatistics } from '@/game/statistics';
import { storage } from '@/utils/storage';

export default function StatsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<GameStatistics | null>(null);
  const [coins, setCoins] = useState(0);
  const [dailyBestScore, setDailyBestScore] = useState(0);
  const [dailyBestLevel, setDailyBestLevel] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const statistics = await storage.getStatistics();
    const coinTotal = await storage.getCoins();
    const dScore = await storage.getDailyBestScore();
    const dLevel = await storage.getDailyBestLevel();

    setStats(statistics);
    setCoins(coinTotal);
    setDailyBestScore(dScore);
    setDailyBestLevel(dLevel);
  };

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  const accuracy = stats.totalTaps > 0
    ? ((stats.totalCorrectTaps / stats.totalTaps) * 100).toFixed(1)
    : '0.0';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#FF6B00" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İstatistikler</Text>
        <CoinDisplay coins={coins} size="small" />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Overview Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel Bakış</Text>
          <View style={styles.statsRow}>
            <StatCard label="Toplam Oyun" value={stats.totalGamesPlayed} />
            <StatCard label="Toplam Tap" value={stats.totalTaps} />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Doğru Tap" value={stats.totalCorrectTaps} />
            <StatCard label="Yanlış Tap" value={stats.totalWrongTaps} />
          </View>
          <View style={styles.accuracyCard}>
            <Text style={styles.accuracyLabel}>Doğruluk Oranı</Text>
            <Text style={styles.accuracyValue}>{accuracy}%</Text>
          </View>
        </View>

        {/* Classic Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Klasik Mod</Text>
          <View style={styles.statsBox}>
            <StatRow label="En Yüksek Bölüm" value={stats.classicHighestLevel} highlight />
            <StatRow label="En Yüksek Puan" value={stats.classicBestScore.toLocaleString('tr-TR')} highlight />
            <StatRow label="10. Bölüme Ulaşma" value={stats.reachedLevel10} />
            <StatRow label="50. Bölüme Ulaşma" value={stats.reachedLevel50} />
            <StatRow label="100. Bölümü Tamamlama" value={stats.classicCompletedLevel100} />
          </View>
        </View>

        {/* Risk Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Modu</Text>
          <View style={styles.statsBox}>
            <StatRow label="En Yüksek Bölüm" value={stats.riskHighestLevel} highlight />
            <StatRow label="En Yüksek Puan" value={stats.riskBestScore.toLocaleString('tr-TR')} highlight />
            <StatRow label="100. Bölümü Tamamlama" value={stats.riskCompletedLevel100} />
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Meydan Okuma</Text>
          <View style={styles.statsBox}>
            <StatRow label="Bugünün En Yüksek Puanı" value={dailyBestScore.toLocaleString('tr-TR')} highlight />
            <StatRow label="Bugünün En Yüksek Bölümü" value={dailyBestLevel} highlight />
            <StatRow label="Günlük Oynama" value={stats.dailyChallengesPlayed} />
            <StatRow label="Tamamlanan" value={stats.dailyChallengesCompleted} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  loading: {
    flex: 1,
    color: '#FF6B00',
    textAlign: 'center',
    textAlignVertical: 'center',
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statsBox: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  accuracyCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  accuracyLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  accuracyValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
});
