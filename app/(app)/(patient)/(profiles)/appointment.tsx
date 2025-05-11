import { ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Appbar, Divider, Modal, PaperProvider, Portal } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setAppointment, setDoctorProfile } from '@/store/slices/appointmentSlice'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { convertUSDToNGN } from '@/libraries/convertUSDToNGN';
import { formatCurrency } from '@/libraries/formatMoney'
import { WebView } from 'react-native-webview';
import Rating from '@/components/home/Rating'
import Address from '@/components/profile/Address'
import { getOrCreateChat } from '@/libraries/getOrCreateChat'
import HapticWrapper from '@/components/Harptic'


type DayObject = {
  day: number;
  dayName?: string;
  month: string;
  year: number;
};

interface PaymentProp {
  reference?: string
  status?: string
}


export default function appointment () {
  const webviewRef = useRef(null);
  const theme = useColorScheme()
  const { doctorUID }: any = useLocalSearchParams()
  const dispatch = useDispatch()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const successBottomSheetRef = useRef<BottomSheet>(null)

  const { doctorProfile, selectedDate, selectedTime, appointment }: any = useSelector((state: RootState) => state.appointment)
  const { profile }: any = useSelector((state: RootState) => state.patientProfile)

  const [startPayment, setStartPayment] = useState(false)
  const [dateString, setDateString] = useState(null)
  const [amount, setAmount] = useState(calculateTotal(doctorProfile?.price))
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  function convertToFormattedDateString (obj: DayObject): string | null {
    const fullMonthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthIndex = fullMonthNames.findIndex(
      (m) => m.toLowerCase() === obj.month.toLowerCase()
    );

    if (monthIndex === -1) {
      console.warn("Invalid month name:", obj.month);
      return null;
    }

    const date = new Date(obj.year, monthIndex, obj.day);

    // Format: "Thursday, Jul 24, 2024"
    const formatted = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return formatted;
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

  const htmlContent = `
    <meta name="viewport" content="width=device-width">
    <html>
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body onload="payWithPaystack()">
        <script>
          function payWithPaystack(){
            var handler = PaystackPop.setup({
              key: 'pk_test_514af104c122b28a6581b6d5371ca893a82c0c98',
              email: '${String(auth.currentUser?.email)}',
              amount: ${convertedAmount * 100},
              currency: 'NGN',
              callback: function(response){
                window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', reference: response.reference }));
              },
              onClose: function(){
                window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancelled' }));
              }
            });
            handler.openIframe();
          }
        </script>
      </body>
    </html>
  `;

  const dataToSave: any = {
    doctor: doctorProfile,
    patient: profile,
    appointment: {
      appointment,
      selectedTime,
      selectedDate
    },
    timestamp: serverTimestamp()
  }

  const proccessPayment = async (event: any) => {
    const data: PaymentProp = JSON.parse(event.nativeEvent.data);

    if (data?.status != 'success') return

    setStartPayment(false)
    successBottomSheetRef.current?.expand()

    const { id } = await addDoc(collection(db, 'patient', String(auth.currentUser?.uid), 'transactions'), { ...dataToSave, transaction: data })

    await setDoc(doc(db, 'patient', String(auth.currentUser?.uid), 'appointments', id), { ...dataToSave, transaction: data, })
    await setDoc(doc(db, 'doctors', String(doctorProfile?.id), 'appointments', id), { ...dataToSave, transaction: data, })
  }

  const startChatWithDoctor = async () => {
    try {
      const userId: any = auth.currentUser?.uid;

      const chatRef = await getOrCreateChat(
        userId,
        String(doctorProfile?.id),
        dataToSave,
        doctorProfile,
        profile
      );

      router.push({
        pathname: '/(app)/(patient)/(chats)/[chatId]',
        params: { chatId: chatRef.id },
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setLoading(false);
    }
  }





  useEffect(() => {
    (() => {
      const input: any = { ...selectedDate };
      const result: any = convertToFormattedDateString(input);
      setDateString(result)
    })()
  }, [doctorUID, selectedDate])

  useEffect(() => {
    (async () => {
      const money: any = await convertUSDToNGN(amount)
      setConvertedAmount(money)
    })()
  }, []);

  function calculateTenPercent (value: number): number {
    return value * 0.1;
  }

  function calculateTotal (value: number): number {
    return value + calculateTenPercent(value)
  }

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={startPayment}
          onDismiss={() => setStartPayment(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            height: 600,
            borderRadius: 20,
            overflow: 'hidden'
          }}
        >
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            onMessage={proccessPayment}
            startInLoadingState
            style={{ flex: 1 }}
          />
        </Modal>
      </Portal>

      <Appbar.Header
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme == 'dark' ? appDark : light,
        }}
      >
        <TouchableOpacity
          onPress={() => router.dismissTo('/(app)/(patient)/(tabs)/home')}
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
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
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

              {doctorProfile && <Rating item={doctorProfile} />}
            </ThemedView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 5,
                maxWidth: 300
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

              <Address item={doctorProfile} />
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

            <ThemedText>{dateString || ''} | {selectedTime?.time || ''}</ThemedText>
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
              <ThemedText>{formatCurrency(doctorProfile?.price)}</ThemedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ThemedText>Admin Fee</ThemedText>
              <ThemedText>{formatCurrency(calculateTenPercent(doctorProfile?.price))}</ThemedText>
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
              <ThemedText font='Poppins-Bold' lightColor={accent}>{formatCurrency(calculateTotal(doctorProfile?.price))}</ThemedText>
            </View>
          </View>
        </View>
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
          <ThemedText type='subtitle' font='Poppins-Bold'>{formatCurrency(amount)}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStartPayment(true)}
          disabled={!convertedAmount}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: accent,
            borderRadius: 20,
            height: 50,
            opacity: convertedAmount ? 1 : 0.6
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
        <BottomSheetScrollView contentContainerStyle={{ gap: 20, padding: 20 }}>
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
                  backgroundColor: appointment?.reason == item ? `${accent}33` : transparent,
                  borderRadius: 20,
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


      <BottomSheet
        index={-1}
        ref={successBottomSheetRef}
        snapPoints={[500]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing={false}
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            padding: 40
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: `${accent}33`,
              borderRadius: 100
            }}
          >
            <Image
              source={require('@/assets/images/icons/check.png')}
              style={{
                width: 80,
                height: 80,
                tintColor: accent
              }}
            />
          </View>
          <ThemedText type='title' font='Poppins-Bold' darkColor={appDark}>Payment  Success</ThemedText>

          <ThemedText type='default' font='Poppins-Regular' opacity={0.5} darkColor={appDark} style={{ textAlign: 'center' }}>
            Your payment has been successful, you can have a consultation session with your trusted doctor
          </ThemedText>

          <HapticWrapper
            onPress={() => startChatWithDoctor()}
            style={{
              paddingHorizontal: 40,
              height: 50,
              backgroundColor: accent,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ThemedText type='body' font='Poppins-Bold' lightColor={light}>Chat Doctor</ThemedText>
          </HapticWrapper>
        </BottomSheetView>
      </BottomSheet>
    </PaperProvider>
  )
}