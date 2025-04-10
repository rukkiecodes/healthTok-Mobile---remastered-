import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy, startAfter, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/fb";
import { Artisans } from "@/utils/types";
import getUserId from "@/libraries/uid";

const FAVORITES_LIMIT = 20;

export const fetchFavoriteArtisans: any = createAsyncThunk<
  { favorites: Artisans[]; lastVisible: any | null; hasMore: boolean },
  void,
  { rejectValue: string }
>("artisan/fetchFavorites", async (_, { rejectWithValue, getState }) => {
  try {
    const userId = await getUserId();
    if (!userId) return rejectWithValue("User ID not found");

    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    if (!userData?.favorites || userData.favorites.length === 0) {
      return { favorites: [], lastVisible: null, hasMore: false };
    }

    const favoriteIds = userData.favorites.slice(0, 10);

    const state = getState() as { artisan: { favoriteLastVisible: any } };
    const lastVisible = state.artisan.favoriteLastVisible;

    let favoriteQuery = query(
      collection(db, "users"),
      where("joiningAs", "==", "artisan"),
      where("uid", "in", favoriteIds),
      orderBy("timestamp", "desc"),
      limit(FAVORITES_LIMIT)
    );

    if (lastVisible) {
      favoriteQuery = query(
        collection(db, "users"),
        where("joiningAs", "==", "artisan"),
        where("uid", "in", favoriteIds),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(FAVORITES_LIMIT)
      );
    }

    const snapshot = await getDocs(favoriteQuery);

    if (snapshot.empty) {
      return { favorites: [], lastVisible: null, hasMore: false };
    }

    const favorites: Artisans[] = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...(doc.data() as Artisans),
    }));

    const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { favorites, lastVisible: newLastVisible, hasMore: snapshot.docs.length === FAVORITES_LIMIT };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch favorite artisans.");
  }
});
