import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 1. Define Strict Types for API Response
export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  color: string | null;
  iconUrl: string;
  marketCap: string;
  price: string;
  change: string; // 24h Price change
  rank: number;
}

interface MarketState {
  coins: Coin[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MarketState = {
  coins: [],
  status: "idle",
  error: null,
};

// 2. Async Thunk to fetch live data from Coinranking
export const fetchMarketData = createAsyncThunk(
  "market/fetchMarketData",
  async () => {
    // Using the public endpoint (No API Key needed for basic stats)
    const response = await fetch(
      "https://api.coinranking.com/v2/coins?limit=10",
    );
    const result = await response.json();

    if (result.status !== "success") {
      throw new Error("Failed to fetch coin data");
    }

    return result.data.coins as Coin[];
  },
);

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coins = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default marketSlice.reducer;
