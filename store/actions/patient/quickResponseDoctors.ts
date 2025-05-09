import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/fb";
import { AppDispatch } from "@/store/store";
import { setDoctors } from "@/store/slices/patient/quickResponseDoctors";

export const fetchQuickResponseDoctors: any = () => async (dispatch: AppDispatch) => {
  try {
    const q = query(collection(db, "quickResponders"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q)

    const doctors = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    dispatch(setDoctors(doctors))
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
