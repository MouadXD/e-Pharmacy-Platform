import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: null,
};

const searchQuery = createSlice({
  name: "searchQuery",
  initialState,
  reducers: {
    search: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const searchActions = searchQuery.actions;
export default searchQuery.reducer;
