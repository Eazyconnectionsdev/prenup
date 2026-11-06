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


// Starts the client's legal matter and issues its Case ID. This is the only
// place a Case ID is created: registering, inviting a partner and joining as
// a partner never make one. Idempotent, so a retry returns the same case.
export const startCase = createAsyncThunk(
  "cases/startCase",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post("/cases", {});
      return data as { _id: string; caseNumber: string | null };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
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
