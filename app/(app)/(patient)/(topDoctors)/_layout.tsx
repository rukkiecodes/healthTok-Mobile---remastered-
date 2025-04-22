import { router, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { appDark, light } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { useCallback, useRef } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'

export default function _layout () {
  const theme = useColorScheme()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const buttons = [
    'All',
    'Gynaecologists',
    'Geriatricians',
    'Dieticians',
    'Cardiologists',
    'Dentists',
    'Mood Tracker'
  ]

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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme == 'dark' ? appDark : light,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Top Doctors</ThemedText>

        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/dots_vertical.png')}
            contentFit='contain'
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      />

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={[350, 500]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 36,
            gap: 20
          }}
        >
          {
            buttons.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (item == 'Mood Tracker')
                    router.navigate('/(app)/(patient)/(moodTracker)/home')
                  else
                    router.push({
                      pathname: '/(app)/(patient)/(topDoctors)/doctor',
                      params: { item }
                    })
                  bottomSheetRef.current?.close()
                }}
                style={{
                  height: 50,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ThemedText type='body' font='Poppins-Regular' darkColor={appDark}>{item}</ThemedText>
              </TouchableOpacity>
            ))
          }
        </BottomSheetView>
      </BottomSheet>
    </PaperProvider>
  )
}