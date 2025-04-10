import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "@/store/types/profile";

interface ProfileState {
  profile: Profile | null;
  setupTab: string
  modal: boolean
}

const initialState: ProfileState = {
  profile: null,
  setupTab: 'patient',
  modal: false
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    
    setSetupTab: (state, action) => {
      state.setupTab = action.payload;
    },
    
    setModal: (state, action) => {
      state.modal = action.payload;
    },
  },
});

export const {
  setProfile,
  setSetupTab,
  setModal
} = profileSlice.actions;
export default profileSlice.reducer;
