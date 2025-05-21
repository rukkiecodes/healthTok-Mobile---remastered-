import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { accent, appDark, black, light, transparent } from '@/utils/colors';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native-paper';
import HapticWrapper from '@/components/Harptic';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/utils/fb';

export default function Faq () {
  const theme = useColorScheme()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      title: 'What is HealthTok?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'What is HealthTok?',
            answer: `HealthTok is a digital healthcare platform that connects patients with certified medical professionals. Whether you need a quick consultation, health advice, or a full appointment, HealthTok makes access to quality healthcare seamless and convenient.`
          })
        }
      })
    },
    {
      title: 'How do I book an appointment?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'How do I book an appointment?',
            answer: `To book an appointment, go to the "Appointments" section of the app, select your preferred doctor or specialist, choose a time slot that works for you, and confirm your booking. You’ll receive a notification with the details once it’s confirmed.`
          })
        }
      })
    },
    {
      title: 'How`d I sign up?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'How`d I sign up?',
            answer: `Signing up is simple. Tap on the "Sign Up" button on the welcome screen, provide your basic information such as name, email, phone number, and create a secure password. You can also sign up using your Google or Apple account.`
          })
        }
      })
    },
    {
      title: 'How do I subscribe to HealthTok package?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'How do I subscribe to HealthTok package?',
            answer: `To subscribe, head over to the "Subscriptions" tab in your profile. There, you can choose from our available healthcare plans. Select the one that fits your needs and proceed with payment. Once completed, your package will be activated immediately.`
          })
        }
      })
    },
    {
      title: 'How do I report an issue & dispute?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'How do I report an issue & dispute?',
            answer: `To report any issue or dispute, go to the "Support" section in the app and tap "Report a Problem." Fill out the form with details of your issue. Our support team will respond within 24-48 hours to help resolve your concern.`
          })
        }
      })
    },
    {
      title: 'What are the payment methods?',
      action: () => router.push({
        pathname: '/(app)/(doctor)/(faq)/answeres',
        params: {
          faq: JSON.stringify({
            question: 'What are the payment methods?',
            answer: `We support a variety of payment options including debit/credit cards, mobile money, and bank transfers. You can also securely store your payment method for quick access during future transactions.`
          })
        }
      })
    }
  ];

  const validateSendButton = () => {
    if (!email || !message) return false
    else return true
  }

  const sendMessage = async () => {
    try {
      setLoading(true)

      await addDoc(collection(db, 'questions'), {
        email,
        message,
        user: auth?.currentUser?.uid,
        collection: 'patient',
        timestamp: serverTimestamp()
      })

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('Error sending message: ', error)
    }
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 10 }}>
          {questions.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.action}
              style={{
                backgroundColor: theme == 'dark' ? black : `${accent}33`,
                height: 60,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <ThemedText type='body' font='Poppins-Medium'>{item.title}</ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText type='default' font='Poppins-Bold' style={{ textAlign: 'center', marginVertical: 40 }}>Got more questions, let us know</ThemedText>

        <View style={{ marginHorizontal: 20, gap: 20 }}>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            label={'Enter your email'}
            mode='outlined'
            outlineColor={theme == 'dark' ? light : accent}
            placeholder='Enter your email'
            style={{ backgroundColor: transparent }}
            outlineStyle={{
              borderRadius: 12,
              outlineColor: `${theme == 'dark' ? light : appDark}33`
            }}
          />

          <TextInput
            value={message}
            onChangeText={text => setMessage(text)}
            label={'Drop a message'}
            mode='outlined'
            outlineColor={theme == 'dark' ? light : accent}
            placeholder='Drop a message'
            style={{
              backgroundColor: transparent,
              minHeight: 100
            }}
            multiline
            numberOfLines={10}
            outlineStyle={{
              borderRadius: 12,
              outlineColor: `${theme == 'dark' ? light : appDark}33`
            }}
          />

          <HapticWrapper
            onPress={sendMessage}
            height={40}
            style={{
              backgroundColor: accent,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: (!validateSendButton() || loading) ? 0.6 : 1
            }}
          >
            <ThemedText lightColor={light} darkColor={light} type='body' font='Poppins-Bold'>Send</ThemedText>
          </HapticWrapper>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
