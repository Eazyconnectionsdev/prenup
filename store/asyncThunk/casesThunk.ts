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


// Onboarding belongs to user 1 (case owner) only.
export const getOnboarding = createAsyncThunk(
  "cases/getOnboarding",
  async (caseId: string, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/onboarding`);
      return data as { completed: boolean; agreementType: string | null };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  "cases/completeOnboarding",
  async (
    {
      caseId,
      agreementType,
      residesInUK,
      understandsService,
    }: {
      caseId: string;
      agreementType: string;
      residesInUK: boolean;
      understandsService: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.post(`/cases/${caseId}/onboarding`, {
        agreementType,
        residesInUK,
        understandsService,
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
