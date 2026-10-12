"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCasesDetails } from "../asyncThunk/casesThunk";
import type { CaseApproval, CaseDetails, CasesState, SectionStatus } from "@/types/store/cases-slice";

/* ---------- Shared sub-shapes ---------- */
// Keyed by section name. Only "myInformation" is guaranteed present early
// on — the rest appear once that section has actually been touched.
/* ---------- Slice state ---------- */
const initialState: CasesState = {
  isLoading: false,
  caseId: null,
  title: "",
  owner: null,
  invitedUser : null,
  status: {},
  preQuestionnaireUser1: {},
  preQuestionnaireUser2: {},
  approval: null,
  fullyLocked: false,
  workflowStatus: "DRAFT",
  agreementType: null,
  myInformation: {},
  partnerInformation: {},
  jointInformation: {},
};

const CasesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    updateApproval(state, action: PayloadAction<Partial<CaseApproval>>) {
      if (state.approval) {
        state.approval = { ...state.approval, ...action.payload };
      }
    },
    // Set right after the service selector saves, so the dashboard status
    // updates without waiting for the case to be refetched.
    setAgreementType(state, action: PayloadAction<string | null>) {
      state.agreementType = action.payload;
    },
    updateJointInformationStatus(state, action: PayloadAction<Partial<SectionStatus>>) {
      state.status = {
        ...state.status,
        jointInformation: {
          ...(state.status.jointInformation as SectionStatus),
          ...action.payload,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCasesDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCasesDetails.fulfilled,
        (state, { payload }: PayloadAction<CaseDetails>) => {
          state.isLoading = false;
          state.caseId = payload._id;
          state.title = payload.title;
          state.owner = payload.owner;
          state.invitedUser = payload.invitedUser;
          state.status = payload.status;
          state.preQuestionnaireUser1 = payload.preQuestionnaireUser1;
          state.preQuestionnaireUser2 = payload.preQuestionnaireUser2;
          state.approval = payload.approval;
          state.fullyLocked = payload.fullyLocked;
          state.workflowStatus = payload.workflowStatus;
          state.agreementType = payload.agreementType ?? null;
          state.myInformation = payload.myInformation ?? {};
          state.partnerInformation = payload.partnerInformation ?? {};
          state.jointInformation = payload.jointInformation ?? {};
        },
      )
      .addCase(getCasesDetails.rejected, (state) => {
        state.isLoading = false;
        state.status = {};
        state.owner = null;
      });
  },
});

export const { updateApproval, setAgreementType, updateJointInformationStatus } =
  CasesSlice.actions;
export default CasesSlice.reducer;