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
import { ACHIEVEMENTS, Achievement } from '@/game/achievements';
import { storage } from '@/utils/storage';

export default function AchievementsScreen() {
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const unlocked = await storage.getUnlockedAchievements();
    setUnlockedIds(unlocked);
  };

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#FF6B00" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başarımlar</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{unlockedCount}/{totalCount}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Achievement List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);

          return (
            <View
              key={achievement.id}
              style={[styles.achievementCard, isUnlocked && styles.achievementUnlocked]}
            >
              <View style={styles.achievementIcon}>
                <Text style={[styles.iconText, !isUnlocked && styles.iconTextLocked]}>
                  {isUnlocked ? '🏆' : '🔒'}
                </Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementName, !isUnlocked && styles.achievementNameLocked]}>
                  {achievement.name}
                </Text>
                <Text style={[styles.achievementDesc, !isUnlocked && styles.achievementDescLocked]}>
                  {achievement.description}
                </Text>
              </View>
              {isUnlocked && (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedBadgeText}>AÇILDI</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  counterBadge: {
    backgroundColor: '#1a0a00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  achievementCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    borderColor: '#FF6B00',
    backgroundColor: '#0a0500',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    borderRadius: 25,
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  iconTextLocked: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: '#666',
  },
  achievementDesc: {
    fontSize: 13,
    color: '#888',
  },
  achievementDescLocked: {
    color: '#444',
  },
  unlockedBadge: {
    backgroundColor: '#1a3a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlockedBadgeText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
