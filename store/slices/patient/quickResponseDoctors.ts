import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuickResponsState } from "@/store/types/patient/quickResponseDoctors";

const initialState: QuickResponsState = {
  doctors: []
};

const quickResponseSlice = createSlice({
  name: "quickResponse",
  initialState,
  reducers: {
    setDoctors: (state, action) => {
      state.doctors = action.payload;
    }
  },
});

export const {
  setDoctors
} = quickResponseSlice.actions;
export default quickResponseSlice.reducer;
