import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatBadgeProps {
  label: string;
  value: string | number;
  valueColor?: string;
  size?: 'small' | 'medium' | 'large';
}

export function StatBadge({ label, value, valueColor = '#FF6B00', size = 'medium' }: StatBadgeProps) {
  const sizeStyles = {
    small: { labelSize: 10, valueSize: 16, padding: 8 },
    medium: { labelSize: 12, valueSize: 24, padding: 12 },
    large: { labelSize: 14, valueSize: 32, padding: 16 },
  };

  const s = sizeStyles[size];

  return (
    <View style={[styles.container, { padding: s.padding }]}>
      <Text style={[styles.label, { fontSize: s.labelSize }]}>{label}</Text>
      <Text style={[styles.value, { fontSize: s.valueSize, color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    minWidth: 80,
  },
  label: {
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontWeight: 'bold',
  },
});
