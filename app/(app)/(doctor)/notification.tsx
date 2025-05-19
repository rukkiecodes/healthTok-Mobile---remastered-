import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { auth, db } from '@/utils/fb'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'
import { appDark, light } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import HapticWrapper from '@/components/Harptic'

export default function notification () {
  const theme = useColorScheme()

  const [notifications, setNotifications] = useState<any[]>([])

  const fetchNotifications = async () => {
    const q = query(collection(db, "doctors", String(auth.currentUser?.uid), "notifications"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setNotifications(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    });

    return unsubscribe
  }

  useEffect(() => {
    fetchNotifications()
  }, [db])

  const renderItem = ({ item }: { item: any }) => {
    return (
      <HapticWrapper
        onPress={() => router.dismissTo(item?.route)}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 20
        }}
      >
        <Image
          source={item?.patient?.displayImage?.image}
          placeholder={require('@/assets/images/images/avatar.png')}
          contentFit='cover'
          placeholderContentFit='cover'
          style={{
            width: 60,
            height: 60,
            borderRadius: 50
          }}
        />

        <View>
          <ThemedText type='body' font='Poppins-Regular'>{item.message}</ThemedText>
          <ThemedText type='caption' font='Poppins-Medium' opacity={0.6}>{new Date(item.timestamp?.seconds * 1000).toDateString()}</ThemedText>
        </View>
      </HapticWrapper>
    )
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
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
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle'>Appointments</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20 }}>
        <FlashList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          estimatedItemSize={20}
        />
      </ThemedView>
    </PaperProvider>
  )
}