import { ThunkAction, Action } from '@reduxjs/toolkit';
import { store } from './store'; // Import the store from your store file

// Define the type for the root state
export type RootState = ReturnType<typeof store.getState>;

// Define the type for the dispatch function
export type AppDispatch = typeof store.dispatch;

// Define a type for thunk actions
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Define the shape of the User object
export interface User {
  uid: string;
  docId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  fullName?: string;
  address?: string;
  coordinates?: object;
  joiningAs?: string;
  artisanType?: string;
  experienceLevel?: {
    id: number
    name: string
    description: string
    years: string
  };
  availability?: string;
  bio?: string;
  phone?: string;
  businessEmail?: string;
  photoLink?: string;
  favorites?: object[]
  count?: number | string
  companyName?: string
  verified?: boolean
  gender?: string
  rating?: number
  stars?: number
  expoPushNotificationToken?: string
  // Add other fields if necessary
}

export interface SignupObject {
  joiningAs: string;
  fullName: string;
  username: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  mirrorDB_UID: string;
  address: string;
  artisanType: string;
  coordinates: object;
  experienceLevel: object;
}

export interface UserState {
  user: User | null; // Use the User type or null if the user is not logged in
  loadingInitial: boolean;
  profile: User | null; // Assuming profile has the same shape as User or is null
  loading: boolean;
  signupObject: SignupObject;
  count: number;
  categories: string[]; // Array of category strings
  notifications: object[]; // Array of category strings
}

export interface ArtisanState {
  artisans: object[] | any
  lastVisible: object | null
  hasMore: boolean
  loading: boolean
  searchResults: object[]
  error: string | null
}

export interface Artisans {
  id: string;
}

export interface Artisan {
  id: string;
  photoURL: string;
  stars: number;
  verified: boolean;
  fullName: string;
  rating: number;
  artisanType: string;
}

export interface SearchState {
  filter: string | '';
  autoSearch: boolean | false
}

export interface ConversationState {
  conversationId: string;
  conversationObject: {
    users: any
  } | null;
  invoice: object | null;
  compressedObject: {
    uri: any
  } | null;
}
