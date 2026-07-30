"use client";

import { createSlice } from "@reduxjs/toolkit";
import { emailVerification, getFreshProfile, LoginUser, logOutUser, registerUser } from "@/store/asyncThunk/authThunk";

interface authState {
  isLoading: boolean;
  isAuthenticated : boolean;
  caseId: string | any;
  user: { [key: string]: any };
  message: string | null;
  submitError: string | null;
}

const initialState: authState = {
  isLoading: false,
  isAuthenticated : false,
  caseId: null,
  user: {},
  message: null,
  submitError: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserProfileData(state, {payload} ) {
      state.user = payload;
    },

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
        state.isAuthenticated = true;
        state.caseId = payload.caseId;
        state.user = payload.user;
        state.message = payload.message;
        state.submitError = null;
      })
      .addCase(LoginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = false;
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
        state.isLoading = false;
        state.user.email = payload.email;
        state.message = payload.message;
        state.submitError = null;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.user = {};
        state.message = null;
        state.submitError = payload as string;
      });

      // Check Email Verification
    builder
      .addCase(emailVerification.pending, (state) => {
        state.isLoading = true;
        state.submitError = null;
        state.message = null;
      })
      .addCase(emailVerification.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.caseId = payload.caseId;
        state.user = payload.user;
        state.message = payload.message;
        state.submitError = null;
      })
      .addCase(emailVerification.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = false;
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
        state.isAuthenticated = false;
        state.caseId = null;
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

      // fetch profile data
    builder
      .addCase(getFreshProfile.pending, (state) => {
        state.isLoading = true;
        state.submitError = null;
        state.message = null;
      })
      .addCase(getFreshProfile.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.caseId = payload.user.inviteCaseId;
        state.user = payload.user;
        state.message = null;
        state.submitError = null;
      })
      .addCase(getFreshProfile.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.message = null;
        state.user = {};
        state.submitError = payload as string;
      });
  },
});

export const { clearError, clearMessage, setUserProfileData } = AuthSlice.actions;
export default AuthSlice.reducer;
