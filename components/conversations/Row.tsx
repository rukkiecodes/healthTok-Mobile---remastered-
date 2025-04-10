import { View, ViewProps, Pressable } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';
import getUserId from '@/libraries/uid';
import getUserData from '@/libraries/getMatchedUserInfo';
import { db } from '@/utils/fb';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Avatar from './Avatar';
import Username from './Username';
import { ThemedText } from '../ThemedText';
import { router } from 'expo-router';
import moment from 'moment';
import { accentLight, amber, dark, light } from '@/utils/colors';

// Define the type for the item prop
interface Item {
  id?: string;
  photoURL: string;
  fullName: string;
  timestamp: { seconds: number };
  artisanType?: string;
  uid?: string;
  users?: any;
}

export type ConversationsRowProps = ViewProps & {
  item?: Item | any;
};

const Row: React.FC<ConversationsRowProps> = ({ item }) => {
  const accentButton = useThemeColor({ light: accentLight, dark: amber }, 'background');
  const accentButtonText = useThemeColor({ light: light, dark: dark }, 'text');

  const [matchedUserInfo, setMatchedUserInfo] = useState<{ id?: string } | null>(null)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [unreadMessage, setUnreadMessage] = useState<object[]>([])

  const function1 = async () => {
    let id = await getUserId()
    setMatchedUserInfo(getUserData(item?.users, id))
  }

  const function2 = async () => {
    let id = await getUserId()

    onSnapshot(query(collection(db, 'matches', item?.id, 'messages'), orderBy('timestamp', 'desc'), limit(1)),
      (snapshot: any) => {
        const mediaType = snapshot?.docs[0]?.data()?.mediaType ? snapshot?.docs[0]?.data()?.mediaType : snapshot?.docs[0]?.data()?.messageType
        const rawData = snapshot?.docs[0]?.data()
        setLastMessage(
          mediaType == 'image' ? (
            rawData?.userId == id ? { ...rawData, message: 'You sent an image' } : { ...rawData, message: 'You received an image' }
          ) :
            mediaType == 'text' ? rawData :

              mediaType == 'audio' ? (
                rawData?.userId == id ? { ...rawData, message: 'You sent an audio' } : { ...rawData, message: 'You received an audio' }
              ) :

                mediaType == 'invoice' ? (
                  rawData?.userId == id ? { ...rawData, message: 'You sent an invoice' } : { ...rawData, message: 'You received an invoice' }
                ) :

                  mediaType == 'document' ? (
                    rawData?.userId == id ? { ...rawData, message: 'You sent a document' } : { ...rawData, message: 'You received a document' }
                  ) : null
        )
      }
    )
  }

  const function3 = async () => {
    let id = await getUserId()

    onSnapshot(query(collection(db, 'matches', item?.id, 'messages'),
      where('userId', '!=', id),
      where('seen', '==', false)
    ),
      snapshot => {
        setUnreadMessage(
          snapshot?.docs?.map(doc => ({
            id: doc?.id
          }))
        )
      })
  }

  const navigateToMessages = () => {
    router.push({
      pathname: '/(app)/(messages)/conversation',
      params: {
        conversationIdParam: JSON.stringify(item?.id),
        conversationObjectParam: JSON.stringify(item)
      }
    })
  };

  useLayoutEffect(() => {
    function1()
    function2()
    function3()
  }, [item, db])

  return (
    <Pressable
      onPress={navigateToMessages}
      style={{
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        paddingVertical: 10
      }}
    >
      {matchedUserInfo && <Avatar user={matchedUserInfo?.id} />}

      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {matchedUserInfo && <Username user={matchedUserInfo?.id} />}

          {
            lastMessage &&
            <ThemedText type='caption' style={{ opacity: 0.6 }}>{moment((lastMessage?.timestamp?.seconds ? lastMessage?.timestamp?.seconds : new Date().toISOString()) * 1000).startOf('hour').fromNow()}</ThemedText>
          }
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <ThemedText type='caption' style={{ opacity: 0.6 }}>{lastMessage?.message || 'Say Hi!'}</ThemedText>

          {
            unreadMessage?.length >= 1 &&
            <View
              style={{
                backgroundColor: accentButton,
                height: 15,
                width: 15,
                borderRadius: 50,
                borderCurve: 'continuous',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ThemedText type='caption' style={{ color: accentButtonText }}>{unreadMessage?.length}</ThemedText>
            </View>
          }
        </View>
      </View>
    </Pressable>
  )
}

export default Row