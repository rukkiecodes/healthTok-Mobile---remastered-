import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '../ThemedText';
import { black, light } from '@/utils/colors';

export type EditInputProps = TextInputProps & {
  placeholder?: string
  label?: string
  separation?: number
  value?: string
  updateValue?: (text: string) => void
  onInputBlur?: () => void
  multiline?: boolean
};

const ProfileInputs: React.FC<EditInputProps> = ({
  placeholder,
  label,
  separation,
  value = '',
  updateValue = () => { },
  onInputBlur = () => { },
  multiline
}) => {
  const outlineColor = useThemeColor({ light: black, dark: light }, 'text');
  const color = useThemeColor({ light: black, dark: light }, 'text');

  const [text, setText] = useState<string>(value);

  const onChangeText = (text: string) => {
    setText(text);
    updateValue(text);
  };

  return (
    <View style={{ marginTop: separation, flex: 1 }}>
      <ThemedText style={styles.label}>{label || 'Label'}</ThemedText>

      <TextInput
        value={text}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Placeholder'}
        style={[styles.input, { borderColor: outlineColor, color: color }]}
        onBlur={onInputBlur}
        multiline={multiline || false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});

export default ProfileInputs;
