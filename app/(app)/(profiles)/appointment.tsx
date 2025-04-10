import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Appbar, Divider, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setAppointment, setDoctorProfile } from '@/store/slices/appointmentSlice'
import { Paystack } from 'react-native-paystack-webview'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
const { width } = Dimensions.get('window')



export default function appointment () {
  const theme = useColorScheme()
  const { doctorUID } = useLocalSearchParams()
  const dispatch = useDispatch()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { doctorProfile, selectedDate, selectedTime, appointment } = useSelector((state: RootState) => state.appointment)

  const [startPayment, setStartPayment] = useState(false)

  const fetchDoctorProfile = async () => {
    const profile: any = (await getDoc(doc(db, 'users', String(doctorUID)))).data()
    dispatch(setDoctorProfile(profile))
  }

  const reasonsToSeeDoctor = [
    "Erectile Dysfunction",
    "Fever or Chills",
    "Persistent Headache",
    "High Blood Pressure",
    "Chest Pain",
    "Shortness of Breath",
    "Skin Rash or Irritation",
    "Allergic Reactions",
    "Back Pain",
    "Digestive Issues",
    "Unusual Fatigue",
    "Mental Health Concerns",
    "Anxiety or Depression",
    "Insomnia or Sleep Issues",
    "Menstrual Problems",
    "Urinary Tract Infections",
    "Sexually Transmitted Infections (STIs)",
    "Joint Pain or Swelling",
    "Diabetes Management",
    "Weight Management",
    "Follow-Up Appointment",
    "General Health Checkup",
    "Vaccinations",
    "Chronic Illness Monitoring",
    "Eye or Vision Problems",
    "Hearing Issues",
    "Contraception Advice",
    "Pregnancy Check-up",
    "Cold or Flu Symptoms",
    "Injury or Trauma",
    "Smoking Cessation Support"
  ]

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  ), []);





  useEffect(() => {
    fetchDoctorProfile()
  }, [doctorUID])

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

        <ThemedText type='subtitle' font='Poppins-Bold'>Doctor’s Details</ThemedText>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 20,
              overflow: 'hidden'
            }}
          >
            <Image
              source={doctorProfile?.displayImage ? doctorProfile?.displayImage?.image : doctorProfile?.profilePicture}
              contentFit='contain'
              style={{ width: 150, height: 150 }}
            />
          </TouchableOpacity>

          <View>
            <ThemedText type='subtitle' font='Poppins-Bold'>{doctorProfile?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Regular'>{doctorProfile?.specialization}</ThemedText>

            <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: `${accent}33`,
                alignSelf: 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 10,
                gap: 5,
                marginVertical: 10
              }}
            >
              <Image
                source={require('@/assets/images/icons/star.png')}
                contentFit='contain'
                style={{
                  width: 15,
                  height: 15,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />

              <ThemedText type='caption' style={{ marginTop: 5 }}>4,7</ThemedText>
            </ThemedView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Image
                source={require('@/assets/images/icons/location_marker.png')}
                contentFit='contain'
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 3,
                  tintColor: theme == 'dark' ? light : appDark
                }}
              />

              <ThemedText type='body' font='Poppins-Bold'>Benin City, Nigeria.</ThemedText>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ThemedText type='subtitle' font='Poppins-Bold'>Date</ThemedText>
            <TouchableOpacity onPress={router.back}>
              <ThemedText type='body' font='Poppins-Bold'>Change</ThemedText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 20,
              marginTop: 20
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
              }}
            >
              <Image
                source={require('@/assets/images/icons/calendar.png')}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </View>

            <ThemedText>Thursday, Jul 24, 2024| 10:00 AM</ThemedText>
          </View>
        </View>

        <Divider style={{ marginVertical: 40 }} />

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ThemedText type='subtitle' font='Poppins-Bold'>Reason</ThemedText>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
              <ThemedText type='body' font='Poppins-Bold'>Change</ThemedText>
            </TouchableOpacity>
          </View>

          {
            appointment?.reason &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20,
                marginTop: 20
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/edit_square.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: theme == 'dark' ? light : accent
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <ThemedText>{appointment?.reason}</ThemedText>
                <ThemedText lightColor={accent} type='body'>Optional</ThemedText>
              </View>
            </View>
          }
        </View>

        <Divider style={{ marginVertical: 40 }} />

        <View>
          <ThemedText type='subtitle' font='Poppins-Bold'>Payment Detail</ThemedText>

          <View style={{ gap: 10, marginTop: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ThemedText>Consultation</ThemedText>
              <ThemedText>$30.00</ThemedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ThemedText>Admin Fee</ThemedText>
              <ThemedText>$02.00</ThemedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ThemedText>Aditional Discount</ThemedText>
              <ThemedText>$0.00</ThemedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ThemedText font='Poppins-Bold'>Total</ThemedText>
              <ThemedText font='Poppins-Bold' lightColor={accent}>$32.00</ThemedText>
            </View>
          </View>
        </View>

        {startPayment && (
          <Paystack
            paystackKey="pk_test_514af104c122b28a6581b6d5371ca893a82c0c98"
            amount={'25000.00'}
            billingEmail="rukkiecodes@gmail.com"
            activityIndicatorColor="green"
            onCancel={() => { }}
            onSuccess={(res) => {
              console.log(res)
            }}
            autoStart={true}
          />
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          gap: 20
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: 100
          }}
        >
          <ThemedText type='default'>Total</ThemedText>
          <ThemedText type='subtitle' font='Poppins-Bold'>$32.00</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStartPayment(true)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: accent,
            borderRadius: 20,
            height: 50
          }}
        >
          <ThemedText lightColor={light} font='Poppins-Bold' type='body'>Book Apointment</ThemedText>
        </TouchableOpacity>
      </View>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={[500, 800]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing={false}
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView>
          {
            reasonsToSeeDoctor.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  dispatch(
                    setAppointment({ ...appointment, reason: item })
                  )
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
        </BottomSheetScrollView>
      </BottomSheet>
    </PaperProvider>
  )
}