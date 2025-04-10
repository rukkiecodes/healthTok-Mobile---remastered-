import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "@/utils/types";
import { db } from "@/utils/fb";
import getUserId from "@/libraries/uid";
import { setProfile } from "@/features/userSlice"; // Import action to update profile

// Async thunk to fetch user profile
export const fetchProfile: any = createAsyncThunk(
  "user/fetchProfile",
  async (_, { dispatch }) => {
    try {
      const uid = await getUserId();
      if (!uid) throw new Error("User ID not found");

      return new Promise<User | null>((resolve) => {
        const unsub = onSnapshot(doc(db, "users", uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const profileData = docSnapshot.data() as User;
            dispatch(setProfile(profileData)); // Dispatch profile update
            resolve(profileData);
          } else {
            resolve(null);
          }
        });

        return () => unsub(); // Unsubscribe when unneeded
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }
);
