import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy, startAfter, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/fb"; // Firestore instance
import { Artisans } from "@/utils/types";
import getUserId from "@/libraries/uid";

const FAVORITES_LIMIT = 20;

interface FavoriteState {
  favorites: Artisans[];
  lastVisible: any | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchResults: Artisans[];
}

const initialState: FavoriteState = {
  favorites: [],
  lastVisible: null,
  hasMore: true,
  loading: false,
  error: null,
  searchResults: [],
};

// ** Fetch favorited artisans (with pagination) **
export const fetchFavoriteArtisans: any = createAsyncThunk<
  { favorites: Artisans[]; lastVisible: any | null; hasMore: boolean },
  void,
  { rejectValue: string }
>("favoriteArtisans/fetch", async (_, { rejectWithValue, getState }) => {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("User ID not found");

    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    if (!userData?.favorites || userData.favorites.length === 0) {
      return { favorites: [], lastVisible: null, hasMore: false };
    }

    const state = getState() as { favoriteArtisans: FavoriteState };
    const lastVisible = state.favoriteArtisans.lastVisible;

    let favoriteQuery = query(
      collection(db, "users"),
      where("joiningAs", "==", "artisan"),
      where("uid", "in", userData.favorites.slice(0, 10)), // Firestore 'in' supports up to 10 items
      orderBy("timestamp", "desc"),
      limit(FAVORITES_LIMIT)
    );

    if (lastVisible) {
      favoriteQuery = query(
        collection(db, "users"),
        where("joiningAs", "==", "artisan"),
        where("uid", "in", userData.favorites.slice(0, 10)),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(FAVORITES_LIMIT)
      );
    }

    const snapshot = await getDocs(favoriteQuery);
    const favorites: Artisans[] = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...(doc.data() as Artisans),
    }));

    const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { favorites, lastVisible: newLastVisible, hasMore: snapshot.docs.length === FAVORITES_LIMIT };
  } catch (error: any) {
    console.error("Error fetching favorite artisans:", error);
    return rejectWithValue(error.message || "Failed to fetch favorite artisans.");
  }
});

// ** Search favorited artisans **
export const searchFavoriteArtisans = createAsyncThunk<
  { searchResults: Artisans[] },
  string,
  { rejectValue: string }
>("favoriteArtisans/search", async (searchQuery, { rejectWithValue }) => {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("User ID not found");

    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    if (!userData?.favorites || userData.favorites.length === 0) {
      return { searchResults: [] };
    }

    const searchQueryRef = query(
      collection(db, "users"),
      where("joiningAs", "==", "artisan"),
      where("uid", "in", userData.favorites.slice(0, 10)), // Firestore 'in' supports up to 10 items
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
    console.error("Error searching favorite artisans:", error);
    return rejectWithValue(error.message || "Failed to search favorite artisans.");
  }
});

export const favoriteArtisansSlice = createSlice({
  name: "favoriteArtisans",
  initialState,
  reducers: {
    resetFavorites: (state) => {
      state.favorites = [];
      state.lastVisible = null;
      state.hasMore = true;
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteArtisans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteArtisans.fulfilled, (state, action) => {
        const { favorites, lastVisible, hasMore } = action.payload;
        state.favorites = lastVisible === null ? favorites : [...state.favorites, ...favorites];
        state.lastVisible = lastVisible;
        state.hasMore = hasMore;
        state.loading = false;
      })
      .addCase(fetchFavoriteArtisans.rejected, (state, action) => {
        state.error = action.payload || "An error occurred.";
        state.loading = false;
      })
      .addCase(searchFavoriteArtisans.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchFavoriteArtisans.fulfilled, (state, action) => {
        state.searchResults = action.payload.searchResults;
        state.loading = false;
      })
      .addCase(searchFavoriteArtisans.rejected, (state, action) => {
        state.error = action.payload || "An error occurred during search.";
        state.loading = false;
      });
  },
});

export const { resetFavorites } = favoriteArtisansSlice.actions;
export default favoriteArtisansSlice.reducer;
