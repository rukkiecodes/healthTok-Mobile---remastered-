import { View, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, Divider, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, blue, light } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import HapticWrapper from '@/components/Harptic'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'

const { width } = Dimensions.get('window')

export default function pricing () {
  const theme = useColorScheme()

  const { profile } = useSelector((state: RootState) => state.doctorProfile)

  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState<string>(profile?.price || '')

  function calculateTenPercent (value: string): number {
    return parseFloat(value) * 0.1;
  }

  function calculateRemainderAfterTenPercent (value: string): number {
    return parseFloat(value) - (parseFloat(value) * 0.1);
  }

  const savePrice = async () => {
    if (!price) return

    try {
      setLoading(true)

      await updateDoc(doc(db, 'doctors', String(auth.currentUser?.uid)), {
        price: parseFloat(price)
      })

      alert('Hourly Pricing saved successfuly')

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('Error saving price: ', error)
    }
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle'>Pricing</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 40 }}>
              <View style={{ gap: 10 }}>
                <ThemedText type='subtitle'>Change hourly rate</ThemedText>
                <ThemedText type='body'>Please input your hourly charge for consultations</ThemedText>
                <ThemedText type='body' lightColor={blue}>Your profile rate: $25.00/hr</ThemedText>
              </View>

              <View style={{ gap: 20 }}>
                <View style={{ gap: 10 }}>
                  <ThemedText type='default' font='Poppins-Bold'>Hourly Rate</ThemedText>
                  <ThemedText type='body' font='Poppins-Medium'>Total amount the client will see</ThemedText>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: (width / 2) + 100,
                      gap: 10
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: 50,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: `${theme == 'dark' ? light : appDark}33`,
                        gap: 10
                      }}
                    >
                      <View style={{
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <ThemedText type='body'>$</ThemedText>
                      </View>

                      <TextInput
                        value={price}
                        placeholder='Price'
                        onChangeText={text => setPrice(text)}
                        placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                        style={{
                          flex: 1,
                          height: 50,
                          fontFamily: 'Poppins-Medium',
                          color: theme == 'dark' ? light : appDark
                        }}
                      />
                    </View>

                    <ThemedText>/hr</ThemedText>
                  </View>
                </View>

                <Divider />

                <View style={{ gap: 10 }}>
                  <ThemedText type='default' font='Poppins-Bold'>10% Healthtok Service Fee</ThemedText>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: (width / 2) + 100,
                      gap: 10
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: 50,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: `${theme == 'dark' ? light : appDark}33`,
                        gap: 10
                      }}
                    >
                      <View style={{
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <ThemedText type='body'>$</ThemedText>
                      </View>

                      <TextInput
                        value={JSON.stringify(calculateTenPercent(price || '0'))}
                        placeholder='Fee'
                        placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                        editable={false}
                        style={{
                          flex: 1,
                          opacity: 0.8,
                          height: 50,
                          fontFamily: 'Poppins-Medium',
                          color: theme == 'dark' ? light : appDark
                        }}
                      />
                    </View>

                    <ThemedText>/hr</ThemedText>
                  </View>
                </View>

                <Divider />

                <View style={{ gap: 10 }}>
                  <ThemedText type='default' font='Poppins-Bold'>Amount You’ll Recieve</ThemedText>
                  <ThemedText type='body' font='Poppins-Medium'>The estimated amount you’ll recieve after service fees</ThemedText>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: (width / 2) + 100,
                      gap: 10
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: 50,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: `${theme == 'dark' ? light : appDark}33`,
                        gap: 10
                      }}
                    >
                      <View style={{
                        width: 50,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <ThemedText type='body'>$</ThemedText>
                      </View>

                      <TextInput
                        value={JSON.stringify(calculateRemainderAfterTenPercent(price || '0'))}
                        placeholder='Total'
                        editable={false}
                        placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                        style={{
                          flex: 1,
                          height: 50,
                          fontFamily: 'Poppins-Medium',
                          color: theme == 'dark' ? light : appDark
                        }}
                      />
                    </View>

                    <ThemedText>/hr</ThemedText>
                  </View>
                </View>
              </View>
            </ScrollView>

            <HapticWrapper
              onPress={savePrice}
              style={{
                backgroundColor: accent,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                borderRadius: 50,
                height: 50,
                margin: 20
              }}
            >
              {loading && <ActivityIndicator color={light} size={16} />}
              <ThemedText type='body' font='Poppins-Bold' lightColor={light}>Save</ThemedText>
            </HapticWrapper>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}