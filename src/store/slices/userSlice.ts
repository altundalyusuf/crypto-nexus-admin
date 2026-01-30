import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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

// 2. Mock Data Generator (Simulating a DB response)
const generateMockUsers = (): UserData[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `usr_${i + 1}`,
    email: `user${i + 1}@example.com`,
    fullName: `User Name ${i + 1}`,
    status: i % 3 === 0 ? "Banned" : i % 2 === 0 ? "Pending" : "Active",
    lastLogin: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toISOString(),
  }));
};

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  searchQuery: "",
  status: "idle",
  error: null,
};

// 3. Async Thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateMockUsers();
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // REDUX SEARCH LOGIC: This is the critical interview point
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
      });
  },
});

export const { setSearchQuery } = userSlice.actions;
export default userSlice.reducer;
