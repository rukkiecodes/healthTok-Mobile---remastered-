
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/store/slices/userSlice";
import profileSlice from "@/store/slices/profileSlice";
import appointmentSlice from "@/store/slices/appointmentSlice";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        user: userSlice,
        profile: profileSlice,
        appointment: appointmentSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
