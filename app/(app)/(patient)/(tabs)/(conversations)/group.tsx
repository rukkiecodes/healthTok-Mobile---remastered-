import { View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGroupChats } from '@/store/actions/patient/groupConversations'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent } from '@/utils/colors'
import { formatMessageTime } from '@/libraries/formatTime'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'
import { RootState } from '@/store/store'

export default function group () {
  const dispatch = useDispatch()
  const { conversations, loading } = useSelector((state: RootState) => state.groupChat)

  useEffect(() => {
    dispatch(fetchGroupChats(true))  // Fetch initial set of conversations
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
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!loading) {
              dispatch(fetchGroupChats(false))
            }
          }}
          onEndReachedThreshold={0.5}
          estimatedItemSize={100}
        />
      </ThemedView>
    </PaperProvider>
  )
}