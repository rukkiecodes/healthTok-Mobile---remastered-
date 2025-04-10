import { View, Platform, UIManager, ViewProps, Pressable, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/types';
import { AntDesign } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { setConversationId, setConversationObject, setInvoice } from '@/features/conversationSlice';
import { Image } from 'expo-image';
import moment from 'moment';
const { width } = Dimensions.get('window')
import { Audio } from 'expo-av';
import { useBottomSheet } from '@/context/BottomSheetContext';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';
import { ThemedView } from '../ThemedView';
import { accentLight, accentLighter, appDark, dark, light, offWhite } from '@/utils/colors';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

export type MessageProps = ViewProps & {
  messages?: {
    reply?: {
      mediaType?: string;
      media?: string;
      voiceNote?: string;
      caption?: string;
      message?: string;
    };
    message?: string;
    timestamp?: {
      seconds?: any
      nanoseconds?: any
    };
    seen?: boolean;
    mediaType?: string;
    media?: string;
    caption?: string;
    thumbnail?: string;
    invoice?: {
      documentId?: number;
      items?: object[];
      totalVAT?: string;
      finalPrice?: string;
    };
    accepted?: boolean;
    messageType?: string;
    photoURL?: string;
    coordinates: {
      latitude?: number;
      longitude?: number;
    };
    audioURL?: string
    audiLink?: string
    audioName?: string
  };
  matchDetails?: {
    id?: string
  };
  sender?: string;
  conversationId?: string;
}

const MessageBubble = ({
  messages,
  matchDetails,
  sender,
  conversationId
}: MessageProps) => {
  const { openSheet } = useBottomSheet()
  const colorScheme = useColorScheme();

  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const audioFile = messages?.audioURL

    try {
      if (!sound) {
        console.log('Loading Sound');
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioFile },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);
      } else {
        const status: any = await sound.getStatusAsync();

        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [messages]);

  const openPreviewDocumentSheet = async () => {
    if (Platform.OS === 'android') {
      const pdfUrl: any = messages?.photoURL;

      Linking.openURL(pdfUrl).catch((error) => {
        console.error('Error opening PDF in browser:', error);
        Alert.alert('Error', 'Could not open PDF in the browser.');
      });
    } else if (Platform.OS === 'ios') {
      // On iOS, open the PDF in a WebView
      openSheet(() => (
        <ThemedView style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ uri: messages?.photoURL }}
            style={{ flex: 1 }}
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          />
        </ThemedView>
      ), '80%', false);
    }
  }

  const TimeStamp = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: sender == user?.uid ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          gap: 5
        }}
      >
        {
          sender != user?.uid &&
          <>
            <ThemedText type='caption' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
              {messages?.seen ? 'Read' : 'Sent'}
            </ThemedText>

            <ThemedText type='caption' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}> | </ThemedText>
          </>
        }

        <ThemedText type='caption' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
          {moment(messages?.timestamp?.seconds * 1000).startOf('hour').fromNow()}
        </ThemedText>

        {
          sender == user?.uid &&
          <>
            <ThemedText type='caption' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}> - </ThemedText>

            <ThemedText type='caption' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
              {messages?.seen ? 'Read' : 'Sent'}
            </ThemedText>
          </>
        }
      </View>
    )
  }

  return (
    <Pressable
      style={{
        flexDirection: sender == user?.uid ? 'row-reverse' : 'row',
        marginBottom: 10
      }}
    >
      <View
        style={{
          alignSelf: sender == user?.uid ? 'flex-end' : 'flex-end',
          maxWidth: '80%',
          marginRight: 5
        }}
      >
        {
          messages?.messageType == 'text' &&
          <View>
            <View
              style={{
                minWidth: 120,
                paddingHorizontal: 10,
                paddingTop: 10,
                paddingBottom: 5,
                borderTopRightRadius: 20,
                borderBottomRightRadius: sender == user?.uid ? 0 : 20,
                borderBottomLeftRadius: sender == user?.uid ? 20 : 0,
                borderTopLeftRadius: 20,
                backgroundColor: sender == user?.uid ? accentLight : (colorScheme == 'dark' ? dark : offWhite)
              }}
            >
              <ThemedText type='body' style={{ textAlign: 'left', color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                {messages?.message}
              </ThemedText>


              <TimeStamp />
            </View>
          </View>
        }


        {
          messages?.mediaType == 'invoice' &&
          <Pressable
            onPress={() => {
              dispatch(setConversationId(String(matchDetails?.id)))
              dispatch(setConversationObject({ ...matchDetails }))
              dispatch(setInvoice(messages))

              // router.navigate("/(previewInvoice)/conversation")
            }}
            style={{
              paddingTop: 10,
              paddingHorizontal: 10,
              borderTopRightRadius: 20,
              borderBottomRightRadius: sender == user?.uid ? 0 : 20,
              borderBottomLeftRadius: sender == user?.uid ? 20 : 0,
              borderTopLeftRadius: 20,
              backgroundColor: sender == user?.uid ? accentLight : (colorScheme == 'dark' ? dark : offWhite)
            }}
          >
            <View
              style={{
                borderRadius: 15,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: 10
              }}
            >
              <Image
                source={require('@/assets/images/imgs/document-normal.png')}
                tintColor={sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)}
                style={{
                  width: 30,
                  height: 30
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                  gap: 10
                }}
              >
                <View>
                  <ThemedText type='body' font='Poppins-Black' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                    Invoice #{messages?.invoice?.documentId}
                  </ThemedText>
                  <ThemedText type='body' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                    {messages?.invoice?.items?.length} {messages?.invoice?.items?.length == 1 ? 'Item' : 'Items'}
                  </ThemedText>
                </View>

                <View
                  style={{
                    width: 1,
                    height: 30,
                    backgroundColor: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)
                  }}
                />

                <View>
                  <ThemedText type='body' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                    Tax: {messages?.invoice?.totalVAT}
                  </ThemedText>
                  <ThemedText type='body' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                    Total: {messages?.invoice?.finalPrice}
                  </ThemedText>
                </View>
              </View>
            </View>


            {
              messages?.accepted &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10
                }}
              >
                <AntDesign name="check" size={18} color={sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)} />
                <ThemedText type='body' style={{ color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>{messages?.accepted ? 'Accepted' : 'Not yet Accepted'}</ThemedText>
              </View>
            }

            <TimeStamp />
          </Pressable>
        }

        {
          messages?.mediaType == 'image' &&
          <View
            style={{
              width: width / 1.5,
              borderTopRightRadius: 20,
              borderBottomRightRadius: sender == user?.uid ? 0 : 20,
              borderBottomLeftRadius: sender == user?.uid ? 20 : 0,
              borderTopLeftRadius: 20,
              backgroundColor: sender == user?.uid ? accentLight : (colorScheme == 'dark' ? dark : offWhite)
            }}
          >
            <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
              <Image
                source={messages?.photoURL}
                contentPosition='left center'
                style={{
                  width: (width / 1.5) - 20,
                  height: (width / 2) - 50,
                  borderRadius: 15
                }}
              />
            </View>

            {
              messages?.message ?
                <View style={{ padding: 10 }}>
                  <ThemedText type='body' style={{ textAlign: 'left', color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                    {messages?.message}
                  </ThemedText>

                  <TimeStamp />
                </View> :
                <View style={{ padding: 10 }}>
                  <TimeStamp />
                </View>
            }
          </View>
        }

        {
          messages?.mediaType == 'audio' &&
          <View
            style={{
              width: 'auto',
              borderTopRightRadius: 20,
              borderBottomRightRadius: sender == user?.uid ? 0 : 20,
              borderBottomLeftRadius: sender == user?.uid ? 20 : 0,
              borderTopLeftRadius: 20,
              backgroundColor: sender == user?.uid ? accentLight : (colorScheme == 'dark' ? dark : offWhite),
              paddingHorizontal: 10,
              paddingTop: 10
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                backgroundColor: sender == user?.uid ? accentLighter : (colorScheme == 'dark' ? appDark : light),
                borderRadius: 15,
                padding: 10
              }}
            >
              <TouchableOpacity
                onPress={playSound}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={
                    isPlaying
                      ? require('@/assets/images/imgs/pause.png')
                      : require('@/assets/images/imgs/play.png')
                  }
                  tintColor={sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)}
                  style={{
                    width: 20,
                    height: 20
                  }}
                />
              </TouchableOpacity>

              <Image
                source={require('@/assets/images/imgs/sound.png')}
                tintColor={sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)}
                style={{
                  width: 100,
                  height: 30
                }}
              />
            </View>

            <View style={{ paddingVertical: 10, paddingHorizontal: 10, width: 180, alignSelf: 'flex-end' }}>
              {
                messages?.audioName &&
                <ThemedText type='body' style={{ textAlign: sender == user?.uid ? 'right' : 'left', color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                  {messages?.audioName}
                </ThemedText>
              }
              {
                messages?.message &&
                <ThemedText type='body' style={{ textAlign: 'left', color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark) }}>
                  {messages?.message}
                </ThemedText>
              }

              <TimeStamp />
            </View>
          </View>
        }

        {
          messages?.mediaType == 'document' &&
          <View
            style={{
              width: width / 1.5,
              borderTopRightRadius: 20,
              borderBottomRightRadius: sender == user?.uid ? 0 : 20,
              borderBottomLeftRadius: sender == user?.uid ? 20 : 0,
              borderTopLeftRadius: 20,
              backgroundColor: sender == user?.uid ? accentLight : (colorScheme == 'dark' ? dark : offWhite)
            }}
          >
            {
              Platform.OS != 'android' &&
              <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Image
                  source={{ uri: messages?.photoURL }}
                  style={{
                    width: (width / 1.5) - 20,
                    height: (width / 2) - 50,
                    borderRadius: 15,
                  }}
                />
              </View>
            }

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexWrap: 'nowrap',
                paddingVertical: 10,
                paddingHorizontal: 10,
                gap: 10
              }}
            >
              <Image
                source={require('@/assets/images/imgs/document.png')}
                tintColor={sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark)}
                style={{
                  width: 30,
                  height: 30
                }}
              />
              <TouchableOpacity onPress={openPreviewDocumentSheet}>
                {
                  messages?.message &&
                  <View
                    style={{ width: (width / 1.5) - 60 }}>
                    <ThemedText
                      type='body'
                      style={{
                        textAlign: 'left',
                        color: sender == user?.uid ? light : (colorScheme == 'dark' ? light : dark),
                        textDecorationLine: 'underline'
                      }}
                    >
                      {messages?.message}
                    </ThemedText>

                    <TimeStamp />
                  </View>
                }
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    </Pressable>
  )
}

export default MessageBubble