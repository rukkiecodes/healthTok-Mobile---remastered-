import { Alert, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { Conversation } from '@/store/types/conversations';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '@/utils/fb';
import { Appbar, PaperProvider, TextInput } from 'react-native-paper';
import { accent, appDark, dark, light, red, transparent } from '@/utils/colors';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import HeadName from '@/components/doctorMessages/HeadName';
import { ThemedText } from '@/components/ThemedText';
import { FlashList } from '@shopify/flash-list';
import MessageBubble from '@/components/doctorMessages/MessageBubble';
import { getOtherParticipant } from '@/libraries/extractUID';
import { useConsultationTimer } from '@/libraries/parseConsultationDateTime';
import { checkAndEndConsultation } from '@/libraries/endConsultation';
import HapticWrapper from '@/components/Harptic';
import CustomImage from '@/components/CustomImage';

interface Message {
  id: string;
  userId: string
  message: string;
  createdAt: { seconds: number };
}

export default function ChatScreen () {
  const theme = useColorScheme()
  const { chatId }: any = useLocalSearchParams()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [conversationData, setConversationData] = useState<Conversation | null>(null)

  const [input, setInput] = useState<string | ''>('')
  const [textInput, setTextInput] = useState<string | ''>('')

  const flashListRef = useRef<any>(null);

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

    const message = await addDoc(collection(db, 'chats', String(chatId), 'messages'), {
      createdAt: new Date(),
      userId: id,
      message: textInput,
      seen: false
    })

    await updateDoc(doc(db, 'chats', String(chatId)), {
      lastMessage: {
        message: textInput,
        messageId: message.id,
        createdAt: new Date(),
        userId: id,
      }
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
      String(conversationData?.appointmentsData?.patient?.uid),
      String(auth?.currentUser?.uid),
      String(conversationData?.appointmentsData?.id),
      conversationData?.appointmentsData
    );

    cuncludeAppointment(String(conversationData?.appointmentId))
  }

  const cuncludeAppointment = async (appointmentId: string) => {
    try {
      await setDoc(doc(db, 'patient', String(conversationData?.appointmentsData?.patient?.uid), 'concluded_appointments', appointmentId), {
        concluded: true,
        ...conversationData?.appointmentsData,
        concludedAt: serverTimestamp()
      })
      await setDoc(doc(db, 'doctors', String(conversationData?.appointmentsData?.doctor?.uid), 'concluded_appointments', appointmentId), {
        concluded: true,
        ...conversationData?.appointmentsData,
        concludedAt: serverTimestamp()
      })

      await updateDoc(doc(db, 'appointments', appointmentId), {
        concluded: true,
        concludedAt: serverTimestamp()
      })

      await deleteDoc(doc(db, 'patient', String(conversationData?.appointmentsData?.patient?.uid), 'appointments', appointmentId))
      await deleteDoc(doc(db, 'doctors', String(conversationData?.appointmentsData?.doctor?.uid), 'appointments', appointmentId))

      deleteChat()
    } catch (error) {
      console.group('Error cuncluding cunsoltation: ', error)
    }
  }

  const deleteChat = async () => {
    try {
      messages.forEach(async message => {
        await deleteDoc(doc(db, 'chats', chatId, 'messages', message.id))
      })

      await deleteDoc(doc(db, 'chats', chatId))
      router.back()
    } catch (error) {
      console.log('Error deleteing chats: ', error)
    }
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
            onPress={router.back}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_left.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          {conversationData && <HeadName participants={conversationData?.participants} />}
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
              pathname: '/(app)/(doctor)/(chats)/videoCall',
              params: { chatId }
            })}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CustomImage
              source={require('@/assets/images/icons/video_camera.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.05}
            />
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={!conversationData?.isAppointmentsOpen}
            onPress={() => router.push({
              pathname: '/(app)/(doctor)/(chats)/voiceCall',
              params: { chatId }
            })}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CustomImage
              source={require('@/assets/images/icons/phone_fill.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.05}
            />
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={!conversationData?.isAppointmentsOpen}
            onPress={() => bottomSheetRef.current?.expand()}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CustomImage
              source={require('@/assets/images/icons/dots_vertical.png')}
              contentFit='contain'
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
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
            participant={getOtherParticipant(conversationData?.participants, String(auth.currentUser?.uid))}
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
          marginBottom: 10,
          gap: 20
        }}
      >
        <TextInput
          value={input}
          mode='outlined'
          style={{ flex: 1, height: 40, backgroundColor: transparent }}
          // editable={conversationData?.isAppointmentsOpen}
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

        <HapticWrapper
          height={40}
          onPress={sendMessage}
          // disabled={!conversationData?.isAppointmentsOpen}
          style={{
            paddingHorizontal: 20,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme == 'dark' ? light : accent
          }}
        >
          <ThemedText type='body' font='Poppins-Medium' lightColor={light} darkColor={accent}>Send</ThemedText>
        </HapticWrapper>
      </View>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={[300]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing={false}
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flexGrow: 1,
            padding: 20,
            gap: 10
          }}
        >
          <HapticWrapper
            onPress={() => {
              endConsultion()
              bottomSheetRef.current?.close()
            }}
            height={40}
            haptic={false}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>End Consultation</ThemedText>
          </HapticWrapper>

          <HapticWrapper
            onPress={() => {
              router.push({
                pathname: '/(app)/(doctor)/(chats)/patientFile',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
              bottomSheetRef.current?.close()
            }}
            height={40}
            haptic={false}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Patient File</ThemedText>
          </HapticWrapper>

          <HapticWrapper
            onPress={() => {
              router.push({
                pathname: '/(app)/(doctor)/(chats)/note',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
              bottomSheetRef.current?.close()
            }}
            height={40}
            haptic={false}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Note</ThemedText>
          </HapticWrapper>

          <HapticWrapper
            onPress={() => {
              router.push({
                pathname: '/(app)/(doctor)/(chats)/(prescription)/sent',
                params: { chatId: String(chatId), conversationData: JSON.stringify(conversationData) }
              })
              bottomSheetRef.current?.close()
            }}
            height={40}
            haptic={false}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Medium' lightColor={accent} darkColor={dark}>Prescription</ThemedText>
          </HapticWrapper>
        </BottomSheetView>
      </BottomSheet>
    </PaperProvider>
  )
}