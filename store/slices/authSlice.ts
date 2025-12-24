"use client";

import { createSlice } from "@reduxjs/toolkit";
import { LoginUser, logOutUser, registerUser } from "@/store/asyncThunk/authThunk";

interface authState {
  isLoading: boolean;
  jwtToken: string | null;
  caseId: string | any;
  user: { [key: string]: any };
  message: string | null;
  submitError: string | null;
}

const initialState: authState = {
  isLoading: true,
  jwtToken: null,
  caseId: null,
  user: {},
  message: null,
  submitError: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.submitError = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    // Check Login
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
        state.submitError = null;
        state.message = null;
      })
      .addCase(LoginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.caseId = payload.caseId;
        state.jwtToken = payload.token;
        state.user = payload.user;
        state.message = payload.message;
        state.submitError = null;
      })
      .addCase(LoginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.message = null;
        state.user = {};
        state.submitError = payload as string;
      });

    // Check SignUp
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.submitError = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = true;
        state.caseId = payload.caseId;
        state.jwtToken = payload.token;
        state.user = payload.user;
        state.message = payload.message;
        state.submitError = null;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.user = {};
        state.message = null;
        state.submitError = payload as string;
      });

      // Logout User
    builder
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
        state.submitError = null;
        state.message = null;
      })
      .addCase(logOutUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.caseId = null;
        state.jwtToken = null;
        state.user = {};
        state.message = null;
        state.submitError = null;
      })
      .addCase(logOutUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.message = null;
        state.user = {};
        state.submitError = payload as string;
      });
  },
});

export const { clearError, clearMessage } = AuthSlice.actions;
export default AuthSlice.reducer;
