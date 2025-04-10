import { createSlice } from "@reduxjs/toolkit"
import { Appointment } from "../types/appointment";

const initialState: Appointment = {
  doctorProfile: null,
  selectedDate: null,
  selectedTime: null,
  appointment: {
    reason: ''
  }
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setDoctorProfile: (state, action) => {
      state.doctorProfile = action.payload;
    },

    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setAppointment: (state, action) => {
      state.appointment = action.payload;
    },
  }
})

export const {
  setDoctorProfile,
  setSelectedDate,
  setSelectedTime,
  setAppointment
} = appointmentSlice.actions;

export default appointmentSlice.reducer;