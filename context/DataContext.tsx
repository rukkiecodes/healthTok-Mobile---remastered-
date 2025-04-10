import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/utils/fb';
import { setCategories, setProfile } from '@/features/userSlice';
import getUserId from '@/libraries/uid';

interface DataContextProps {
  profile: any;
  artisans: object[];
  categories: any[];
  recentArtisans: object[];
  favorites: object[];
  bookings: object[];
  matches: object[];
  notificationData: object[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDataContext must be used within a DataProvider");
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<any>(null);
  const [artisans, setArtisansState] = useState<any[]>([]);
  const [categories, setCategoriesState] = useState<object[]>([]);
  const [recentArtisans, setRecentArtisansState] = useState<any[]>([]);
  const [favorites, setFavoritesState] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [matches, setMatchesState] = useState<any[]>([]);
  const [notificationData, setNotificationData] = useState<object[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cachedProfile = await AsyncStorage.getItem('healthTok_profile');
        if (cachedProfile) {
          setProfileState(JSON.parse(cachedProfile));
          dispatch(setProfile(JSON.parse(cachedProfile)));
        }

        const userData = await AsyncStorage.getItem('healthTok_user');
        if (!userData) return;

        const { uid } = JSON.parse(userData) as { uid: string };
        if (!uid) return;

        const unsub = onSnapshot(doc(db, 'users', uid), async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const profileData: any = docSnapshot.data();
            setProfileState(profileData);
            dispatch(setProfile(profileData));
            await AsyncStorage.setItem('healthTok_profile', JSON.stringify(profileData));
            await fetchFavorites(profileData);
          }
        });

        return unsub;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchFavorites = async (profileData: any) => {
      try {
        if (!profileData?.favorites) return;

        const favoritesData = await Promise.all(
          profileData.favorites.map(async (id: string) => {
            const userDoc = await getDoc(doc(db, 'users', id));
            return { id: userDoc.id, ...userDoc.data() };
          })
        );

        setFavoritesState(favoritesData);
        await AsyncStorage.setItem('healthTok_favorites', JSON.stringify(favoritesData));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const cachedCategories = await AsyncStorage.getItem('healthTok_categories');
        if (cachedCategories) {
          setCategoriesState(JSON.parse(cachedCategories));
          dispatch(setCategories(JSON.parse(cachedCategories)));
          return;
        }

        const categoryDoc = await getDoc(doc(db, 'categories', 'fogx4iFkZtIVKXakTmwr'));
        const fetchedCategories = categoryDoc.data()?.categories || [];
        setCategoriesState(fetchedCategories);
        dispatch(setCategories(fetchedCategories));

        await AsyncStorage.setItem('healthTok_categories', JSON.stringify(fetchedCategories));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch recent artisans
    const fetchRecentArtisans = async () => {
      try {
        const userId = await getUserId();
        if (!userId) return

        const q = query(
          collection(db, 'users', userId, 'recent'),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const recentArtisans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentArtisansState(recentArtisans);
        await AsyncStorage.setItem('healthTok_recentArtisans', JSON.stringify(recentArtisans));
      } catch (error) {
        console.error("Error fetching recent artisans:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const id = await getUserId();
        if (!id) return

        const collectionPath = profile?.joiningAs === 'artisan' ? 'pendingBookings' : 'bookings';
        const q = collection(db, "users", id, collectionPath);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setBookings(
            querySnapshot.docs.map((item) => ({
              id: item.id,
              ...item.data()
            }))
          );
        });

        return () => unsubscribe(); // Cleanup for unsubscribe
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchMatches = async () => {
      try {
        const cachedMatches = await AsyncStorage.getItem('healthTok_matches');
        if (cachedMatches) {
          const parsedMatches = JSON.parse(cachedMatches);
          setMatchesState(parsedMatches);
        }

        const id = await getUserId();
        if (!id) return

        const matchesQuery = query(
          collection(db, 'matches'),
          where('usersMatched', 'array-contains', id),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(matchesQuery, async (snapshot) => {
          const fetchedMatches = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatchesState(fetchedMatches);
          await AsyncStorage.setItem('healthTok_matches', JSON.stringify(fetchedMatches));
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const cachedNotifications = await AsyncStorage.getItem('healthTok_notifications');
        if (cachedNotifications) {
          setNotificationData(JSON.parse(cachedNotifications));
        }

        const userId = await getUserId();
        if (!userId) return
        
        const notificationsQuery = query(
          collection(db, 'users', userId, 'notification'),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(notificationsQuery, async (snapshot) => {
          const fetchedNotifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotificationData(fetchedNotifications);
          await AsyncStorage.setItem('healthTok_notifications', JSON.stringify(fetchedNotifications));
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };



    let unsubscribeArtisans: (() => void) | undefined;
    let unsubscribeProfile: (() => void) | undefined;

    const setupListeners = async () => {
      await fetchCategories();
      unsubscribeProfile = await fetchProfile();
      await fetchRecentArtisans();
      await fetchBookings();
      await fetchMatches();
      await fetchNotifications();
    };

    setupListeners();

    return () => {
      unsubscribeArtisans?.();
      unsubscribeProfile?.();
    };
  }, [dispatch]);

  return (
    <DataContext.Provider value={{ profile, artisans, categories, recentArtisans, favorites, bookings, matches, notificationData }}>
      {children}
    </DataContext.Provider>
  );
};
