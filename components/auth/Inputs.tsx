import { View, TextInputProps, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import { black, light, transparent } from '@/utils/colors';
import { PaperProvider, TextInput } from 'react-native-paper';

export type AuthInputProps = TextInputProps & {
  placeholder?: String
  label?: String
  separation?: Number
  passwordMode?: Boolean
  value?: string
  updateValue?: (text: string) => void
  inputMode?: string
}

const AuthInputs = ({
  placeholder,
  separation,
  passwordMode,
  value = '',
  inputMode,
  updateValue = () => { }
}: AuthInputProps) => {
  const outlineColor = useThemeColor({ light: black, dark: light }, 'text');

  const [peekPassword, setPeekPassword] = useState(true)
  const [text, setText] = useState(value)

  const onChangeText = (text: any) => {
    setText(text)
    updateValue(text)
  }

  return (
    <PaperProvider>
      <View style={{ marginTop: Number(separation) }}>
        <View>
          <TextInput
            value={text}
            onChangeText={onChangeText}
            label={placeholder || 'Placeholder'}
            secureTextEntry={passwordMode ? peekPassword : false}
            inputMode={inputMode || 'text'}
            mode='outlined'
            outlineStyle={{ borderRadius: 10 }}
            style={{ backgroundColor: transparent }}
          />

          {
            passwordMode &&
            <TouchableOpacity
              onPress={() => setPeekPassword(!peekPassword)}
              style={{
                width: 50,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: 1,
                right: 0
              }}
            >
              <Feather name={peekPassword ? 'eye' : 'eye-off'} size={20} color={outlineColor} />
            </TouchableOpacity>
          }
        </View>
      </View>
    </PaperProvider>
  )
}

export default AuthInputs