import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/patient/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const patientCanceledAppointmentsSlice = createSlice({
  name: "patientCanceledAppointments",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = patientCanceledAppointmentsSlice.actions;
export default patientCanceledAppointmentsSlice.reducer;
