import Axios from "@/lib/ApiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const LoginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/login", formData);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {

        return rejectWithValue(error.response.data);
      }
      if (error.code === "ECONNABORTED") {
        return rejectWithValue("The request timed out. Please try again.");
      }
      if (!error.response) {
        return rejectWithValue("Can't reach the server. Check your connection and try again.");
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData: any, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/register", formData);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      if (error.code === "ECONNABORTED") {
        return rejectWithValue("The request timed out. Please try again.");
      }
      if (!error.response) {
        return rejectWithValue("Can't reach the server. Check your connection and try again.");
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const logOutUser = createAsyncThunk(
  "auth/logOutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/logout");
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log("🚀 ~ Getting Error in logout thunk ~ error:", error);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const emailVerification = createAsyncThunk(
  "auth/emailVerification",
  async ({ otp, email }: any, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("auth/verify-otp", { otp, email });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log("🚀 ~ Getting Error in email verification thunk ~ error:", error);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/resend-otp", { email });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);

export const getFreshProfile = createAsyncThunk(
  "auth/getFreshProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("auth/me");
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log("🚀 ~ Getting Error in getFreshProfile thunk ~ error:", error);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);


export const acceptInvite = createAsyncThunk(
  "auth/acceptInvite",
  async (
    {
      token,
      caseId,
      password,
      firstName,
      lastName,
      email,
      phone,
    }: {
      token: string;
      caseId: string;
      password: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.post(
        "/auth/accept-invite",
        {
          token,
          caseId,
          password,
          firstName,
          lastName,
          email,
          phone,
        }
      );

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(
          "🚀 ~ Getting Error in accept invite thunk ~ error:",
          error
        );

        return rejectWithValue(error.response.data);
      }

      return rejectWithValue(
        "Something went wrong. Please try again."
      );
    }
  }
);


// Public: validates the emailed invite link, marks it opened, and returns the
// details used to prefill the partner registration form.
export const getInviteInfo = createAsyncThunk(
  "auth/getInviteInfo",
  async (
    { caseId, token }: { caseId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.get("/auth/invite-info", {
        params: { caseId, token },
      });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);

// Inviter view: what was typed, live status, and who actually registered.
export const getPartnerInvite = createAsyncThunk(
  "auth/getPartnerInvite",
  async (caseId: string, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/invite`);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);

// --- Password reset ------------------------------------------------------
// The backend answers request-reset identically for known and unknown
// emails, so a fulfilled result never confirms that an account exists.
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/request-reset", { email });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      if (error.code === "ECONNABORTED") {
        return rejectWithValue("The request timed out. Please try again.");
      }
      if (!error.response) {
        return rejectWithValue("Can't reach the server. Check your connection and try again.");
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

// Checks an emailed reset link before the form is shown; does not consume it.
export const validateResetToken = createAsyncThunk(
  "auth/validateResetToken",
  async (
    { email, token }: { email: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.post("/auth/validate-reset-token", {
        email,
        token,
      });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      if (!error.response) {
        return rejectWithValue("Can't reach the server. Check your connection and try again.");
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      token,
      newPassword,
    }: { email: string; token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      if (error.code === "ECONNABORTED") {
        return rejectWithValue("The request timed out. Please try again.");
      }
      if (!error.response) {
        return rejectWithValue("Can't reach the server. Check your connection and try again.");
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);
