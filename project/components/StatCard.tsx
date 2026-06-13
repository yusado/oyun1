import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function StatRow({ label, value, highlight = false }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    flex: 1,
    minWidth: 90,
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
  },
  unit: {
    fontSize: 12,
    color: '#888',
  },
  label: {
    fontSize: 11,
    color: '#555',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  rowLabel: {
    fontSize: 14,
    color: '#888',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  rowValueHighlight: {
    color: '#FF6B00',
  },
});
