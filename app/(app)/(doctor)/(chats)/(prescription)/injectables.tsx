import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { auth, db } from '@/utils/fb';
import { getOtherParticipant } from '@/libraries/extractUID';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import HapticWrapper from '@/components/Harptic';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { accent, amber, light, transparent } from '@/utils/colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { FlashList } from '@shopify/flash-list';
import { Alert } from 'react-native';

export default function injectables () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const parsParams = () => JSON.parse(conversationData)

  const [presriptions, setPresriptions] = useState<object[]>([])

  const fetchPresriptions = async () => {
    try {
      const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))

      const q = query(collection(db, "patient", uid, 'presriptions', String(auth.currentUser?.uid), 'presriptions'), where('prescriptionType', '==', 'injectables'), orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setPresriptions(data)
      });

      return unsubscribe
    } catch (error) {
      console.log('Error fetching ')
    }
  }

  const deletePrescription = async (item: any) => {
    const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))

    Alert.alert('Delete Presription', `Are you sure you want to delete ${item?.name}?`, [
      { text: 'Cancel' },
      {
        text: 'Delete Presription',
        style: 'destructive',
        onPress: async () => await deleteDoc(doc(db, 'patient', uid, 'presriptions', String(auth.currentUser?.uid), 'presriptions', item.id))
      }
    ])
  }

  useEffect(() => {
    fetchPresriptions()
  }, [chatId, db])

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, paddingVertical: 40 }}>
        <FlashList
          data={presriptions}
          estimatedItemSize={75}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
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
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                padding: 20,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <ThemedText type='body' font='Poppins-Medium' opacity={0.8} style={{ textTransform: 'capitalize' }}>{item?.prescriptionType}</ThemedText>
                  <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={amber}>{item?.name}</ThemedText>
                </View>

                <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{item?.dosage} x {item?.duration}</ThemedText>
              </View>

              <HapticWrapper
                onPress={() => deletePrescription(item)}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  backgroundColor: theme == 'dark' ? light : transparent
                }}
              >
                <Image
                  source={require('@/assets/images/icons/remove.png')}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </HapticWrapper>
            </View>
          )}
        />
      </ThemedView>
    </PaperProvider>
  )
}