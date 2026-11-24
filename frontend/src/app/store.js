import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import portfolioReducer from "../features/portfolio/portfolioSlice.js";
import pricesReducer from "../features/prices/pricesSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    prices: pricesReducer,
  },
});
