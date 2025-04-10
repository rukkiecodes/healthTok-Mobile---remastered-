import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from "firebase/firestore";
import { db } from "@/utils/fb";
import { Artisans } from "@/utils/types";
import getUserId from "@/libraries/uid";

const SEARCH_LIMIT = 20;

export const searchFavoriteArtisans: any = createAsyncThunk<
  { favorites: Artisans[]; hasMore: boolean },
  string,
  { rejectValue: string }
>("artisan/searchFavorites", async (searchTerm, { rejectWithValue }) => {
  try {
    const userId = await getUserId();
    if (!userId) return rejectWithValue("User ID not found");

    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    if (!userData?.favorites || userData.favorites.length === 0) {
      return { favorites: [], hasMore: false };
    }

    const favoriteIds = userData.favorites;

    let allFavorites: Artisans[] = [];

    // Firestore 'in' operator only allows 10 items at a time
    const batchSize = 10;
    for (let i = 0; i < favoriteIds.length; i += batchSize) {
      const batchIds = favoriteIds.slice(i, i + batchSize);

      const searchQuery = query(
        collection(db, "users"),
        where("joiningAs", "==", "artisan"),
        where("uid", "in", batchIds),
        orderBy("displayName"),
        where("displayName", ">=", searchTerm),
        where("displayName", "<=", searchTerm + "\uf8ff"),
        limit(SEARCH_LIMIT)
      );

      const snapshot = await getDocs(searchQuery);

      if (!snapshot.empty) {
        allFavorites.push(
          ...snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...(doc.data() as Artisans),
          }))
        );
      }
    }

    return { favorites: allFavorites, hasMore: allFavorites.length === SEARCH_LIMIT };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to search favorite artisans.");
  }
});
