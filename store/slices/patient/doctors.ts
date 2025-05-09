import { createSlice } from "@reduxjs/toolkit";
import { DoctorsState } from "@/store/types/patient/doctors";

const initialState: DoctorsState = {
  doctors: []
};

const doctorsSlice = createSlice({
  name: "allDoctors",
  initialState,
  reducers: {
    setDoctors: (state, action) => {
      state.doctors = action.payload;
    }
  },
});

export const {
  setDoctors
} = doctorsSlice.actions;
export default doctorsSlice.reducer;
