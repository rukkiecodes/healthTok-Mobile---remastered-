import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { router, useLocalSearchParams } from 'expo-router'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '@/components/ThemedText'
import { FlashList } from '@shopify/flash-list';
import { accent, appDark, black, dark, green, light, transparent } from '@/utils/colors'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import Rating from '@/components/home/Rating'
import { getDistanceFromLatLonInKm } from '@/libraries/distance'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const doctor = () => {
  const theme = useColorScheme()
  const { item } = useLocalSearchParams()
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { profile } = useSelector((state: RootState) => state.patientProfile)

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      let q;

      if (item === 'All') {
        q = query(collection(db, "doctors"), where("isApplicationSuccessful", "==", true), orderBy("createdAt", "desc"));
      } else {
        q = query(
          collection(db, "doctors"),
          where("isApplicationSuccessful", "==", true),
          where("specialization", "==", item),
          orderBy('name', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const docs: any[] = [];
      querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
      setDoctors(docs);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [item]);

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        {
          item != 'All' &&
          <View style={{ padding: 20 }}>
            <ThemedText type='title' font='Poppins-Bold'>{item}</ThemedText>
          </View>
        }

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <FlashList
            data={doctors}
            keyExtractor={(item) => item.id}
            estimatedItemSize={100}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/(app)/(patient)/(profiles)/doctorProfile',
                    params: { doctorUID: item.uid }
                  })
                }}
                style={{
                  backgroundColor: theme == 'dark' ? appDark : light,
                  shadowColor: dark,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                  padding: 20,
                  borderRadius: 30,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 20
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    source={item?.displayImage ? item?.displayImage?.image : item?.profilePicture}
                    placeholder={require('@/assets/images/images/avatar.png')}
                    placeholderContentFit='cover'
                    contentFit='contain'
                    style={{ width: 120, height: 120 }}
                  />
                </View>

                <View style={{ flex: 1, height: 100 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 20
                    }}
                  >
                    <View>
                      <ThemedText type='subtitle' font='Poppins-Bold'>{item?.name}</ThemedText>
                      <ThemedText type='body' font='Poppins-Medium'>{item?.specialization}</ThemedText>
                    </View>

                    <View
                      style={{
                        width: 15,
                        height: 15,
                        backgroundColor: green,
                        borderRadius: 50,
                        marginTop: 10
                      }}
                    />
                  </View>

                  <ThemedView
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 20
                    }}
                  >
                    <ThemedView
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backgroundColor: theme == 'dark' ? `${light}33` : `${accent}20`,
                        alignSelf: 'flex-start',
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 10,
                        gap: 5
                      }}
                    >
                      <Image
                        source={require('@/assets/images/icons/star.png')}
                        contentFit='contain'
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: theme == 'dark' ? light : accent
                        }}
                      />

                      <Rating item={item} />
                    </ThemedView>

                    <ThemedView
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        borderRadius: 10,
                        paddingVertical: 5,
                        gap: 5
                      }}
                    >
                      <Image
                        source={require('@/assets/images/icons/location_marker.png')}
                        contentFit='contain'
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: theme == 'dark' ? light : appDark
                        }}
                      />

                      <ThemedText style={{ marginTop: 5 }}>{getDistanceFromLatLonInKm(Number(profile?.coords?.latitude), Number(profile?.coords?.longitude), Number(item?.coords?.latitude), Number(item?.coords?.longitude)).toFixed(1)}km away</ThemedText>
                    </ThemedView>
                  </ThemedView>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </PaperProvider>
  )
}

export default doctor