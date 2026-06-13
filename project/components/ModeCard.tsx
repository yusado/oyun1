import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameMode, GAME_MODES } from '@/game/modes';
import { CoinDisplay } from './CoinDisplay';

interface ModeCardProps {
  mode: GameMode;
  onPress: () => void;
  bestScore?: number;
  bestLevel?: number;
  dailyCompleted?: boolean;
}

export function ModeCard({ mode, onPress, bestScore, bestLevel, dailyCompleted }: ModeCardProps) {
  const config = GAME_MODES[mode];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>{config.name}</Text>
        {mode === 'daily' && dailyCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>TAMAMLANDI</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{config.description}</Text>

      {config.warning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{config.warning}</Text>
        </View>
      )}

      <View style={styles.stats}>
        {bestLevel !== undefined && bestLevel > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>En İyi Bölüm</Text>
            <Text style={styles.statValue}>{bestLevel}</Text>
          </View>
        )}
        {bestScore !== undefined && bestScore > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>En Yüksek Puan</Text>
            <Text style={styles.statValue}>{bestScore.toLocaleString('tr-TR')}</Text>
          </View>
        )}
      </View>

      {mode === 'risk' && (
        <View style={styles.multiplierRow}>
          <Text style={styles.multiplierBadge}>3x Puan</Text>
          <Text style={styles.multiplierBadge}>2x Coin</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  completedBadge: {
    backgroundColor: '#1a3a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  warningBox: {
    backgroundColor: '#2a1a0a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  warningText: {
    color: '#FF9500',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  statItem: {},
  statLabel: {
    fontSize: 11,
    color: '#555',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  multiplierRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  multiplierBadge: {
    backgroundColor: '#2a1a0a',
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
