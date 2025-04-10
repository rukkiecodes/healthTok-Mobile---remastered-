import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/utils/fb";
import { Artisans } from "@/utils/types";

export const searchArtisans: any = createAsyncThunk<
  { searchResults: Artisans[] },
  string,
  { rejectValue: string }
>(
  "artisan/searchArtisans",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const artisanRef = collection(db, "users");
      const searchQueryRef = query(
        artisanRef,
        where("joiningAs", "==", "artisan"),
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + "\uf8ff"),
        orderBy("name"),
        limit(10)
      );

      const snapshot = await getDocs(searchQueryRef);
      const searchResults: Artisans[] = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...(doc.data() as Artisans),
      }));

      return { searchResults };
    } catch (error: any) {
      console.error("Error searching artisans:", error);
      return rejectWithValue(error.message || "Failed to search artisans.");
    }
  }
);
