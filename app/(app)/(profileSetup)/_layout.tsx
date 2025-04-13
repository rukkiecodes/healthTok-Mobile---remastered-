import { router, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, black, dark, ice, light, transparent } from '@/utils/colors'
import { Appbar, Modal, PaperProvider, Portal } from 'react-native-paper'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setModal } from '@/store/slices/profileSlice'
import { Image } from 'expo-image'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch()
  const { setupTab, modal } = useSelector((state: RootState) => state.profile)

  const hideModal = () => dispatch(setModal(false))

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>Create Profile</ThemedText>
      </Appbar.Header>

      <ThemedView style={{ paddingHorizontal: 20 }}>
        <ThemedView
          darkColor={black}
          lightColor={ice}
          style={{
            borderRadius: 50,
            padding: 3,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => router.navigate('/(app)/(profileSetup)/patient')}
            style={{
              width: '50%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: setupTab == 'patient' ? (theme == 'dark' ? appDark : light) : transparent
            }}
          >
            <ThemedText font='Poppins-Bold'>Patient</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate('/(app)/(profileSetup)/doctor')}
            style={{
              width: '50%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: setupTab == 'doctor' ? (theme == 'dark' ? appDark : light) : transparent
            }}
          >
            <ThemedText font='Poppins-Bold' opacity={0.6}>Doctor</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <Portal>
        <Modal
          visible={modal}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 30,
            margin: 20,
            borderRadius: 50,
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedView
            lightColor={`${accent}23`}
            darkColor={`${appDark}23`}
            style={{
              width: 150,
              height: 150,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100
            }}
          >
            <Image
              source={require('@/assets/images/icons/check.png')}
              style={{
                tintColor: theme == 'dark' ? appDark : accent,
                width: 100,
                height: 100
              }}
            />
          </ThemedView>

          <ThemedText darkColor={dark} type='subtitle' font='Poppins-Bold' style={{ textAlign: 'center' }}>Success</ThemedText>
          <ThemedText darkColor={dark} type='body' opacity={0.6} style={{ textAlign: 'center' }}>Your account has been successfully registered</ThemedText>

          <TouchableOpacity
            onPress={hideModal}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: accent
            }}
          >
            <ThemedText lightColor={light}>Done</ThemedText>
          </TouchableOpacity>
        </Modal>
      </Portal>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      >
        <Stack.Screen name='patient' />
        <Stack.Screen name='doctor' />
      </Stack>
    </PaperProvider>
  )
}