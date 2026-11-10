import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User";
import searchReducer from "./features/Search";
import cartReducer from "./features/Cart";
import favoutireReducer from "./features/Favourites";

export const store = configureStore({
  reducer: {
    user: userReducer,
    searchQuery: searchReducer,
    cart: cartReducer,
    favourites: favoutireReducer,
  },
});
