import { createSlice } from "@reduxjs/toolkit";
import { initialData } from "../../data/mockData";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialData.users[0], // Default to Alex Admin
    allUsers: initialData.users,
  },
  reducers: {
    toggleRole: (state) => {
      // If current is admin (u1), switch to viewer (u2), and vice versa
      const nextUser =
        state.user.id === "u1" ? state.allUsers[1] : state.allUsers[0];
      state.user = nextUser;
    },
  },
});

export const { setUser,toggleRole } = authSlice.actions;
export default authSlice.reducer;
