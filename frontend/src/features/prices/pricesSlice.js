import { createSlice } from "@reduxjs/toolkit";
import { initialStocks } from "../../data/stocks.js";

const pricesSlice = createSlice({
  name: "prices",
  initialState: {
    stocks: initialStocks,
    connected: false,
  },
  reducers: {
    pricesUpdated(state, { payload }) {
      state.stocks = payload;
    },
    connectionChanged(state, { payload }) {
      state.connected = payload;
    },
  },
});

export const { pricesUpdated, connectionChanged } = pricesSlice.actions;
export default pricesSlice.reducer;
