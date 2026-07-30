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
        console.log("🚀 ~ Getting Error in login thunk ~ error:", error);

        return rejectWithValue(error.response.data);
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
        console.log("🚀 ~ Getting Error in register thunk ~ error:", error);
        return rejectWithValue(error.response.data);
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
