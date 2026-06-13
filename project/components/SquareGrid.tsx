import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { BorderStyle } from '@/game/cosmetics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SquareGridProps {
  squaresCount: number;
  columns: number;
  wrongIndices: number[];
  onSquarePress: (index: number) => void;
  isInteractionEnabled: boolean;
  borderStyle: BorderStyle;
}

export function SquareGrid({
  squaresCount,
  columns,
  wrongIndices,
  onSquarePress,
  isInteractionEnabled,
  borderStyle,
}: SquareGridProps) {
  const gridPadding = 12;
  const gap = 6;
  const availableWidth = SCREEN_WIDTH - gridPadding * 2 - 32;
  const availableHeight = SCREEN_HEIGHT * 0.55;

  const rows = Math.ceil(squaresCount / columns);

  const widthBasedSize = Math.floor((availableWidth - (columns - 1) * gap) / columns);
  const heightBasedSize = Math.floor((availableHeight - (rows - 1) * gap) / rows);
  const maxSquareSize = Math.min(widthBasedSize, heightBasedSize, 65);

  const squares = [];
  for (let i = 0; i < squaresCount; i++) {
    const isWrong = wrongIndices.includes(i);
    squares.push(
      <Square
        key={i}
        index={i}
        size={maxSquareSize}
        isWrong={isWrong}
        onPress={() => onSquarePress(i)}
        disabled={!isInteractionEnabled || isWrong}
        borderStyle={borderStyle}
      />
    );
  }

  return (
    <View style={styles.playfield}>
      <View style={[styles.grid, { gap }]}>{squares}</View>
    </View>
  );
}

interface SquareProps {
  index: number;
  size: number;
  isWrong: boolean;
  onPress: () => void;
  disabled: boolean;
  borderStyle: BorderStyle;
}

function Square({ size, isWrong, onPress, disabled, borderStyle }: SquareProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWrong) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0.6,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -0.3,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isWrong]);

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-4, 0, 4],
  });

  // Apply cosmetic style to active squares; wrong squares stay dimmed
  const bgColor = isWrong ? '#080808' : '#1a1a1a';
  const borderColor = isWrong ? '#333' : (borderStyle.borderColor || '#FF6B00');
  const opacity = isWrong ? 0.35 : 1;
  const innerBg = isWrong ? '#0a0a0a' : '#2a2a2a';
  const squareBorderWidth = isWrong ? 2 : borderStyle.borderWidth;
  const squareBorderRadius = isWrong ? 8 : borderStyle.borderRadius;
  const squareBorderStyle = isWrong ? 'solid' : (borderStyle.borderStyle || 'solid');

  // Glow effects for active squares
  const glowColor = !isWrong && borderStyle.glowColor ? borderStyle.glowColor : undefined;
  const glowRadius = !isWrong && borderStyle.glowRadius ? borderStyle.glowRadius : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
      style={{ margin: 1 }}
    >
      <Animated.View
        style={[
          styles.square,
          {
            width: size,
            height: size,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: squareBorderWidth,
            borderRadius: squareBorderRadius,
            borderStyle: squareBorderStyle,
            opacity: opacity,
            transform: [
              { scale: scaleAnim },
              { translateX: shakeTranslate },
            ],
            ...(glowColor ? {
              shadowColor: glowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: glowRadius,
              elevation: 5,
            } : {
              shadowColor: '#FF6B00',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
            }),
          },
        ]}
      >
        <View
          style={[
            styles.squareInner,
            {
              width: size - 10,
              height: size - 10,
              backgroundColor: innerBg,
              borderRadius: Math.max(0, squareBorderRadius - 4),
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playfield: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    padding: 12,
    borderColor: '#1a1a1a',
    borderWidth: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareInner: {},
});
