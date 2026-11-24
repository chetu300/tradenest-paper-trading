import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../services/api.js";

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/portfolio");
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const placeTrade = createAsyncThunk(
  "portfolio/placeTrade",
  async (order, { rejectWithValue }) => {
    try {
      // Send the buy/sell request, then fetch portfolio data for the new wallet balance.
      const { data: result } = await api.post("/trades", order);
      const { data: portfolio } = await api.get("/portfolio");
      return { result, portfolio };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    data: null,
    isLoading: false,
    isTrading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearPortfolioMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.data = payload;
      })
      .addCase(fetchPortfolio.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(placeTrade.pending, (state) => {
        state.isTrading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(placeTrade.fulfilled, (state, { payload }) => {
        state.isTrading = false;
        state.data = payload.portfolio;
        state.message = payload.result.message;
      })
      .addCase(placeTrade.rejected, (state, { payload }) => {
        state.isTrading = false;
        state.error = payload;
      });
  },
});

export const { clearPortfolioMessage } = portfolioSlice.actions;
export default portfolioSlice.reducer;
