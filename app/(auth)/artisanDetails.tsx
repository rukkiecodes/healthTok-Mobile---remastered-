import {View, TouchableOpacity, TextInput} from 'react-native'
import React, {useEffect, useState} from 'react'
import {ThemedView} from '@/components/ThemedView'
import {ThemedText} from '@/components/ThemedText'
import {useThemeColor} from '@/hooks/useThemeColor'
import {router} from 'expo-router'
import {Collapsible} from '@/components/Collapsible'
import {useDispatch, useSelector} from 'react-redux'
import {doc, getDoc} from "firebase/firestore"
import {db} from '@/utils/fb'
import {setCategories, setSignupObject} from '@/features/userSlice'
import artisanExperienceLevels from '@/libraries/experienceLevels'
import * as Location from 'expo-location';
import {Appbar, Modal, PaperProvider, Portal} from 'react-native-paper'
import {RootState} from '@/utils/store'
import {useColorScheme} from '@/hooks/useColorScheme'
import {ScrollView} from 'react-native-gesture-handler'
import {accent, amber, appDark, black, dark, light, offWhite, transparent} from '@/utils/colors'
import {useDataContext} from '@/context/DataContext'
import {useBottomSheet} from '@/context/BottomSheetContext'

const ArtisanDetailsScreen = () => {
    const colorScheme = useColorScheme()

    const buttonBackground = useThemeColor({light: accent, dark: amber}, 'background');
    const buttonBackgroundText = useThemeColor({light, dark}, 'text');
    const outlineColor = useThemeColor({light: black, dark: light}, 'background');
    const color = useThemeColor({light: black, dark: light}, 'text');

    const dispatch = useDispatch();
    const {signupObject} = useSelector((state: RootState) => state.user);
    const {categories} = useDataContext()
    const {openSheet, closeSheet} = useBottomSheet()

    const [artisanType, setArtisanType] = useState('Choose Artisan Type')
    const [experienceLevel, setExperienceLevel] = useState<{
        id?: number;
        name?: string;
        description?: string;
    } | null>({})
    const [address, setAddress] = useState<string>('');
    const [coordinates, setCoordinates] = useState<object>({});
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const getUserLocation = async () => {
        try {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return

            let location = await Location.getCurrentPositionAsync({});

            setCoordinates(location.coords)
        } catch (error) {
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const docRef = doc(db, 'categories', 'fogx4iFkZtIVKXakTmwr');
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();

                if (data?.categories) {
                    // Type-casting the categories if necessary based on the shape in `data`
                    const categories: any = (data.categories as string[]).map((item, index) => ({
                        index,
                        item
                    }));

                    dispatch(setCategories(categories));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        })();
    }, [dispatch]);

    useEffect(() => {
        getUserLocation()
    }, [])

    const done = () => {
        if (signupObject.joiningAs == 'artisan') {
            if (artisanType == "Choose Artisan Type" || !experienceLevel || !address) return

            dispatch(
                setSignupObject({
                    ...signupObject,
                    artisanType,
                    experienceLevel,
                    address,
                    coordinates
                })
            )

            // router.navigate('/(auth)/verifyEmail')
            router.navigate('/(auth)/displayPics')
        } else {
            if (!address) return
            dispatch(
                setSignupObject({
                    ...signupObject,
                    address,
                    coordinates
                })
            )

            // router.navigate('/(auth)/verifyEmail')
            router.navigate('/(auth)/displayPics')
        }
    }


    const openSelectTypeSheet = () => {
        openSheet(() => (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        categories.map(item => (
                            <TouchableOpacity
                                key={item?.index}
                                onPress={() => {
                                    setArtisanType(item)
                                    closeSheet()
                                }}
                                style={{
                                    marginBottom: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10
                                }}
                            >
                                <ThemedText darkColor={dark}>{item}</ThemedText>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </>
        ))
    }

    return (
        <PaperProvider>
            <Appbar.Header mode='small' style={{backgroundColor: colorScheme == 'dark' ? appDark : light}}>
                <Appbar.BackAction onPress={router.back}/>
            </Appbar.Header>

            <ThemedView style={{flex: 1, padding: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 20}}>
                    <View style={{backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1}}/>
                    <View style={{backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1}}/>
                    <View style={{backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1}}/>
                    <View style={{backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1}}/>
                    <View style={{backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1}}/>
                </View>


                <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 20}}>
                    <ThemedText type='subtitle' font='Poppins-Bold'>
                        Artisan Details
                    </ThemedText>


                    <ThemedText style={{marginTop: 10}}>
                        Input your Artisan Details to make you easier to find.
                    </ThemedText>


                    <View style={{marginTop: 20}}>
                        <TouchableOpacity
                            onPress={openSelectTypeSheet}
                            style={{
                                borderWidth: 1,
                                borderColor: outlineColor,
                                paddingHorizontal: 20,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: 10,
                                marginBottom: 20
                            }}
                        >
                            <ThemedText>{artisanType}</ThemedText>
                        </TouchableOpacity>


                        {
                            signupObject.joiningAs == 'artisan' &&
                            <Collapsible title={experienceLevel?.name || 'Experience level'}>
                                <ScrollView style={{maxHeight: 250}} showsVerticalScrollIndicator={false}>
                                    {
                                        artisanExperienceLevels.map(item => (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => setExperienceLevel(item)}
                                                style={{
                                                    marginBottom: 10,
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 10
                                                }}
                                            >
                                                <ThemedText>{item?.name}</ThemedText>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            </Collapsible>
                        }


                        <TextInput
                            value={address}
                            onChangeText={text => setAddress(text)}
                            placeholder='Enter your Location'
                            placeholderTextColor={colorScheme == 'dark' ? `${light}33` : `${dark}33`}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: outlineColor,
                                color,
                                fontFamily: 'Poppins-Regular',
                                height: 50,
                                justifyContent: 'center',
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                borderCurve: 'continuous'
                            }}
                        />


                        <TouchableOpacity
                            onPress={done}
                            disabled={!artisanType || !experienceLevel || !address}
                            style={{
                                marginTop: 20,
                                height: 50,
                                borderRadius: 50,
                                borderCurve: 'continuous',
                                backgroundColor: buttonBackground,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <ThemedText style={{color: buttonBackgroundText}}>Submit</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ThemedView>
        </PaperProvider>
    )
}

export default ArtisanDetailsScreen