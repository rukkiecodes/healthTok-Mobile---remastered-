import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { ThemedText } from '../ThemedText'
import { accent, appDark, light } from '@/utils/colors'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { getOtherParticipant } from '@/libraries/extractUID'
import { ThemedView } from '../ThemedView'
import { FlashList } from '@shopify/flash-list'
import { Divider } from 'react-native-paper'
import { formatMessageTime } from '@/libraries/formatTime'

export default function NoteList ({ conversationData, chatId }: any) {
  const theme = useColorScheme()

  const [notes, setNotes] = useState<object[]>([])

  const fetchNotes = async () => {
    try {
      const uid = getOtherParticipant(conversationData?.participants, String(auth.currentUser?.uid))

      const q1 = await getDocs(collection(db, 'patient', uid, 'records'))

      q1.docs.forEach(async doctor => {
        const notes = await getDocs(collection(db, 'patient', uid, 'records', doctor.id, 'notes'))

        setNotes(
          notes.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      })
    } catch (error) {
      console.log('Error saving note', error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [chatId])

  return (
    <View style={{ gap: 5 }}>
      <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Notes</ThemedText>

      <ThemedView style={{ flex: 1, marginTop: 10 }}>
        <FlashList
          data={notes}
          estimatedItemSize={75}
          keyExtractor={(item: any) => item.id}
          ListEmptyComponent={() => <ThemedText>No notes yet</ThemedText>}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Divider style={{ marginVertical: 20 }} />}
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
    </View>
  )
}