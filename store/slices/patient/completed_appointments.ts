import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/patient/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const patientCompletedAppointmentsSlice = createSlice({
  name: "patientCompletedAppointments",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = patientCompletedAppointmentsSlice.actions;
export default patientCompletedAppointmentsSlice.reducer;
