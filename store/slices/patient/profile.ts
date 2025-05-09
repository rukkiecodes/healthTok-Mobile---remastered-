import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "@/store/types/patient/profile";

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

const patientSlice = createSlice({
  name: "patientProfile",
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
} = patientSlice.actions;
export default patientSlice.reducer;
