
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/store/slices/userSlice";
import profileSlice from "@/store/slices/profileSlice";
import appointmentSlice from "@/store/slices/appointmentSlice";
import conversationsSlice from "@/store/slices/conversationsSlice";

import doctorAppointmentSlice from "@/store/slices/doctor/appointments";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        user: userSlice,
        profile: profileSlice,
        appointment: appointmentSlice,
        conversations: conversationsSlice,

        doctorAppointment: doctorAppointmentSlice
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
