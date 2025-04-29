import { View } from 'react-native'
import React from 'react'
import { auth } from '@/utils/fb';
import { accent, appDark, light } from '@/utils/colors';
import { ThemedText } from '../ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import Avatar from './Avatar';
import Name from './Name';
import { formatMessageTime } from '@/libraries/formatTime';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


interface MessageProps {
  messages: {
    message?: string;
    seen?: boolean;
    createdAt: any
  }
  sender: string
  chatId: string
  doctor: string
}

const MessageBubble = ({
  messages,
  sender,
  chatId,
  doctor
}: MessageProps) => {
  const theme = useColorScheme()

  return (
    <View
      style={{
        flexDirection: sender == auth.currentUser?.uid ? 'row-reverse' : 'row',
        marginBottom: 20
      }}
    >
      <View
        style={{
          alignSelf: sender == auth.currentUser?.uid ? 'flex-end' : 'flex-end',
          maxWidth: '70%',
          marginRight: 5
        }}
      >
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: sender == auth.currentUser?.uid ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10
            }}
          >
            <Avatar user={sender == auth.currentUser?.uid ? auth.currentUser?.uid : doctor} size={30} />

            {
              sender != auth.currentUser?.uid &&
              <View>
                <Name user={sender == auth.currentUser?.uid ? auth.currentUser?.uid : doctor} />
                <ThemedText type='caption' font='Poppins-Medium' opacity={0.6}>{formatMessageTime(messages?.createdAt)}</ThemedText>
              </View>
            }
          </View>


          <View
            style={{
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 5,
              borderTopRightRadius: sender == auth.currentUser?.uid ? 0 : 10,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: sender == auth.currentUser?.uid ? 10 : 0,
              backgroundColor: sender == auth.currentUser?.uid ? accent : (theme == 'dark' ? `${light}33` : `${accent}33`)
            }}
          >
            <ThemedText type='body' style={{ textAlign: 'left', color: sender == auth.currentUser?.uid ? light : (theme == 'dark' ? light : appDark) }}>
              {messages?.message}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}

export default MessageBubble