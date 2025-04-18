import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { RootState } from '@/store/types/types'
import { accent, appDark, dark, light, red } from '@/utils/colors'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Appbar, Divider, Modal, PaperProvider, Portal } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/fb'

export default function profile () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.profile)

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      console.log('✅ Logged out successfully');
    } catch (error) {
      console.log('❌ Error signing out:', error);
    }
  };

  return (
    <PaperProvider>
      <StatusBar style='light' />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: theme == 'dark' ? appDark : light,
            padding: 30,
            paddingVertical: 50,
            borderRadius: 30,
            margin: 30,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/logout.png')}
              contentFit='contain'
              style={{
                width: 50,
                height: 50,
                tintColor: theme == 'dark' ? light : accent
              }}
            />
          </View>

          <View style={{ gap: 20 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' style={{ textAlign: 'center' }} opacity={0.7}>Are you sure to log out of your account?</ThemedText>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: theme == 'dark' ? red : accent,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={light}>Log Out</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <ThemedView style={{ flex: 1, backgroundColor: accent, position: 'relative' }}>
        <View
          style={{
            height: 400,
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: theme == 'dark' ? appDark : light,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              position: 'relative'
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: theme == 'dark' ? appDark : light,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                overflow: 'hidden'
              }}
            >
              <Image
                source={profile?.displayImage ? profile?.displayImage?.image : (profile?.profilePicture ? profile?.profilePicture : require('@/assets/images/icons/profileFilled.png'))}
                placeholder={require('@/assets/images/icons/profileFilled.png')}
                contentFit='cover'
                placeholderContentFit='cover'
                transition={500}
                style={{
                  width: profile?.displayImage ? 100 : (profile?.profilePicture ? 100 : 80),
                  height: profile?.displayImage ? 100 : (profile?.profilePicture ? 100 : 80),
                  tintColor: profile?.displayImage ? null : (profile?.profilePicture ? null : (theme == 'dark' ? light : dark))
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: light,
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                position: 'absolute',
                bottom: 5,
                right: 5
              }}
            >
              <Image
                source={require('@/assets/images/icons/camera.png')}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: accent
                }}
              />
            </View>
          </View>

          <ThemedText type='subtitle' font='Poppins-Bold' lightColor={light}>{profile?.name}</ThemedText>
        </View>


        <ThemedView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 20,
            width: '100%',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/heart.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme == 'dark' ? light : appDark
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>My Saved</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/document.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme == 'dark' ? light : appDark
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>Appointmnet</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/wallet.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme == 'dark' ? light : appDark
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>Payment Method</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/chat.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme == 'dark' ? light : appDark
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>FAQs</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
            onPress={showModal}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: `${red}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/danger_circle.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: red
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium' darkColor={red} lightColor={red}>Logout</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </PaperProvider>
  )
}