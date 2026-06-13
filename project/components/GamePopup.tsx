import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { GameButton } from './GameButton';

interface GamePopupProps {
  visible: boolean;
  type: 'levelComplete' | 'gameOver' | 'victory';
  points?: number;
  coins?: number;
  totalScore?: number;
  level?: number;
  bestScore?: number;
  bestLevel?: number;
  streak?: number;
  onClose?: () => void;
  onRestart?: () => void;
  onMainMenu?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function GamePopup({
  visible,
  type,
  points,
  coins,
  totalScore,
  level,
  bestScore,
  bestLevel,
  streak,
  onClose,
  onRestart,
  onMainMenu,
  autoClose = false,
  autoCloseDelay = 2000,
}: GamePopupProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pointsScaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (type === 'levelComplete' && points !== undefined) {
        setTimeout(() => {
          Animated.spring(pointsScaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }, 150);
      }

      if (autoClose && onClose) {
        const timer = setTimeout(onClose, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      pointsScaleAnim.setValue(0.5);
    }
  }, [visible, autoClose, autoCloseDelay, onClose, type, points]);

  if (!visible) return null;

  const renderContent = () => {
    switch (type) {
      case 'levelComplete':
        return (
          <>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✓</Text>
            </View>
            <Text style={styles.title}>Bölüm Geçildi!</Text>
            <Animated.View style={[styles.pointsRow, { transform: [{ scale: pointsScaleAnim }] }]}>
              <Text style={styles.pointsScore}>+{points}</Text>
              {coins !== undefined && coins > 0 && (
                <Text style={styles.pointsCoins}> 🪙+{coins}</Text>
              )}
            </Animated.View>
            <Text style={styles.totalScore}>Toplam Puan {formatNum(totalScore || 0)}</Text>
            {streak !== undefined && streak > 0 && (
              <Text style={styles.streakText}>Seri: {streak}</Text>
            )}
            <View style={styles.buttonWrapper}>
              <GameButton title="Devam" onPress={onClose!} size="medium" />
            </View>
          </>
        );
      case 'gameOver':
        return (
          <>
            <View style={[styles.iconContainer, styles.iconContainerGameOver]}>
              <Text style={styles.iconGameOver}>✗</Text>
            </View>
            <Text style={styles.title}>Hakların Bitti</Text>
            <Text style={styles.message}>1. bölüme dönüyorsun.</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Son Bölüm</Text>
                <Text style={styles.statValue}>{level || 1}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Puan</Text>
                <Text style={styles.statValue}>{formatNum(totalScore || 0)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>En Iyi Bölüm</Text>
                <Text style={styles.statValueOrange}>{bestLevel || 1}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>En Yüksek Puan</Text>
                <Text style={styles.statValueOrange}>{formatNum(bestScore || 0)}</Text>
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <GameButton title="Tekrar Dene" onPress={onRestart!} size="large" />
            </View>
            <View style={styles.secondaryButtonWrapper}>
              <GameButton title="Ana Menü" onPress={onMainMenu!} variant="secondary" size="medium" />
            </View>
          </>
        );
      case 'victory':
        return (
          <>
            <View style={[styles.iconContainer, styles.iconContainerVictory]}>
              <Text style={styles.trophyIcon}>🏆</Text>
            </View>
            <Text style={styles.title}>Tebrikler!</Text>
            <Text style={styles.message}>Tüm bölümleri tamamladin!</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Final Puan</Text>
                <Text style={styles.statValue}>{formatNum(totalScore || 0)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>En Yüksek Puan</Text>
                <Text style={styles.statValueOrange}>{formatNum(bestScore || 0)}</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <GameButton title="Ana Menü" onPress={onMainMenu!} variant="secondary" size="medium" />
              <GameButton title="Yeniden Oyna" onPress={onRestart!} size="medium" />
            </View>
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}

function formatNum(num: number): string {
  return num.toLocaleString('tr-TR');
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#141414',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderColor: '#FF6B00',
    borderWidth: 2,
    minWidth: 320,
    maxWidth: '88%',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a0a00',
    borderWidth: 2,
    borderColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainerGameOver: {
    borderColor: '#ff4444',
    backgroundColor: '#1a0a0a',
  },
  iconContainerVictory: {
    borderColor: '#FFD166',
    backgroundColor: '#FF6B00',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  icon: {
    fontSize: 32,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  iconGameOver: {
    fontSize: 32,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  trophyIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pointsScore: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  pointsCoins: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  totalScore: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
    textAlign: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#FF6B00',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statValueOrange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
