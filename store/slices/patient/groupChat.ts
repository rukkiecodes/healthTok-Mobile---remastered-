import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GroupConversationState {
  conversations: any[];
  filteredConversations: any[];
  lastVisible: any | null;
  loading: boolean;
}

const initialState: GroupConversationState = {
  conversations: [],
  filteredConversations: [],
  lastVisible: null,
  loading: false,
};

const conversationSlice = createSlice({
  name: 'groupConversations',
  initialState,
  reducers: {
    setConversations (state, action: PayloadAction<any[]>) {
      state.conversations = action.payload;
      state.filteredConversations = action.payload;
    },
    addConversations (state, action: PayloadAction<any[]>) {
      state.conversations.push(...action.payload);
      state.filteredConversations.push(...action.payload);
    },
    setFilteredConversations (state, action: PayloadAction<any[]>) {
      state.filteredConversations = action.payload;
    },
    setLastVisible (state, action: PayloadAction<any>) {
      state.lastVisible = action.payload;
    },
    setLoading (state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversations,
  setFilteredConversations,
  setLastVisible,
  setLoading,
} = conversationSlice.actions;

export default conversationSlice.reducer;
