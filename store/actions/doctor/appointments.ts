import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/fb";
import { AppDispatch } from "@/store/store";
import { auth } from '@/utils/fb'
import { setAppointment } from "@/store/slices/doctor/appointments";

export const fetchAppointments: any = () => async (dispatch: AppDispatch) => {
  try {
    const { uid }: any = auth.currentUser
    if (!uid) return

    const q = query(collection(db, "doctors", uid, "appointments"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      dispatch(setAppointment(data))
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
