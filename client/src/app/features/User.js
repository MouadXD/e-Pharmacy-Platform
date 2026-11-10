import { createSlice } from "@reduxjs/toolkit";
import safeJsonParse from "../../helpers/safeJsonParse";

const userInfo = safeJsonParse(localStorage.getItem("user"), null);

const initialState = {
  userInfo: userInfo,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoading = true;
      state.userInfo = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.userInfo = null;
    },
    updateUser: (state, action) => {
      const updatedUserData = {
        id: state.userInfo.id,
        isBlocked: state.userInfo.isBlocked,
        role: state.userInfo.role,
        email: state.userInfo.email,
        accessToken: state.userInfo.accessToken,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };

      localStorage.setItem("user", JSON.stringify(updatedUserData));
      state.userInfo = updatedUserData;
    },
    updateToken: (state, action) => {
      const user = safeJsonParse(localStorage.getItem("user"), null);

      if (user) {
        const updatedUser = { ...user, accessToken: action.payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        state.userInfo = updatedUser;
      }
    },
    updateUserName: (state, action) => {
      const firstName = action.payload.firstName;
      const lastName = action.payload.lastName;

      state.userInfo.firstName = firstName;
      state.userInfo.lastName = lastName;

      localStorage.setItem("user", JSON.stringify(state.userInfo));
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
