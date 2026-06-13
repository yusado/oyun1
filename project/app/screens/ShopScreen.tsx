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
import { ArrowLeft, Check } from 'lucide-react-native';
import { CoinDisplay } from '@/components/CoinDisplay';
import { COSMETICS, getCosmeticById, Cosmetic } from '@/game/cosmetics';
import { storage } from '@/utils/storage';
import { triggerHaptic } from '@/utils/haptics';
import { soundManager } from '@/utils/sound';

export default function ShopScreen() {
  const router = useRouter();
  const [coins, setCoins] = useState(0);
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>([]);
  const [selectedCosmeticId, setSelectedCosmeticId] = useState('default');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const coinTotal = await storage.getCoins();
    const owned = await storage.getOwnedCosmetics();
    const selected = await storage.getSelectedCosmetic();

    setCoins(coinTotal);
    setOwnedCosmetics(owned);
    setSelectedCosmeticId(selected);
  };

  const handlePurchase = async (cosmetic: Cosmetic) => {
    if (ownedCosmetics.includes(cosmetic.id)) {
      // Already owned, just select it
      await storage.setSelectedCosmetic(cosmetic.id);
      setSelectedCosmeticId(cosmetic.id);
      triggerHaptic('light');
      return;
    }

    if (coins >= cosmetic.price) {
      // Can purchase
      const newCoins = coins - cosmetic.price;
      await storage.setCoins(newCoins);
      await storage.addOwnedCosmetic(cosmetic.id);
      await storage.setSelectedCosmetic(cosmetic.id);

      setCoins(newCoins);
      setOwnedCosmetics([...ownedCosmetics, cosmetic.id]);
      setSelectedCosmeticId(cosmetic.id);
      triggerHaptic('success');
      soundManager.playCoin();
    } else {
      triggerHaptic('error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#FF6B00" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mağaza</Text>
        <CoinDisplay coins={coins} size="medium" />
      </View>

      {/* Items */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {COSMETICS.map((cosmetic) => {
          const isOwned = ownedCosmetics.includes(cosmetic.id);
          const isSelected = selectedCosmeticId === cosmetic.id;
          const canAfford = coins >= cosmetic.price;

          return (
            <TouchableOpacity
              key={cosmetic.id}
              style={[
                styles.itemCard,
                isSelected && styles.itemCardSelected,
                isOwned && styles.itemCardOwned,
              ]}
              onPress={() => handlePurchase(cosmetic)}
              activeOpacity={0.8}
            >
              {/* Preview */}
              <View style={styles.previewRow}>
                <View style={styles.previewContainer}>
                  <View
                    style={[
                      styles.previewSquare,
                      {
                        borderWidth: cosmetic.borderStyle.borderWidth,
                        borderRadius: cosmetic.borderStyle?.borderRadius || 8,
                        borderStyle: cosmetic.borderStyle?.borderStyle || 'solid',
                        shadowColor: cosmetic.borderStyle.glowColor || 'transparent',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: cosmetic.borderStyle.glowColor ? 1 : 0,
                        shadowRadius: cosmetic.borderStyle.glowRadius || 0,
                        elevation: cosmetic.borderStyle.glowColor ? 5 : 0,
                      },
                    ]}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{cosmetic.name}</Text>
                  {cosmetic.price === 0 ? (
                    <Text style={styles.freeText}>Ücretsiz</Text>
                  ) : isOwned ? (
                    <Text style={styles.ownedText}>Satın Alındı</Text>
                  ) : (
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceText, !canAfford && styles.priceUnaffordable]}>
                        🪙 {cosmetic.price}
                      </Text>
                      {!canAfford && <Text style={styles.needMore}> - Yetersiz</Text>}
                    </View>
                  )}
                </View>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Check color="#4CAF50" size={20} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  itemCardSelected: {
    borderColor: '#FF6B00',
    backgroundColor: '#1a0a00',
  },
  itemCardOwned: {
    borderColor: '#1a3a1a',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewContainer: {
    padding: 8,
    backgroundColor: '#141414',
    borderRadius: 12,
    marginRight: 14,
  },
  previewSquare: {
    width: 50,
    height: 50,
    borderColor: '#FF6B00',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  freeText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  ownedText: {
    fontSize: 13,
    color: '#4CAF50',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  priceUnaffordable: {
    color: '#666',
  },
  needMore: {
    fontSize: 12,
    color: '#ff4444',
  },
  selectedBadge: {
    backgroundColor: '#1a3a1a',
    borderRadius: 20,
    padding: 6,
  },
});
