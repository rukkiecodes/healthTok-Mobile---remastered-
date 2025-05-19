import { Timestamp } from "firebase/firestore";
import { Profile } from "./profile";

export interface Conversation {
  id: string;
  appointmentId?: string;
  participants: string[]; // [user.uid, doctorUID]
  createdAt: Timestamp;
  lastMessage ?: string;
  participantProfiles: { [uid: string]: Profile }; // Optional: to cache user info
  isConsultionOpen?: boolean
  isAppointmentsOpen?: boolean
  appointmentsData?: {
    id?: string
    appointment?: {
      selectedDate?: any
      selectedTime?: any
    }
    patient?: {
      uid?: string
    }
    doctor?: {
      uid?: string
    }
  }
}