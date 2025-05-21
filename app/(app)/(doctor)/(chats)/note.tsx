import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Divider, PaperProvider } from 'react-native-paper'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { getOtherParticipant } from '@/libraries/extractUID'
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { FlashList } from '@shopify/flash-list'
import { formatMessageTime } from '@/libraries/formatTime'

export default function note () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const [notes, setNotes] = useState<object[]>([])

  const parsParams = () => JSON.parse(conversationData)

  const fetchNotes = async () => {
    try {
      const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))

      const q = query(collection(db, "patient", uid, 'records', String(auth.currentUser?.uid), 'notes'), orderBy("timestamp", "desc"));

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
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_left.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <ThemedText type='subtitle' font='Poppins-Bold'>Notes</ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(app)/(doctor)/(chats)/addNote',
              params: { chatId: chatId, conversationData: JSON.stringify(parsParams()) }
            })
          }}
          style={{
            paddingHorizontal: 20,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText lightColor={accent} type='default' font='Poppins-Medium'>Add</ThemedText>
        </TouchableOpacity>
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