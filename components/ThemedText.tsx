import { Text, type TextProps, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFonts } from 'expo-font';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const normalizeFontSize = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;

  // Use the smaller scale for more consistent results
  const scale = Math.min(scaleWidth, scaleHeight);
  const newSize = (size * scale) / 1.5;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'body';
  font?: string;
  opacity?: number;
};

export function ThemedText ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  font,
  opacity = 1,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const [loaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-BlackItalic': require('@/assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('@/assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraBoldItalic': require('@/assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-ExtraLight': require('@/assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraLightItalic': require('@/assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
    'Poppins-Italic': require('@/assets/fonts/Poppins/Poppins-Italic.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-LightItalic': require('@/assets/fonts/Poppins/Poppins-LightItalic.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('@/assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-SemiBoldItalic': require('@/assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
    'Poppins-Thin': require('@/assets/fonts/Poppins/Poppins-Thin.ttf'),
    'Poppins-ThinItalic': require('@/assets/fonts/Poppins/Poppins-ThinItalic.ttf'),
  });

  if (!loaded) return null;

  return (
    <Text
      allowFontScaling={false}
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
        { fontFamily: font || 'Poppins-Regular', opacity }
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: normalizeFontSize(16),
  },
  defaultSemiBold: {
    fontSize: normalizeFontSize(16),
  },
  title: {
    fontSize: normalizeFontSize(32),
  },
  subtitle: {
    fontSize: normalizeFontSize(20),
  },
  link: {
    lineHeight: normalizeFontSize(30),
    fontSize: normalizeFontSize(16),
  },
  body: {
    fontSize: normalizeFontSize(14),
  },
  caption: {
    fontSize: normalizeFontSize(12),
  },
});
