import { createSlice } from "@reduxjs/toolkit";

const loadUsersFromLocalStorage = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const initialState = {
  isAuthenticated: false,
  user: null,
  users: loadUsersFromLocalStorage(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupSuccess(state, action) {
      const { name, email, password } = action.payload;
      const userExists = state.users.find((user) => user.email === email);

      if (userExists) {
        state.error = "User Already Exists";
      } else {
        state.users.push({ name, email, password });
        state.error = null;
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    },
    loginSuccess(state, action) {
      const { email, password } = action.payload;
      const user = state.users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        state.isAuthenticated = true;
        state.user = user;
        state.error = null;
      } else {
        state.error = "Invalid email or password!";
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },

    // Clear error messages
    clearError(state) {
      state.error = null;
    },
  },
});

export const { signupSuccess, loginSuccess, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
