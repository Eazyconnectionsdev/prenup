import Axios from "@/lib/ApiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const LoginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/auth/login", formData);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data?.error) {
      console.log("🚀 ~ Getting Error in login thunk ~ error:", error);

        return rejectWithValue(error.response.data.error);
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
      console.log("🚀 ~ Getting Error in register thunk ~ error:", error);
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
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
      console.log("🚀 ~ Getting Error in logout thunk ~ error:", error);
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);