import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Artisans } from "@/utils/types";
import { fetchArtisans } from "@/features/actions/artisanActions/fetchArtisans";
import { searchArtisans } from "@/features/actions/artisanActions/searchArtisans";
import { fetchFavoriteArtisans } from "@/features/actions/artisanActions/fetchFavoriteArtisans";
import { searchFavoriteArtisans } from "@/features/actions/artisanActions/searchFavoriteArtisans";

interface ArtisanState {
  artisans: Artisans[];
  lastVisible: any | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchResults: Artisans[];
  favorites: Artisans[];
  favoriteLastVisible: any | null;
  favoriteHasMore: boolean;
  favoriteSearchResults: Artisans[];
}

const initialState: ArtisanState = {
  artisans: [],
  lastVisible: null,
  hasMore: true,
  loading: false,
  error: null,
  searchResults: [],
  favorites: [],
  favoriteLastVisible: null,
  favoriteHasMore: true,
  favoriteSearchResults: [],
};

export const artisanSlice = createSlice({
  name: "artisan",
  initialState,
  reducers: {
    resetFavorites: (state) => {
      Object.assign(state, {
        favorites: [],
        favoriteLastVisible: null,
        favoriteHasMore: true,
        favoriteSearchResults: [],
        error: null,
      });
    },
    resetArtisans: (state) => {
      Object.assign(state, {
        artisans: [],
        lastVisible: null,
        hasMore: true,
        searchResults: [],
        error: null,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtisans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArtisans.fulfilled, (state, action) => {
        const { artisans, lastVisible, hasMore } = action.payload;
        state.artisans = lastVisible ? [...state.artisans, ...artisans] : artisans;
        Object.assign(state, { lastVisible, hasMore, loading: false });
      })
      .addCase(fetchArtisans.rejected, (state, action) => {
        Object.assign(state, { error: action.payload || "An error occurred.", loading: false });
      })
      .addCase(searchArtisans.fulfilled, (state, action) => {
        Object.assign(state, { searchResults: action.payload.searchResults, loading: false });
      })
      .addCase(fetchFavoriteArtisans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteArtisans.fulfilled, (state, action) => {
        const { favorites, lastVisible, hasMore } = action.payload;
        state.favorites = lastVisible ? [...state.favorites, ...favorites] : favorites;
        Object.assign(state, { favoriteLastVisible: lastVisible, favoriteHasMore: hasMore, loading: false });
      })
      .addCase(fetchFavoriteArtisans.rejected, (state, action) => {
        Object.assign(state, { error: action.payload || "An error occurred.", loading: false });
      })
      .addCase(searchFavoriteArtisans.fulfilled, (state, action) => {
        Object.assign(state, { favoriteSearchResults: action.payload.searchResults, loading: false });
      });
  },
});

export const { resetFavorites, resetArtisans } = artisanSlice.actions;
export default artisanSlice.reducer;
