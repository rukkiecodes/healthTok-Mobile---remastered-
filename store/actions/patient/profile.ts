import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/fb";
import { AppDispatch } from "@/store/store";
import { auth } from '@/utils/fb'
import { setProfile } from "@/store/slices/patient/profile";

export const fetchPatientProfile: any = () => async (dispatch: AppDispatch) => {
  try {
    const { uid }: any = auth.currentUser
    if(!uid) return

    const unsub = onSnapshot(doc(db, "patient", uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const profileData: any = docSnapshot.data();
        dispatch(setProfile(profileData));
      }
    });

    return unsub;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
