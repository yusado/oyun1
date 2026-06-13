import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Settings as SettingsIcon, ShoppingBag, Trophy, BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { storage } from '@/utils/storage';
import { SettingsModal } from '@/components/SettingsModal';
import { GameButton } from '@/components/GameButton';
import { CoinDisplay } from '@/components/CoinDisplay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MainMenuScreen() {
  const router = useRouter();
  const [bestLevel, setBestLevel] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stats = await storage.getStatistics();
    const coinTotal = await storage.getCoins();
    const sound = await storage.isSoundEnabled();

    setBestLevel(stats.classicHighestLevel);
    setBestScore(stats.classicBestScore);
    setCoins(coinTotal);
    setSoundEnabled(sound);
  };

  const handleToggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await storage.setSoundEnabled(newValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Background */}
      <View style={styles.backgroundPattern}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientCenter} />
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <CoinDisplay coins={coins} size="medium" />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
          activeOpacity={0.8}
        >
          <SettingsIcon color="#FF6B00" size={24} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Doğru</Text>
          <Text style={styles.titleHighlight}>Kareyi Bul</Text>
          <Text style={styles.subtitle}>Doğru kare gizli. Şansına güveniyorsan başla.</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EN IYI BÖLÜM</Text>
            <Text style={styles.statValue}>{bestLevel || '-'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EN YÜKSEK PUAN</Text>
            <Text style={styles.statValue}>{bestScore > 0 ? bestScore.toLocaleString('tr-TR') : '-'}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <GameButton title="BAŞLA" onPress={() => router.push('/screens/ModeSelectScreen')} size="large" />
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuButtons}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/screens/ShopScreen')}>
            <View style={styles.menuIconContainer}>
              <ShoppingBag color="#FF6B00" size={22} />
            </View>
            <Text style={styles.menuButtonText}>Mağaza</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/screens/AchievementsScreen')}>
            <View style={styles.menuIconContainer}>
              <Trophy color="#FF6B00" size={22} />
            </View>
            <Text style={styles.menuButtonText}>Başarımlar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/screens/StatsScreen')}>
            <View style={styles.menuIconContainer}>
              <BarChart3 color="#FF6B00" size={22} />
            </View>
            <Text style={styles.menuButtonText}>İstatistik</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>100 Bölüm</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerText}>Şans Oyunu</Text>
        </View>
      </View>

      <SettingsModal
        visible={settingsVisible}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onClose={() => setSettingsVisible(false)}
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
  },
  gradientTop: {
    position: 'absolute',
    top: -200,
    left: -100,
    right: -100,
    height: 500,
    backgroundColor: '#0a0505',
    borderRadius: 500,
    opacity: 0.5,
  },
  gradientCenter: {
    position: 'absolute',
    bottom: -300,
    left: -200,
    right: -200,
    height: 600,
    backgroundColor: '#080505',
    borderRadius: 400,
    opacity: 0.4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  titleHighlight: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FF6B00',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -6,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    minWidth: 130,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  statLabel: {
    fontSize: 10,
    color: '#444',
    marginBottom: 6,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  buttonSection: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  menuButtons: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  menuButton: {
    alignItems: 'center',
    minWidth: 80,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  menuButtonText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
  },
  footerDot: {
    color: '#333',
    marginHorizontal: 8,
  },
});
