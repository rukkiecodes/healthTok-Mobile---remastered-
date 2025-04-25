import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

const HapticWrapper = ({ children, style, onPress, ...rest }: HapticWrapperProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={style} {...rest}>
      {children}
    </Pressable>
  );
};

export default HapticWrapper;
