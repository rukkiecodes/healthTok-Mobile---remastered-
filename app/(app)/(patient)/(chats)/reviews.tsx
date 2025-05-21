import { View, Alert, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Appbar, PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Image } from 'expo-image';
import { accent, appDark, light } from '@/utils/colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/fb';
import HapticWrapper from '@/components/Harptic';

export default function reviews () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()
  const parsParams = () => JSON.parse(conversationData)

  const [rating, setRating] = useState(0); // 1 to 5
  const [review, setReview] = useState('');

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a rating before submitting.");
      return;
    }

    await setDoc(doc(db, 'doctors', String(parsParams()?.appointmentsData?.doctor?.uid), 'ratings', String(auth.currentUser?.uid)), {
      rating,
      review,
      timestamp: serverTimestamp()
    })

    Alert.alert("Thank You", "Your review has been submitted!", [
      {
        text: 'Done',
        onPress: () => router.back()
      }
    ]);
    setRating(0);
    setReview('');
  };

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light }}>
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 40,
            height: 40,
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
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <ThemedText type='subtitle'>Rate Your Experience</ThemedText>

        <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color="#fbbf24" // amber-400
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          multiline
          value={review}
          onChangeText={setReview}
          placeholder="Write a review..."
          placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
          style={{
            borderColor: `${theme == 'dark' ? light : appDark}33`,
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            height: 120,
            textAlignVertical: 'top',
            marginBottom: 20,
            color: theme == 'dark' ? light : appDark,
            fontFamily: 'Poppins-Medium'
          }}
        />

        <HapticWrapper
          onPress={submitReview}
          haptic={false}
          style={{
            backgroundColor: accent, // your accent color
            padding: 15,
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          <ThemedText type='body' font='Poppins-Bold' lightColor={light}>Submit Review</ThemedText>
        </HapticWrapper>
      </ThemedView>
    </PaperProvider>
  )
}