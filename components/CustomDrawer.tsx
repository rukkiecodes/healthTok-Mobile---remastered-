import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useDrawer } from '@/context/DrawerContext';
import { ThemedView } from "@/components/ThemedView";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { accentDark, appDark, dark, faintAccent, grey, light, red, transparent } from "@/utils/colors";
import { router } from "expo-router";
import { SCREEN_WIDTH } from '@/constants/Screen';
import { Appbar } from 'react-native-paper';
import { useAuth } from '@/context/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setSignupObject } from '@/features/userSlice';
import { RootState } from '@/utils/store';

const CustomDrawer = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, closeDrawer } = useDrawer();
  const translateX = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const colorScheme = useColorScheme();
  const { signOut }: any = useAuth()
  const dispatch = useDispatch()

  const { signupObject, profile } = useSelector((state: RootState) => state.user);

  const [buttons] = useState([
    {
      title: 'Hires/Bookings',
      class: 'both',
      icon: () => <Image
        source={require('@/assets/images/imgs/book.png')}
        tintColor={colorScheme === 'dark' ? light : grey}
        style={{ width: 20, height: 20 }}
      />,
      action: () => {
        closeDrawer()
        router.navigate('/(app)/(booking)/booking')
      }
    },
    {
      title: 'Reviews & Ratings',
      class: 'both',
      icon: () => <Image
        source={require('@/assets/images/imgs/star.png')}
        tintColor={colorScheme === 'dark' ? light : grey}
        style={{ width: 20, height: 20 }}
      />,
      action: () => {
        closeDrawer()
        router.navigate('/(app)/(reviews)/reviews')
      }
    },
    {
      title: 'Settings',
      class: 'both',
      icon: () => <Image
        source={require('@/assets/images/imgs/cog.png')}
        tintColor={colorScheme === 'dark' ? light : grey}
        style={{ width: 20, height: 20 }}
      />,
      action: () => {
        closeDrawer()
        router.navigate('/(app)/(profile)/edit')
      }
    }
  ]);

  const logoutUser = async () => {
    await signOut();
  }

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <ThemedView style={styles.container}>
      {/** Main content */}
      <View style={styles.content}>
        {children}
      </View>

      {/** Drawer overlay */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <BlurView intensity={50} tint={'dark'} style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: colorScheme == 'dark' ? '#0E0D13' : '#5D5D5D' },
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={[styles.drawerContent, { backgroundColor: colorScheme == 'dark' ? appDark : light }]}>
          <Appbar.Header mode='small' style={{ backgroundColor: transparent }}>
            <View />
          </Appbar.Header>

          <TouchableOpacity
            onPress={() => {
              closeDrawer()
              router.navigate('/(app)/(profile)/profile')
            }}
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Image
                source={profile?.photoURL}
                placeholder={require('@/assets/images/imgs/johnDoe.png')}
                transition={1000}
                placeholderContentFit='cover'
                contentFit='cover'
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50
                }}
              />


              <View>
                <ThemedText type='body' font='Poppins-Bold'>{profile?.fullName}</ThemedText>
                <ThemedText style={{ opacity: 0.6 }}>{profile?.joiningAs == 'artisan' ? profile?.artisanType : 'My Account'}</ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flexGrow: 1,
              backgroundColor: colorScheme == 'dark' ? appDark : light,
            }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
          >
            <TouchableOpacity
              onPress={() => {
                closeDrawer()
                router.navigate('/(app)/(tabs)/home')
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10
              }}
            >
              <Image
                source={require('@/assets/images/imgs/home.png')}
                tintColor={colorScheme === 'dark' ? light : grey}
                style={{ width: 20, height: 20 }}
              />

              <ThemedText type={'body'} style={{ marginLeft: 15, color: colorScheme === 'dark' ? light : dark, }}>Home</ThemedText>
            </TouchableOpacity>

            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.action}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10
                }}
              >
                {button.icon()}
                <ThemedText type={'body'} style={{ marginLeft: 15, color: colorScheme === 'dark' ? light : dark, }}>
                  {button.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ padding: 20 }}>
            <TouchableOpacity
              onPress={() => {
                logoutUser()
                setTimeout(() => {
                  router.navigate('/(auth)/join')
                  dispatch(
                    setSignupObject({
                      ...signupObject,
                      joiningAs: 'artisan'
                    })
                  )
                }, 2000)
              }}
              style={{
                marginBottom: 20,
                backgroundColor: colorScheme == 'dark' ? accentDark : faintAccent,
                padding: 10,
                borderRadius: 10,
                gap: 5
              }}
            >
              <ThemedText type='body' font='Poppins-Bold'>Create Artizan Account</ThemedText>
              <ThemedText>Create an artizan account so you too can be found</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logoutUser}
              style={{
                backgroundColor: red,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: 50,
                paddingHorizontal: 20,
                gap: 20,
                borderRadius: 10
              }}
            >
              <Image
                source={require('@/assets/images/imgs/logout.png')}
                tintColor={light}
                style={{ width: 20, height: 20 }}
              />
              <ThemedText lightColor={light}>Log Out</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1, // Ensures the main content occupies the screen
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.7
  },
  drawerContent: {
    flex: 1
  },
});


export default CustomDrawer