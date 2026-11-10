import { createSlice } from "@reduxjs/toolkit";

const storedFavorites = localStorage.getItem("favourites");
const initialState = storedFavorites ? JSON.parse(storedFavorites) : [];

const favoutites = createSlice({
  name: "favoutites",
  initialState,
  reducers: {
    handleFavourite: (state, action) => {
      const isAddToFavourite = state.find(
        (favourite) => favourite === action.payload
      );

      console.log("isAddToFavourite", isAddToFavourite);

      if (!isAddToFavourite) {
        state.push(action.payload);
      } else {
        return state.filter((favourite) => favourite !== action.payload);
      }

      localStorage.setItem("favourites", JSON.stringify(state));
    },
  },
});

export const favoutitesActions = favoutites.actions;
export default favoutites.reducer;
