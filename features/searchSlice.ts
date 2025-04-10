import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "@/utils/types";



const initialState: SearchState = {
  filter: '',
  autoSearch: false
}



export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string | ''>) => {
      state.filter = action.payload
    },


    setAutoSearch: (state, action: PayloadAction<boolean | false>) => {
      state.autoSearch = action.payload
    },
  }
})



export const {
  setFilter,
  setAutoSearch
} = searchSlice.actions


export default searchSlice.reducer