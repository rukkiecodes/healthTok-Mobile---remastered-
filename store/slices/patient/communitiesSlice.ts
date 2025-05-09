import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Community {
  id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  members: string[];
  createdAt?: any;
  [key: string]: any;
}

interface CommunitiesState {
  communities: Community[];
  loading: boolean;
}

const initialState: CommunitiesState = {
  communities: [],
  loading: false,
};

const communitiesSlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    setCommunities (state, action: PayloadAction<Community[]>) {
      state.communities = action.payload;
    },
    addCommunity (state, action: PayloadAction<Community>) {
      state.communities.unshift(action.payload);
    },
    removeCommunity (state, action: PayloadAction<string>) {
      state.communities = state.communities.filter(c => c.id !== action.payload);
    },
    setLoading (state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setCommunities,
  addCommunity,
  removeCommunity,
  setLoading,
} = communitiesSlice.actions;

export default communitiesSlice.reducer;
