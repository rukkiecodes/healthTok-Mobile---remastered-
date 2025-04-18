import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { formatMessageTime } from '@/libraries/formatTime'
import { fetchConversations, searchConversations } from '@/store/actions/conversations'
import { accent, appDark, black, dark, ice, light, transparent } from '@/utils/colors'
import { db } from '@/utils/fb'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Appbar, PaperProvider, Searchbar, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

export default function conversations () {
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
        pathname: '/(app)/(chats)/[chatId]',
        params: { chatId: id, doctor: otherProfile?.uid }
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
            {/* <ThemedText>{formatMessageTime(createdAt)}</ThemedText> */}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Conversations" />
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20, gap: 20 }}>
        {/* Search input */}
        <Searchbar
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
        />

        <FlashList
          data={conversationsToDisplay}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            // Load more data when user reaches the end
            if (!loading) {
              dispatch(fetchConversations(false))
            }
          }}
          onEndReachedThreshold={0.5}  // Trigger fetching more when 50% of the list is visible
          estimatedItemSize={100}  // Adjust this based on the size of your list items
        />
      </ThemedView>
    </PaperProvider>
  )
}