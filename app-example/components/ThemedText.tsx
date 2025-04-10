import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { blue } from '@/utils/colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'body';
  font?: 'Poppins-Black' | 'Poppins-BlackItalic' | 'Poppins-Bold' | 'Poppins-BoldItalic' | 'Poppins-ExtraBold' | 'Poppins-ExtraBoldItalic' | 'Poppins-ExtraLight' | 'Poppins-ExtraLightItalic' | 'Poppins-Italic' | 'Poppins-Light' | 'Poppins-LightItalic' | 'Poppins-Medium' | 'Poppins-MediumItalic' | 'Poppins-Regular' | 'Poppins-SemiBold' | 'Poppins-SemiBoldItalic' | 'Poppins-Thin' | 'Poppins-ThinItalic';
  opacity?: number
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

  return (
    <Text
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
        { fontFamily: font || 'Poppins-Light', opacity }
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 20,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: blue,
  },
  body: {
    fontSize: 14
  },
  caption: {
    fontSize: 12
  },
});
