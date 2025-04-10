import { ThunkAction, Action } from '@reduxjs/toolkit';
import { store } from '@/store/store';
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

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

export interface UserState {
  user: User | null;
}