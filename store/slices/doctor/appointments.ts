import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/doctor/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const doctorAppointSlice = createSlice({
  name: "doctorAppointment",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = doctorAppointSlice.actions;
export default doctorAppointSlice.reducer;
