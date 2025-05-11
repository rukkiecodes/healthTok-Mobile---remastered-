import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { accent, amber, appDark, light } from '@/utils/colors'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { getOtherParticipant } from '@/libraries/extractUID'
import { auth, db } from '@/utils/fb'
import { collection, getDocs } from 'firebase/firestore'
import { ThemedView } from '../ThemedView'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'

export default function PrescriptionList ({ conversationData, chatId }: any) {
  const theme = useColorScheme()

  const [presriptions, setPresriptions] = useState<object[]>([])

  const fetchPresriptions = async () => {
    try {
      const uid = getOtherParticipant(conversationData?.participants, String(auth.currentUser?.uid))

      const q1 = await getDocs(collection(db, 'patient', uid, 'presriptions'))

      q1.docs.forEach(async doctor => {
        const presriptions = await getDocs(collection(db, 'patient', uid, 'presriptions', doctor.id, 'presriptions'))

        setPresriptions(
          presriptions.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      })
    } catch (error) {
      console.log('Error saving presriptions', error)
    }
  }

  useEffect(() => {
    fetchPresriptions()
  }, [chatId])

  return (
    <View style={{ gap: 5 }}>
      <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Prescribed Drugs</ThemedText>

      <ThemedView style={{ flex: 1, marginTop: 10 }}>
        <FlashList
          data={presriptions}
          estimatedItemSize={75}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
          ListEmptyComponent={() => {
            return (
              <ThemedView
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ThemedText type='default' font='Poppins-Bold'>There are no presriptions at the moment</ThemedText>
              </ThemedView>
            )
          }}
          renderItem={({ item }: any) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <Image
                source={require('@/assets/images/icons/dot.png')}
                style={{
                  width: 8,
                  height: 8,
                  tintColor: theme == 'dark' ? light : appDark,
                  opacity: 0.6
                }}
              />

              <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{item?.name}</ThemedText>
            </View>
          )}
        />
      </ThemedView>
    </View>
  )
}