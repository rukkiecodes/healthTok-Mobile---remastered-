import { Timestamp } from "firebase/firestore";
import { Profile } from "./profile";

export interface Conversation {
  id: string;
  participants: string[]; // [user.uid, doctorUID]
  createdAt: Timestamp;
  lastMessage ?: string;
  participantProfiles: { [uid: string]: Profile }; // Optional: to cache user info
  isConsultionOpen?: boolean
}