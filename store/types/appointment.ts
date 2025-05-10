import { Profile } from "./profile";

export interface Appointment {
  doctorProfile?: Profile | null

  appointment?: {
    reason?: string
  }

  selectedDate?: {
    day?: number
    dayName?: string
    month?: string | any
    year?: string | any
  } | null

  selectedTime?: {
    time?: string
    active?: boolean
  } | null
}

export interface DateObject {
  day?: number
  dayName?: string
  month?: string
  year?: string
}