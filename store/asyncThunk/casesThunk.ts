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

// ---------------------------------------------------------------- payment
//
// The price is the server's to decide, so neither of these sends an amount:
// getCasePayment asks what the chosen service costs, and payCase sends only
// the details typed on the payment screen.

export type CasePaymentInfo = {
  caseId: string;
  caseNumber: string | null;
  agreementType: string | null;
  serviceName: string | null;
  serviceDescription: string | null;
  amount: number;
  currency: string;
  display: string;
  // False until a service that can be paid for has been chosen
  payable: boolean;
  paid: boolean;
  paymentStatus: string;
  payment: {
    reference: string | null;
    status: string | null;
    display: string;
    cardBrand: string | null;
    cardLast4: string | null;
    paidAt: string | null;
  } | null;
};

export const getCasePayment = createAsyncThunk(
  "cases/getCasePayment",
  async (
    { caseId, service }: { caseId: string; service?: string | null },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/payment`, {
        params: service ? { service } : undefined,
      });
      return data as CasePaymentInfo;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);

export type PayCaseArgs = {
  caseId: string;
  // Omitted, the service already on the case is the one paid for
  agreementType?: string | null;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  nameOnCard: string;
  country: string;
  postalCode: string;
};

export const payCase = createAsyncThunk(
  "cases/payCase",
  async ({ caseId, agreementType, ...card }: PayCaseArgs, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/cases/${caseId}/pay`, {
        ...card,
        // Spaces are only there to make the number readable while typing
        cardNumber: card.cardNumber.replace(/\D/g, ""),
        ...(agreementType ? { agreementType } : {}),
      });
      return data as {
        paid: boolean;
        agreementType: string;
        serviceName: string;
        display: string;
        paymentStatus: string;
        workflowStatus: string;
        payment: CasePaymentInfo["payment"];
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Can't reach the server. Check your connection and try again.");
    }
  }
);
