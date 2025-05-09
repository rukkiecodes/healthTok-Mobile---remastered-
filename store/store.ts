
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/store/slices/userSlice";
import profileSlice from "@/store/slices/profileSlice";
import appointmentSlice from "@/store/slices/appointmentSlice";
import signupSlice from "@/store/slices/signup";

import doctorAppointmentSlice from "@/store/slices/doctor/appointments";

// patient slices (START)
import conversationsSlice from "@/store/slices/patient/conversationsSlice";
import patientProfileSlice from "@/store/slices/patient/profile";
import quickResponseSlice from "@/store/slices/patient/quickResponseDoctors";
import doctorsSlice from "@/store/slices/patient/doctors";
import blogsSlice from "@/store/slices/patient/blogs";
import groupChatSlice from "@/store/slices/patient/groupChat";
import communitiesSlice from "@/store/slices/patient/communitiesSlice";
// patient slices (END)

// doctor slices (START)
import doctorProfileSlice from "@/store/slices/doctor/profile";
// doctor slices (END)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        user: userSlice,
        profile: profileSlice,
        signup: signupSlice,
        appointment: appointmentSlice,
        conversations: conversationsSlice,

        doctorAppointment: doctorAppointmentSlice,
        
        patientProfile: patientProfileSlice,
        quickResponse: quickResponseSlice,
        doctors: doctorsSlice,
        blogs: blogsSlice,
        groupChat: groupChatSlice,
        communities: communitiesSlice,

        doctorProfile: doctorProfileSlice
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
