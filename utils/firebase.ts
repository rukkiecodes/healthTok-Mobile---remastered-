import { initializeApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_apiKey || '',
  authDomain: process.env.EXPO_PUBLIC_authDomain || '',
  projectId: process.env.EXPO_PUBLIC_projectId || '',
  storageBucket: process.env.EXPO_PUBLIC_storageBucket || '',
  messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId || '',
  appId: process.env.EXPO_PUBLIC_appId || '',
  measurementId: process.env.EXPO_PUBLIC_measurementId || '',
};

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Firebase Auth initialization with persistence for React Native
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Firebase state persistence: Check if user is already logged in
const setupAuthStatePersistence = (onUserChange: (user: any) => void) => {
  onAuthStateChanged(auth, (user) => {
    onUserChange(user);
  });
};

export { auth, db, setupAuthStatePersistence, onAuthStateChanged, firebaseConfig };
