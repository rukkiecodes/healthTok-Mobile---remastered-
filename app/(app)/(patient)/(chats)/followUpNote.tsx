import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Divider, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { getOtherParticipant } from '@/libraries/extractUID'
import { auth, db } from '@/utils/fb'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { FlashList } from '@shopify/flash-list'
import { formatMessageTime } from '@/libraries/formatTime'

export default function followUpNote () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const [notes, setNotes] = useState<object[]>([])

  const parsParams = () => JSON.parse(conversationData)

  const fetchNotes = async () => {
    try {
      const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))
      const q = query(collection(db, "patient", String(auth.currentUser?.uid), 'records', uid, 'notes'), orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setNotes(data)
      });

      return unsubscribe
    } catch (error) {
      console.log('Error saving note', error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [chatId, db])

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light }}>
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

        <ThemedText type='subtitle' font='Poppins-Bold'>Follow-up Note</ThemedText>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>
        <FlashList
          data={notes}
          estimatedItemSize={75}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
          ItemSeparatorComponent={() => <Divider style={{ marginVertical: 40 }} />}
          renderItem={({ item }: any) => (
            <View>
              <View
                style={{
                  padding: 20,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`
                }}
              >
                <ThemedText>{item?.note}</ThemedText>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10
                }}
              >
                <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Time: {formatMessageTime(item?.createdAt)}</ThemedText>

                <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Date: {new Date(item?.createdAt?.seconds * 1000).toDateString()}</ThemedText>
              </View>
            </View>
          )}
        />
      </ThemedView>
    </PaperProvider>
  )
}