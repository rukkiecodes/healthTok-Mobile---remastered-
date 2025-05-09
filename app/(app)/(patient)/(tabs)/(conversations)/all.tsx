import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { fetchConversations, searchConversations } from '@/store/actions/patient/conversations'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent, appDark, black, ice, light, transparent } from '@/utils/colors'
import { formatMessageTime } from '@/libraries/formatTime'
import { PaperProvider, Searchbar } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'

export default function all () {
  const dispatch = useDispatch()
  const theme = useColorScheme()
  const { conversations, filteredConversations, loading } = useSelector((state: any) => state.conversations)

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchConversations(true))  // Fetch initial set of conversations
  }, [dispatch])

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    dispatch(searchConversations(text))  // Filter conversations by search query
  }

  const conversationsToDisplay = searchQuery ? filteredConversations : conversations

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
        {/* Search input */}
        {/* <Searchbar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search conversations..."
          mode='bar'
          iconColor={theme == 'dark' ? light : appDark}
          style={{
            backgroundColor: theme == 'dark' ? black : ice
          }}
          inputStyle={{
            backgroundColor: transparent,
            fontFamily: 'Poppins-Regular'
          }}
        /> */}

        <FlashList
          data={conversationsToDisplay}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!loading) {
              dispatch(fetchConversations(false))
            }
          }}
          onEndReachedThreshold={0.5}
          estimatedItemSize={100}
        />
      </ThemedView>
    </PaperProvider>
  )
}