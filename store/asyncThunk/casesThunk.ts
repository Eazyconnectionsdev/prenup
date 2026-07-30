import Axios from "@/lib/ApiConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getCasesDetails = createAsyncThunk(
  "cases/getStatus",
  async (caseId: any, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}`);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data?.error) {
      console.log("🚀 ~ Getting Error in getting cases details", error);

        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);
