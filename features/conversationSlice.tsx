import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationState } from "@/utils/types";



const initialState: ConversationState = {
  conversationId: '',
  conversationObject: null,
  invoice: null,
  compressedObject: null
}



export const searchSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },

    setConversationObject: (state, action: PayloadAction<object | null>) => {
      state.conversationObject = action.payload;
    },

    setInvoice: (state, action: PayloadAction<object | null>) => {
      state.invoice = action.payload;
    },


    setCompressedObject: (state, action: PayloadAction<object | null>) => {
      state.compressedObject = action.payload;
    }
  }
})



export const {
  setConversationId,
  setConversationObject,
  setInvoice,
  setCompressedObject
} = searchSlice.actions


export default searchSlice.reducer