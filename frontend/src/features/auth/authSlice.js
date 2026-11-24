import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../services/api.js";

const savedToken = localStorage.getItem("trade-sim-token");

export const signup = createAsyncThunk(
  "auth/signup",
  async (details, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", details);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: savedToken,
    user: null,
    isLoading: false,
    isRestoring: Boolean(savedToken),
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.isRestoring = false;
      localStorage.removeItem("trade-sim-token");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    [signup, login].forEach((action) => {
      builder
        .addCase(action.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state, { payload }) => {
          state.isLoading = false;
          state.token = payload.token;
          state.user = payload.user;
          localStorage.setItem("trade-sim-token", payload.token);
        })
        .addCase(action.rejected, (state, { payload }) => {
          state.isLoading = false;
          state.error = payload;
        });
    });

    builder
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isRestoring = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isRestoring = false;
        localStorage.removeItem("trade-sim-token");
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
