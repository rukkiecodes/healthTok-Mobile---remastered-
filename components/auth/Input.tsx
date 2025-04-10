import { useThemeColor } from '@/hooks/useThemeColor';
import { accent, dark, light, transparent } from '@/utils/colors';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme'
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

export type ThemedTextProps = TextInputProps & {
  font?: 'Poppins-Black' | 'Poppins-BlackItalic' | 'Poppins-Bold' | 'Poppins-BoldItalic' | 'Poppins-ExtraBold' | 'Poppins-ExtraBoldItalic' | 'Poppins-ExtraLight' | 'Poppins-ExtraLightItalic' | 'Poppins-Italic' | 'Poppins-Light' | 'Poppins-LightItalic' | 'Poppins-Medium' | 'Poppins-MediumItalic' | 'Poppins-Regular' | 'Poppins-SemiBold' | 'Poppins-SemiBoldItalic' | 'Poppins-Thin' | 'Poppins-ThinItalic';
  value?: string;
  updateValue?: (text: string) => void;
  label?: string
  style?: any
  left?: any
  right?: boolean
  gap?: number
  peek?: boolean
  setPeek?: any
};

export function Input ({
  style,
  font,
  value,
  left,
  right,
  gap,
  peek,
  setPeek,
  label = 'Label',
  updateValue = () => { },
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme()
  const color = useThemeColor({ light: dark, dark: light }, 'text');

  const [text, setText] = useState(value);

  const handleTextChange = (text: string) => {
    setText(text);
    updateValue(text);
  };

  return (
    <View style={{ position: 'relative', width: '100%', marginTop: gap }}>
      <TextInput
        value={text}
        label={label}
        onChangeText={handleTextChange}
        mode='outlined'
        outlineStyle={{ borderRadius: 20 }}
        activeOutlineColor={theme == 'dark' ? light : accent}
        contentStyle={{
          fontFamily: 'Poppins-Regular',
          color
        }}
        style={{
          ...style,
          backgroundColor: transparent,
          minHeight: 50,
          maxHeight: 200,
          paddingLeft: 30
        }}
        {...rest}
      />

      <Image
        source={left}
        style={{
          width: 20,
          height: 20,
          tintColor: theme == 'dark' ? light : accent,
          marginTop: 15,
          position: 'absolute',
          left: 15,
          top: 5,
          opacity: 0.5,
        }}
      />

      {
        right &&
        <TouchableOpacity
          onPress={() => setPeek(!peek)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={peek ? require('@/assets/images/icons/eye.png') : require('@/assets/images/icons/eye-off.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : accent,
              marginTop: 15,
              opacity: 0.5,
            }}
          />
        </TouchableOpacity>
      }
    </View>
  )
}
