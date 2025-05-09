import { View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, black, dark, light, transparent } from '@/utils/colors'
import { Image } from 'expo-image'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const { width } = Dimensions.get('window')

const moodCard = (width / 4) - 35

export default function home () {
  const theme = useColorScheme()

  const [selectedMood, setSelectedMood] = useState<any>(null)
  const [moods] = useState([
    {
      title: 'Happy',
      image: require('@/assets/images/images/mood/happy.png'),
      thingsToDo: [
        {
          label: 'Celebrate with friends',
          emoji: '🎉',
          description: 'Spending time with loved ones when you’re happy can amplify your joy and strengthen relationships. Share your good mood—it’s contagious!'
        },
        {
          label: 'Write in a gratitude journal',
          emoji: '📓',
          description: 'Writing down what you’re grateful for helps you acknowledge the positives in your life and can make those happy moments even more meaningful.'
        },
        {
          label: 'Dance it out',
          emoji: '💃',
          description: 'Movement and music are powerful mood boosters. Put on your favorite song and dance like nobody’s watching to release endorphins and keep the good vibes going.'
        },
      ],
    },
    {
      title: 'Sad',
      image: require('@/assets/images/images/mood/sad.png'),
      thingsToDo: [
        {
          label: 'Talk to someone',
          emoji: '🗣️',
          description: 'Opening up to a trusted friend, family member, or therapist can lighten emotional burdens and help you feel heard and supported.'
        },
        {
          label: 'Listen to calming music',
          emoji: '🎵',
          description: 'Soft, slow, or instrumental music can help ease your mind and gently lift your mood without overwhelming your emotions.'
        },
        {
          label: 'Write down your thoughts',
          emoji: '📝',
          description: 'Journaling is a safe space to process what you’re feeling. Getting it out on paper can help bring clarity and emotional relief.'
        }
      ],
    },

    {
      title: 'Okay',
      image: require('@/assets/images/images/mood/okay.png'),
      thingsToDo: [
        {
          label: 'Go for a walk',
          emoji: '🚶',
          description: 'A short walk, especially in nature, can refresh your mind and body, giving you a chance to breathe and reflect.'
        },
        {
          label: 'Read a book',
          emoji: '📖',
          description: 'Reading allows you to escape into another world, stimulate your mind, or simply enjoy some peaceful alone time.'
        },
        {
          label: 'Meditate',
          emoji: '🧘',
          description: 'Mindfulness or guided meditation can center your thoughts and help maintain emotional balance throughout the day.'
        }
      ],
    },

    {
      title: 'Angry',
      image: require('@/assets/images/images/mood/angry.png'),
      thingsToDo: [
        {
          label: 'Do some breathing exercises',
          emoji: '😮‍💨',
          description: 'Deep breathing helps activate your body’s calming response, lowering stress hormones and helping you feel more in control.'
        },
        {
          label: 'Take a timeout',
          emoji: '⏸️',
          description: 'Step away from the situation causing frustration. A short break can prevent escalation and give your mind space to reset.'
        },
        {
          label: 'Squeeze a stress ball',
          emoji: '🟣',
          description: 'Physical release of tension, like squeezing a stress ball, can help channel anger into something harmless and calming.'
        }
      ],
    },

    {
      title: 'Anxious',
      image: require('@/assets/images/images/mood/anxious.png'),
      thingsToDo: [
        {
          label: 'Try grounding techniques',
          emoji: '🪨',
          description: 'Grounding helps bring your focus to the present. Try the 5-4-3-2-1 method: identify things you can see, hear, touch, smell, and taste.'
        },
        {
          label: 'Drink a glass of water',
          emoji: '💧',
          description: 'Hydration supports your nervous system. Slowly sipping a glass of water can calm your body and give your mind a moment to reset.'
        },
        {
          label: 'Stretch or do yoga',
          emoji: '🧘‍♀️',
          description: 'Gentle stretching or yoga helps release built-up tension and calms the mind through movement and breath.'
        }
      ],
    },

    {
      title: 'Disappointed',
      image: require('@/assets/images/images/mood/disappointed.png'),
      thingsToDo: [
        {
          label: 'Reflect on what went wrong',
          emoji: '🤔',
          description: 'Taking time to reflect helps you identify what didn’t work and what can be learned. Growth often begins with honest reflection.'
        },
        {
          label: 'Talk to a friend',
          emoji: '📞',
          description: 'Speaking to someone you trust can lighten your emotional load and offer a new perspective or comforting support.'
        },
        {
          label: 'Watch a comfort show',
          emoji: '📺',
          description: `Revisiting a favorite movie or series can provide familiarity and emotional warmth when you're feeling low.`
        }
      ],
    },

    {
      title: 'Irritated',
      image: require('@/assets/images/images/mood/irritated.png'),
      thingsToDo: [
        {
          label: 'Listen to chill music',
          emoji: '🎧',
          description: 'Soothing music can help reduce mental friction and bring your mood to a more relaxed and manageable space.'
        },
        {
          label: 'Journal your feelings',
          emoji: '📓',
          description: 'Writing down your frustrations helps externalize them, making it easier to understand and address the root cause.'
        },
        {
          label: 'Go for a brisk walk',
          emoji: '🏃',
          description: 'Physical activity is a powerful tool for releasing pent-up energy and clearing a cluttered or frustrated mind.'
        }
      ],
    },

    {
      title: 'Loved',
      image: require('@/assets/images/images/mood/loved.png'),
      thingsToDo: [
        {
          label: 'Send a kind message',
          emoji: '💌',
          description: 'Spreading love to others can reinforce your own feeling of being loved and build deeper connections.'
        },
        {
          label: 'Give a hug',
          emoji: '🤗',
          description: 'A warm embrace releases oxytocin—the love hormone—which deepens your bond and makes everyone feel safer.'
        },
        {
          label: 'Do something nice for someone',
          emoji: '💖',
          description: 'Acts of kindness not only help others but also deepen your own sense of connection and appreciation.'
        }
      ],
    }
  ]);

  const selectMood = async (item: any) => {
    setSelectedMood(item)

    const currentDate = new Date().toDateString()

    await setDoc(doc(db, 'users', String(auth.currentUser?.uid), 'moods', String(currentDate)), {
      mood: item,
      createdAt: serverTimestamp()
    })
  }

  return (
    <ThemedView darkColor='' style={{ flex: 1, padding: 20 }}>
      <ThemedText type='title' font='Poppins-Bold'>Track Mood</ThemedText>

      <ThemedText type='subtitle' font='Poppins-Bold' style={{ marginTop: 20 }}>Today’s task</ThemedText>
      <View
        style={{
          gap: 20,
          backgroundColor: theme == 'dark' ? black : `${accent}33`,
          padding: 20,
          borderRadius: 20,
          marginTop: 20
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>How are you today?</ThemedText>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 20,
            backgroundColor: transparent
          }}
        >
          {
            moods.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectMood(item)}
                style={{
                  width: moodCard,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedMood?.title == item.title ? (theme == 'dark' ? appDark : accent) : transparent
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: (moodCard / 2) + 10,
                    height: (moodCard / 2) + 10
                  }}
                />

                <ThemedText type='body' font='Poppins-Medium' lightColor={selectedMood?.title == item.title ? light : appDark}>{item?.title}</ThemedText>
              </TouchableOpacity>
            ))
          }
        </View>
      </View>

      {
        !selectedMood ? (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: theme == 'dark' ? black : `${accent}33`,
                padding: 20,
                marginTop: 20,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 75,
                  height: 75,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('@/assets/images/icons/cup.png')}
                  style={{
                    width: 75,
                    height: 75
                  }}
                />
              </View>

              <View style={{ flex: 1, gap: 5 }}>
                <ThemedText type='subtitle'>Drink Enough Water</ThemedText>
                <ThemedText type='body'>
                  Most Professionals  suggest that you drink at least 4litres of water daily...
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme == 'dark' ? black : `${accent}33`,
                padding: 20,
                marginTop: 20,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 75,
                  height: 75,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('@/assets/images/icons/gym.png')}
                  style={{
                    width: 75,
                    height: 75
                  }}
                />
              </View>

              <View style={{ flex: 1, gap: 5 }}>
                <ThemedText type='subtitle'>Exercise Consistently</ThemedText>
                <ThemedText type='body'>
                  According to Healthtok, daily exercise will reduce the risk of certain sickness like...
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme == 'dark' ? black : `${accent}33`,
                padding: 20,
                marginTop: 20,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <View
                style={{
                  width: 75,
                  height: 75,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('@/assets/images/icons/books.png')}
                  style={{
                    width: 75,
                    height: 75
                  }}
                />
              </View>

              <View style={{ flex: 1, gap: 5 }}>
                <ThemedText type='subtitle'>Read more Books</ThemedText>
                <ThemedText type='body'>
                  Education is key to success. Books create medical enlightenment....
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {
              selectedMood.thingsToDo?.map((item: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: theme == 'dark' ? black : `${accent}33`,
                    padding: 20,
                    marginTop: 20,
                    borderRadius: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 20
                  }}
                >
                  <View
                    style={{
                      width: 75,
                      height: 75,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <ThemedText style={{ fontSize: 75 }}>{item?.emoji}</ThemedText>
                  </View>

                  <View style={{ flex: 1, gap: 5 }}>
                    <ThemedText type='subtitle'>{item?.label}</ThemedText>
                    <ThemedText type='body'>{item?.description}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            }
          </View>
        )
      }
    </ThemedView>
  )
}