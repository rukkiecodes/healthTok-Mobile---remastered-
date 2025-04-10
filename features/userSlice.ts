import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, SignupObject, UserState } from "@/utils/types";
import { fetchProfile } from '@/features/actions/userActions';

const initialState: UserState = {
    user: null,
    loadingInitial: false,
    profile: null,
    loading: false,
    signupObject: {
        joiningAs: "artisan",
        fullName: "",
        username: "",
        companyName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        mirrorDB_UID: "",
        address: "",
        artisanType: "",
        coordinates: {},
        experienceLevel: {},
    },
    count: 0,
    categories: [],
    notifications: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.loadingInitial = false;
        },
        setLoadingInitial: (state, action: PayloadAction<boolean>) => {
            state.loadingInitial = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.profile = null;
            state.loadingInitial = false;
        },
        setProfile: (state, action: PayloadAction<User | null>) => {
            state.profile = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSignupObject: (state, action: PayloadAction<SignupObject>) => {
            state.signupObject = action.payload;
        },
        setCategories: (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload;
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setCount: (state, action) => {
            state.count = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.loading = false;
            });
    },
});

// Export actions
export const {
    setUser,
    setLoadingInitial,
    logout,
    setProfile,
    setLoading,
    setSignupObject,
    setCategories,
    setNotifications,
    setCount,
} = userSlice.actions;

export default userSlice.reducer;
