import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/patient/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const patientAppointSlice = createSlice({
  name: "patientAppointment",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = patientAppointSlice.actions;
export default patientAppointSlice.reducer;
