import { View, TouchableOpacity, Platform, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider, TextInput } from 'react-native-paper'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { Image } from 'expo-image'
import { getOtherParticipant } from '@/libraries/extractUID'
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { KeyboardAvoidingView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function note () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const { profile } = useSelector((state: RootState) => state.profile)
  const [loading, setLoading] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')

  const parsParams = () => {
    return {
      conversationData: JSON.parse(conversationData)
    }
  }

  const saveNote = async () => {
    try {
      if(!note) return
      
      setLoading(true)
      const uid = getOtherParticipant(parsParams().conversationData?.participants, String(auth.currentUser?.uid))

      await addDoc(collection(db, 'users', uid, 'records', String(auth.currentUser?.uid), 'notes'), {
        note: note,
        author: profile,
        createdAt: new Date(),
        timestamp: serverTimestamp()
      })

      setNote('')
      router.back()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('Error saving note', error)
    }
  }

  const validateSend = () => {
    if (note.length < 1) return false
    else return true
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20
          }}
        >
          <TouchableOpacity
            onPress={router.back}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_left.png')}
              style={{
                width: 25,
                height: 25,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <ThemedText type='subtitle' font='Poppins-Bold'>Add Note</ThemedText>
        </View>

        <TouchableOpacity
          onPress={saveNote}
          disabled={!validateSend() || loading}
          style={{
            paddingHorizontal: 20,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            loading ?
              <ActivityIndicator size={12} color={theme == 'dark' ? light : accent} /> :
              <ThemedText lightColor={accent} type='default' font='Poppins-Medium'>Add</ThemedText>
          }
        </TouchableOpacity>
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={{ flex: 1, padding: 20 }}>
            <TextInput
              value={note}
              onChangeText={text => setNote(text)}
              multiline
              label={'Note'}
              placeholder='Write a note...'
              numberOfLines={20}
              mode='outlined'
              outlineStyle={{
                borderRadius: 12,
                borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`
              }}
              style={{
                backgroundColor: transparent,
                minHeight: 200
              }}
            />
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}