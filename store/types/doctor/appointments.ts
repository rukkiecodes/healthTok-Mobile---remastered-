export interface AppointmentState {
  appointments: any[];
}
export interface Appointment {
  doctor?: {
    profilePicture?: string
    name?: string
    id?: string
    displayImage?: {
      image?: string
    }
  }
  patient?: {
    profilePicture?: string
    name?: string
    id?: string
    uid?: string
    displayImage?: {
      image?: string
    }
    birth?: any
  }
  appointment?: {
    appointment?: {
      reason?: string
    }
    selectedDate: any | {
      day?: number
      dayName?: string
      month?: string
      year?: string
    }
    selectedTime: any | {
      selectedTime?: boolean
      time?: string
    }
  }
}