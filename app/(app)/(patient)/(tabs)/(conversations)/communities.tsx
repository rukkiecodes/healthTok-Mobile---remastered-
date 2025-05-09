import { View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent } from '@/utils/colors'
import { formatMessageTime } from '@/libraries/formatTime'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'
import { RootState } from '@/store/store'
import { fetchUserCommunities } from '@/store/actions/patient/fetchUserCommunities'

export default function communities () {
  const dispatch = useDispatch()
  const { communities, loading } = useSelector((state: RootState) => state.communities)

  useEffect(() => {
    dispatch(fetchUserCommunities())  // Fetch initial set of communities
  }, [dispatch])

  const renderItem = ({ item }: { item: any }) => {
    const { otherProfile, id, lastMessage, createdAt } = item

    const navigateToChat = async () => {
      router.push({
        pathname: '/(app)/(patient)/(chats)/[chatId]',
        params: { chatId: id }
      })
    }

    return (
      <TouchableOpacity
        onPress={() => navigateToChat()}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20
        }}
      >
        <Image
          source={otherProfile?.profilePicture}
          style={{
            width: 60,
            height: 60,
            borderRadius: 50
          }}
        />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ThemedText type='subtitle' font='Poppins-Bold'>{otherProfile?.name}</ThemedText>
            <ThemedText type='body' lightColor={accent}>{formatMessageTime(createdAt)}</ThemedText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Regular'>{lastMessage ? lastMessage : 'Say Hi...'}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, padding: 20, gap: 20 }}>
        <FlashList
          data={communities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!loading) {
              dispatch(fetchUserCommunities())
            }
          }}
          onEndReachedThreshold={0.5}
          estimatedItemSize={100}
        />
      </ThemedView>
    </PaperProvider>
  )
}