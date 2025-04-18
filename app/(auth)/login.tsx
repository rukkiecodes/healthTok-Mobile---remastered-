import { Input } from '@/components/auth/Input'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, dark, light } from '@/utils/colors'
import { auth, db } from '@/utils/fb'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { useState } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import Constants from "expo-constants";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { webClientId, iosClientId } = Constants.expoConfig?.extra?.expoPublic || {};

GoogleSignin.configure({
  webClientId: webClientId,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: iosClientId,
  googleServicePlistPath: '/GoogleService-Info.plist', // [iOS] The path to the GoogleService-Info.plist file in your project. This is used to configure the Google Sign-In SDK.
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

export default function login () {
  const theme = useColorScheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [peek, setPeek] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const googleAuth = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const { idToken }: any = result?.data;

      if (!idToken) {
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log('Error signing in', error);
    }
  }

  const signIn = async () => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
    }
    catch (error: any) {
      setLoading(false);

      switch (error.code) {
        case 'auth/user-not-found':
          alert('User not found')
          break;
        case 'auth/wrong-password':
          alert('Wrong password')
          break;
        case 'auth/invalid-email':
          alert('Invalid email')
          break;
        default:
          alert('Something went wrong')
          break;
      }
    }
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              tintColor: theme == 'dark' ? light : accent,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Login</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ marginTop: 50 }}>
              <Input
                value={email}
                updateValue={setEmail}
                label={'Enter your email'}
                left={require('@/assets/images/icons/mail.png')}
              />

              <Input
                gap={20}
                peek={peek}
                setPeek={setPeek}
                updateValue={setPassword}
                right={true}
                value={password}
                secureTextEntry={!peek}
                style={{ paddingRight: 50 }}
                label={'Enter your password'}
                left={require('@/assets/images/icons/lock.png')}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgotPassword')}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <ThemedText lightColor={accent} type='body'>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => signIn()}
              disabled={loading}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                backgroundColor: accent,
                width: '100%',
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 50,
                marginTop: 20,
              }}
            >
              {loading && <ActivityIndicator size={18} color={light} />}
              <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Login</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                gap: 10,
              }}
            >
              <ThemedText type='body'>Don’t have an account? </ThemedText>
              <ThemedText type='body' lightColor={accent}>Sign Up</ThemedText>
            </TouchableOpacity>

            <View
              style={{
                position: 'relative',
                marginVertical: 30,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: 1,
                  backgroundColor: `${accent}33`
                }}
              />

              <ThemedView
                style={{
                  position: 'absolute',
                  top: -8,
                  left: '47%',
                  paddingHorizontal: 10,
                }}
              >
                <ThemedText type='body' font='Poppins-Bold' opacity={0.6}>Or</ThemedText>
              </ThemedView>
            </View>

            <View style={{ gap: 20 }}>
              <TouchableOpacity
                onPress={() => googleAuth()}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                  borderWidth: 1,
                  borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
                  borderRadius: 50
                }}
              >
                <Image
                  source={require('@/assets/images/icons/google.png')}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                  }}
                />
                <ThemedText type='body' font='Poppins-Bold'>Sign in with Google</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                  borderWidth: 1,
                  borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
                  borderRadius: 50
                }}
              >
                <Image
                  source={require('@/assets/images/icons/apple.png')}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                    tintColor: theme == 'dark' ? light : dark
                  }}
                />
                <ThemedText type='body' font='Poppins-Bold'>Sign in with Apple</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                  borderWidth: 1,
                  borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
                  borderRadius: 50
                }}
              >
                <Image
                  source={require('@/assets/images/icons/facebook.png')}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                  }}
                />
                <ThemedText type='body' font='Poppins-Bold'>Sign in with Facebook</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}