import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentData, addDoc, serverTimestamp, updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/utils/fb'; // Assuming you have your Firestore db setup
import { FlashList } from '@shopify/flash-list'; // Make sure you install flash-list
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, PaperProvider, TextInput } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { accent, appDark, dark, light, red, transparent } from '@/utils/colors';
import MessageBubble from '@/components/messages/MessageBubble';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import Name from '@/components/messages/Name';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useConsultationTimer } from '@/libraries/parseConsultationDateTime';
import { checkAndEndConsultation } from '@/libraries/endConsultation';

interface Message {
  id: string;
  userId: string
  message: string;
  createdAt: { seconds: number };
}

interface Conversation { [key: string]: any }

export default function ChatScreen () {
  const theme = useColorScheme()
  const { chatId, doctor }: any = useLocalSearchParams()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [conversationData, setConversationData] = useState<Conversation | null>(null)

  const [input, setInput] = useState<string | ''>('')
  const [textInput, setTextInput] = useState<string | ''>('')

  const flashListRef = useRef<any>(null); // Ref for FlashList to scroll programmatically

  const fetchMessages = useCallback(async (initial: boolean) => {
    if (loading) return;

    setLoading(true);

    try {
      let q = query(
        collection(db, 'chats', String(chatId), 'messages'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (!initial && lastVisible) {
        q = query(q, startAfter(lastVisible)); // Fetch messages after the last one
      }

      const snapshot = await getDocs(q);
      const newMessages: Message[] = [];

      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });

      if (newMessages.length > 0) {
        setMessages((prevMessages) => (initial ? newMessages : [...newMessages, ...prevMessages]));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastDoc);
      } else {
        setHasMore(false); // No more messages to load
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, lastVisible, chatId]);

  useEffect(() => {
    fetchMessages(true); // Fetch initial messages on mount
  }, [fetchMessages]);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentOffsetY <= 0 && hasMore && !loading && contentHeight > layoutHeight) {
      fetchMessages(false); // Fetch more messages when scrolled to the top
    }
  };

  const scrollToBottom = () => {
    if (flashListRef.current) {
      flashListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    const id = auth.currentUser?.uid

    if (input == '') return

    setInput('')

    await addDoc(collection(db, 'chats', String(chatId), 'messages'), {
      createdAt: serverTimestamp(),
      userId: id,
      message: textInput,
      seen: false
    })

    updateSeen()
  }

  const updateSeen = async () => {
    const id = auth.currentUser?.uid

    const snapshot = await getDocs(query(collection(db, 'chats', String(chatId), 'messages'),
      where('userId', '!=', id),
      where('seen', '==', false)
    ))

    snapshot.forEach(async allDoc => {
      await updateDoc(doc(db, 'chats', String(chatId), 'messages', allDoc?.id), {
        seen: true
      })
    })
  }

  const getConversationData = async () => {
    const unsub = onSnapshot(doc(db, "chats", String(chatId)), (doc: any) => {
      setConversationData(doc.data())
    });

    return unsub
  }

  const endConsultion = async () => {
    const appointment = conversationData?.appointmentsData?.appointment;
    await checkAndEndConsultation(
      chatId,
      appointment,
      String(auth?.currentUser?.uid),
      String(conversationData?.appointmentsData?.doctor?.uid),
      String(conversationData?.appointmentsData?.id),
      conversationData?.appointmentsData
    );
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }

    getConversationData()
  }, [messages]);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  ), []);

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10
          }}
        >
          <TouchableOpacity
            onPress={() => router.dismissTo('/(app)/(patient)/(tabs)/home')}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_left.png')}
              style={{
                width: 25,
                height: 25,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <ThemedText type='default' font={'Poppins-Bold'}>{conversationData?.doctor?.name}</ThemedText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10
          }}
        >
          <TouchableOpacity
            // disabled={!conversationData?.isAppointmentsOpen}
            onPress={() => router.push({
              pathname: '/(app)/(patient)/(chats)/videoCall',
              params: { chatId }
            })}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/video_camera.png')}
              style={{
                width: 25,
                height: 25,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={!conversationData?.isAppointmentsOpen}
            onPress={() => router.push({
              pathname: '/(app)/(patient)/(chats)/voiceCall',
              params: { chatId }
            })}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/phone_fill.png')}
              style={{
                width: 25,
                height: 25,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!conversationData?.isAppointmentsOpen}
            onPress={() => bottomSheetRef.current?.expand()}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/dots_vertical.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
        </View>
      </Appbar.Header>

      <>
        {useConsultationTimer(conversationData?.appointmentsData?.appointment, chatId)}
      </>

      <View
        style={{
          margin: 20,
          borderWidth: 1.5,
          borderColor: theme == 'dark' ? `${light}33` : `${accent}33`,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}
      >
        <ThemedText
          type='subtitle'
          font='Poppins-Bold'
          lightColor={conversationData?.isAppointmentsOpen ? accent : red}
          darkColor={conversationData?.isAppointmentsOpen ? light : red}
        >
          Consultion Start
        </ThemedText>
        <ThemedText type='body' opacity={0.6}>You can consult your problem to the doctor</ThemedText>
      </View>

      <FlashList
        ref={flashListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            key={item.id}
            sender={item?.userId}
            messages={item}
            chatId={String(chatId)}
            doctor={String(doctor)}
          />
        )}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        inverted={true} // Invert list order to show messages from bottom to top
        onEndReachedThreshold={0.1}
        onScroll={handleScroll}
        estimatedItemSize={75}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          gap: 20
        }}
      >
        <TextInput
          value={input}
          mode='outlined'
          style={{ flex: 1, height: 50, backgroundColor: transparent }}
          editable={conversationData?.isAppointmentsOpen}
          onChangeText={(text: string) => {
            setInput(text)
            setTextInput(text)
          }}
          placeholder='Aa...'
          contentStyle={{
            fontFamily: 'Poppins-Regular'
          }}
          outlineStyle={{
            borderRadius: 50,
            borderWidth: 1.5,
            borderColor: theme == 'dark' ? `${light}33` : `${accent}33`,
            opacity: conversationData?.isAppointmentsOpen ? 1 : 0.6
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!conversationData?.isAppointmentsOpen}
          style={{
            height: 50,
            paddingHorizontal: 20,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme == 'dark' ? light : accent,
            opacity: conversationData?.isAppointmentsOpen ? 1 : 0.6
          }}
        >
          <ThemedText type='body' font='Poppins-Medium' lightColor={light} darkColor={accent}>Send</ThemedText>
        </TouchableOpacity>
      </View>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={[320]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing={false}
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 30,
            gap: 20
          }}
        >
          <TouchableOpacity
            onPress={() => endConsultion()}
            style={{
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>End Consultation</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/(app)/(patient)/(chats)/followUpNote',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
            }}
            style={{
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Follow-up care</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/(app)/(patient)/(chats)/(prescription)/injectables',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
            }}
            style={{
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Medications</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/(app)/(patient)/(chats)/reviews',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
            }}
            style={{
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Reviews</ThemedText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </PaperProvider>
  );
};