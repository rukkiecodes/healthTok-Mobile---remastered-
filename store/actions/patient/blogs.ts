import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/fb";
import { AppDispatch } from "@/store/store";
import { setBlogs } from "@/store/slices/patient/blogs";

export const fetchBlogs: any = () => async (dispatch: AppDispatch) => {
  try {
    const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q)

    const blogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    dispatch(setBlogs(blogs))
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
