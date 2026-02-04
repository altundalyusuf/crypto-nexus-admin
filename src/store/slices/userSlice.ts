import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUsersFromServer } from "@/app/actions/getUsers";

// 1. Define strict types
export interface UserData {
  id: string;
  email: string;
  fullName: string;
  status: "Active" | "Banned" | "Pending";
  lastLogin: string;
}

interface UserState {
  users: UserData[];
  filteredUsers: UserData[]; // Users displayed in the table
  searchQuery: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  searchQuery: "",
  status: "idle",
  error: null,
};

// 2. Async Thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await getUsersFromServer();
      return users;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch user list");
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Redux Search Logic (Client-side filtering of server data)
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      const query = action.payload.toLowerCase();

      // Filter logic happens here (or could be server-side in a real app)
      state.filteredUsers = state.users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query),
      );
    },
    updateUserStatusInStore: (
      state,
      action: PayloadAction<{ userId: string; status: string }>,
    ) => {
      const { userId, status } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        // Update Master List
        state.users[userIndex].status = status as UserData["status"];

        // Update Filtered List (Re-filter from master to ensure consistency)
        const query = state.searchQuery.toLowerCase();
        state.filteredUsers = state.users.filter(
          (user) =>
            user.email.toLowerCase().includes(query) ||
            user.fullName.toLowerCase().includes(query),
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        // Initialize filtered list with all users
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, updateUserStatusInStore } = userSlice.actions;
export default userSlice.reducer;
