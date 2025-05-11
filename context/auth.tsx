import React, { useEffect, useLayoutEffect, useState } from 'react';
import { User } from "@/store/types/types";
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import { auth, db, setupAuthStatePersistence } from '@/utils/fb';
import { signOut as firebaseSignOut } from "firebase/auth";
import LoadingScreen from '@/components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { InteractionManager } from 'react-native';


interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextType | any>(null);

export const useAuth = (): AuthContextType | null => {
  return React.useContext(AuthContext);
};

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

export function AuthenticationProvider ({ children }: AuthenticationProviderProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(false);
  const [loadProfile, setLoadProfile] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  const initializeAuth = async () => {
    // Set up Firebase auth state persistence
    const unsubscribe = setupAuthStatePersistence((firebaseUser) => {
      if (firebaseUser) {
        setAuthState(true);
        dispatch(setUser(firebaseUser));

        fetchProfile(firebaseUser)
      } else {
        setAuthState(false);
        dispatch(setUser(null));
        setLoadProfile(false)
      }
      setLoading(false); // Set loading to false once auth state is determined
    });

    return unsubscribe; // Cleanup on component unmount
  };

  const fetchProfile = async (firebaseUser: any) => {
    try {
      const collectionType = await AsyncStorage.getItem('healthTok_collection')
      const profile = (await getDoc(doc(db, String(collectionType), String(firebaseUser.uid)))).data()

      setProfile(profile)
      setLoadProfile(false)
    } catch (error) {
      setLoadProfile(false)
    }
  }

  useLayoutEffect(() => {
    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !loadProfile) {
      InteractionManager.runAfterInteractions(() => {
        (async () => {
          if (!authState) {
            router.replace("/(auth)/home");
          } else {
            const collectionType = await AsyncStorage.getItem('healthTok_collection');

            if (!collectionType) return <LoadingScreen />
            else
              if (collectionType === 'patient') {
                router.replace("/(app)/(patient)/(tabs)/home");
              } else if (collectionType === 'doctors') {
                if (!profile) return <LoadingScreen />
                else {
                  if (!profile?.isApplicationSubmited) router.replace("/(app)/(doctor)/doctorApplication");
                  else router.replace("/(app)/(doctor)/(tabs)/home");
                }
              }
          }
        })();
      });
    }
  }, [loading, loadProfile, authState, profile, auth]);

  if (loading || loadProfile) {
    return <LoadingScreen />
  }

  const signIn = () => setAuthState(true)

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth); // Firebase logout
      setAuthState(false);
      router.replace("/(auth)/home"); // Navigate back to the login screen
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}