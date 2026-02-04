import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { getUsersFromServer } from "@/app/actions/getUsers";

// Define the User type strictly
interface User {
  id: string;
  email: string;
}

// Define the Auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunk for Login
// This handles the async Supabase call and returns the result to the reducer
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      if (!data.user || !data.user.email) {
        return rejectWithValue("User data is missing");
      }

      // Return only serializable data (Redux best practice)
      return {
        id: data.user.id,
        email: data.user.email,
      };
    } catch (error) {
      console.error("Login error detail:", error);
      return rejectWithValue("An unexpected error occurred during login");
    }
  },
);

// Async Thunk for Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) return rejectWithValue(error.message);
    return null;
  },
);

// Async Thunk for Fetching Users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  // Call Server Action
  const users = await getUsersFromServer();
  return users;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions if needed (e.g., clear error)
    clearError: (state) => {
      state.error = null;
    },
    // Manually set user (e.g., from local storage or session check)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Login Lifecycle
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Handle Logout Lifecycle
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
