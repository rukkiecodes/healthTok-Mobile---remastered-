import { View, ViewProps, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme';
import getUserId from '@/libraries/uid'
import { router } from 'expo-router'
import { accentDark, faintAccent } from '@/utils/colors'

export type NotificationProps = ViewProps & {
  item: {
    from?: string;
    title?: string;
    message?: string;
    timestamp?: {
      seconds?: any
    };
    seen?: boolean;
    id?: string
  }
}

const Rows = ({ item }: NotificationProps | any) => {
  const colorScheme = useColorScheme();

  const [userProfile, setUserProfile] = useState<{
    photoURL?: string
    fullName?: string
  }>({})

  const navigateToAction = async () => {
    const id = await getUserId()

    if (item.title == 'Job request')
      router.navigate('/(app)/(booking)/booking')
    if (item.title == 'rating')
      router.navigate('/(app)/(reviews)/reviews')


    await updateDoc(doc(db, 'users', id, 'notification', item?.id), { seen: true })
  }

  useEffect(() => {
    (async () => {
      const profile = (await getDoc(doc(db, 'users', item?.from))).data()

      setUserProfile({ ...profile })
    })()
  }, [item])

  return (
    <TouchableOpacity
      onPress={navigateToAction}
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 20,
        backgroundColor: item?.seen ? 'transparent' : (colorScheme == 'dark' ? accentDark : faintAccent)
      }}
    >
      <Image
        source={userProfile?.photoURL}
        placeholder={require('@/assets/images/imgs/johnDoe.png')}
        placeholderContentFit='cover'
        style={{
          width: 50,
          height: 50,
          borderRadius: 50
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 5
          }}
        >
          <ThemedText type='body'>{item.message}</ThemedText>
        </View>


        <ThemedText type='caption' style={{ opacity: 0.6 }}>{new Date(item.timestamp?.seconds * 1000).toDateString()}</ThemedText>
      </View>
    </TouchableOpacity>
  )
}

export default Rows