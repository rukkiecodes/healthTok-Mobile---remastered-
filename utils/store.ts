import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/features/userSlice";
import artisanSlice from "@/features/artisanSlice";
import searchSlice from "@/features/searchSlice";
import conversationSlice from "@/features/conversationSlice";
import favoriteArtisans from "@/features/favoriteArtisansSlice";

// Define the type for the root state
export type RootState = ReturnType<typeof store.getState>;

// Define the type for the dispatch function
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    user: userSlice,
    artisan: artisanSlice,
    search: searchSlice,
    conversation: conversationSlice,
    favoriteArtisans: favoriteArtisans,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Define a type for the thunk action
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
