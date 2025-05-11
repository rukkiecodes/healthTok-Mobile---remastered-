import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppointmentState } from "@/store/types/doctor/appointments";

const initialState: AppointmentState = {
  appointments: []
};

const doctorCanceledAppointmentsSlice = createSlice({
  name: "doctorCanceledAppointments",
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments = action.payload;
    }
  },
});

export const {
  setAppointment
} = doctorCanceledAppointmentsSlice.actions;
export default doctorCanceledAppointmentsSlice.reducer;
