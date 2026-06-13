import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { X, Volume2, VolumeX } from 'lucide-react-native';

interface SettingsModalProps {
  visible: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export function SettingsModal({
  visible,
  soundEnabled,
  onToggleSound,
  onClose,
}: SettingsModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Ayarlar</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color="#FF6B00" size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={onToggleSound}
              activeOpacity={0.8}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, soundEnabled && styles.iconActive]}>
                  {soundEnabled ? (
                    <Volume2 color="#FF6B00" size={28} />
                  ) : (
                    <VolumeX color="#666" size={28} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, !soundEnabled && styles.mutedText]}>
                    Ses
                  </Text>
                  <Text style={[styles.settingSubtitle]}>
                    {soundEnabled ? 'Açık' : 'Kapalı'}
                  </Text>
                </View>
              </View>
              <View style={[styles.toggle, soundEnabled && styles.toggleActive]}>
                <View
                  style={[
                    styles.toggleKnob,
                    soundEnabled && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#141414',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    borderColor: '#FF6B00',
    borderWidth: 2,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  iconActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#1a0a00',
  },
  settingTextContainer: {
    flexDirection: 'column',
  },
  settingTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  mutedText: {
    color: '#666',
  },
  toggle: {
    width: 54,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleActive: {
    backgroundColor: '#3d1a00',
    borderColor: '#FF6B00',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#444',
  },
  toggleKnobActive: {
    backgroundColor: '#FF6B00',
    alignSelf: 'flex-end',
  },
});
