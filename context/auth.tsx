import React, { useEffect, useState } from 'react';
import { User } from "@/utils/types";
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ActivityIndicator } from 'react-native-paper';
import { accent } from '@/utils/colors';
import { ThemedText } from '@/components/ThemedText';
import { auth, setupAuthStatePersistence } from '@/utils/fb';
import { signOut as firebaseSignOut } from "firebase/auth";

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

  useEffect(() => {
    const initializeAuth = async () => {
      // Set up Firebase auth state persistence
      const unsubscribe = setupAuthStatePersistence((firebaseUser) => {
        if (firebaseUser) {
          setAuthState(true);
          dispatch(setUser(firebaseUser));
        } else {
          setAuthState(false);
          dispatch(setUser(null));
        }
        setLoading(false); // Set loading to false once auth state is determined
      });

      return unsubscribe; // Cleanup on component unmount
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!authState)
        router.replace("/(auth)/home");
      else
        router.replace("/(app)/(tabs)/home");
    }
  }, [authState, loading]);

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText font="Poppins-Regular">
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn: async () => {
          setAuthState(true);
        },
        signOut: async (): Promise<void> => {
          try {
            await firebaseSignOut(auth); // Firebase logout
            setAuthState(false);
            await AsyncStorage.removeItem("healthTok_user"); // Clear any user-related AsyncStorage data
            router.replace("/(auth)/home"); // Navigate back to the login screen
          } catch (error) {
            console.error("Error signing out:", error);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
