import React from 'react';
import { Pressable, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { normalizeSize } from '@/libraries/normalize';

interface HapticWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  haptic?: boolean;
  width?: number | any; // base width in design units
  height?: number | any; // base height in design units
}

const HapticWrapper = ({
  children,
  style,
  onPress,
  haptic = true,
  width,
  height,
  ...rest
}: HapticWrapperProps) => {
  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container(width, height), style]}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

const styles = {
  container: (w: number, h: number): ViewStyle => ({
    width: normalizeSize(w),
    height: normalizeSize(h),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalizeSize(8), // optional
  }),
};

export default HapticWrapper;
