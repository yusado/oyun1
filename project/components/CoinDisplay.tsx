import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CoinDisplayProps {
  coins: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function CoinDisplay({ coins, size = 'medium', showLabel = false }: CoinDisplayProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCoinsRef = useRef(coins);

  useEffect(() => {
    if (coins !== prevCoinsRef.current) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
      prevCoinsRef.current = coins;
    }
  }, [coins]);

  const sizeStyles = {
    small: { iconSize: 16, fontSize: 14 },
    medium: { iconSize: 20, fontSize: 18 },
    large: { iconSize: 28, fontSize: 24 },
  };

  const s = sizeStyles[size];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.coinIcon, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={{ fontSize: s.iconSize }}>🪙</Text>
      </Animated.View>
      <Text style={[styles.coinText, { fontSize: s.fontSize }]}>
        {coins.toLocaleString('tr-TR')}
      </Text>
      {showLabel && <Text style={styles.label}>coin</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {},
  coinText: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginLeft: 2,
  },
});
