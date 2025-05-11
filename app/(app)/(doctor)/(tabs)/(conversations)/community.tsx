import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { RootState } from '@/store/store'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent } from '@/utils/colors'
import { formatMessageTime } from '@/libraries/formatTime'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'

export default function community () {
  const dispatch = useDispatch()
  const theme = useColorScheme()
  const { loading, communities } = useSelector((state: RootState) => state.doctorCommunities)

  const renderItem = ({ item }: { item: any }) => {
    const { otherProfile, id, lastMessage, createdAt } = item

    const navigateToChat = async () => {
      router.push({
        pathname: '/(app)/(doctor)/(chats)/[chatId]',
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
          source={item?.patient?.photoURL}
          placeholder={require('@/assets/images/images/avatar.png')}
          contentFit='cover'
          placeholderContentFit='cover'
          transition={300}
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
            <ThemedText type='subtitle' font='Poppins-Bold'>{item?.patient?.name}</ThemedText>
            <ThemedText type='body' lightColor={accent}>{formatMessageTime(createdAt)}</ThemedText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Regular'>{lastMessage ? lastMessage?.message : 'Say Hi...'}</ThemedText>
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
          // onEndReached={() => {
          //   if (!loading) {
          //     dispatch(fetchConversations(false))
          //   }
          // }}
          onEndReachedThreshold={0.5}
          estimatedItemSize={100}
        />
      </ThemedView>
    </PaperProvider>
  )
}