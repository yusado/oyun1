import { Platform } from 'react-native';

let soundEnabled = true;

export const soundManager = {
  setEnabled(enabled: boolean) {
    soundEnabled = enabled;
  },

  isEnabled() {
    return soundEnabled;
  },

  async playButtonPress() {
    if (!soundEnabled) return;
    console.log('Sound: button_press');
  },

  async playCorrect() {
    if (!soundEnabled) return;
    console.log('Sound: correct');
  },

  async playWrong() {
    if (!soundEnabled) return;
    console.log('Sound: wrong');
  },

  async playLevelUp() {
    if (!soundEnabled) return;
    console.log('Sound: level_up');
  },

  async playGameOver() {
    if (!soundEnabled) return;
    console.log('Sound: game_over');
  },

  async playVictory() {
    if (!soundEnabled) return;
    console.log('Sound: victory');
  },

  async playAchievement() {
    if (!soundEnabled) return;
    console.log('Sound: achievement');
  },

  async playCoin() {
    if (!soundEnabled) return;
    console.log('Sound: coin');
  },
};
