import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/doctor/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const doctorCompletedAppointmentsSlice = createSlice({
  name: "doctorCompletedAppointments",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = doctorCompletedAppointmentsSlice.actions;
export default doctorCompletedAppointmentsSlice.reducer;
