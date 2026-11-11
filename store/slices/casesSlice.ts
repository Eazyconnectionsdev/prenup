"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCasesDetails } from "../asyncThunk/casesThunk";
import { getFreshProfile } from "../asyncThunk/authThunk";
import type { CaseApproval, CaseDetails, CasesState, SectionStatus } from "@/types/store/cases-slice";

const initialState: CasesState = {
  isLoading: false,
  hasLoaded: false,
  caseId: null,
  caseNumber: null,
  title: "",
  owner: null,
  invitedUser : null,
  paymentCompleted : false,
  paymentStatus: "PENDING",
  payment: null,
  partnerInvited: false,
  invitedEmail: null,
  status: {},
  preQuestionnaireUser1: {},
  preQuestionnaireUser2: {},
  approval: null,
  fullyLocked: false,
  workflowStatus: "DRAFT",
  agreementType: null,
  assignedCaseManager: null,
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
      .addCase(getFreshProfile.fulfilled, (state, { payload }) => {
        if (payload?.user?.role !== "end_user") return;
        const current = payload.user.inviteCaseId;
        if (!current || (state.caseId && String(state.caseId) !== String(current))) {
          return initialState;
        }
      })
      .addCase(getCasesDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCasesDetails.fulfilled,
        (state, { payload }: PayloadAction<CaseDetails>) => {
          state.isLoading = false;
          state.hasLoaded = true;
          state.caseId = payload._id;
          state.caseNumber = payload.caseNumber ?? null;
          state.title = payload.title;
          state.owner = payload.owner;
          state.paymentCompleted = payload.paymentCompleted;
          state.paymentStatus = payload.paymentStatus ?? "PENDING";
          state.payment = payload.payment ?? null;
          state.invitedUser = payload.invitedUser;
          state.partnerInvited = Boolean(payload.partnerInvited);
          state.invitedEmail = payload.invitedEmail ?? null;
          state.status = payload.status;
          state.preQuestionnaireUser1 = payload.preQuestionnaireUser1;
          state.preQuestionnaireUser2 = payload.preQuestionnaireUser2;
          state.approval = payload.approval;
          state.fullyLocked = payload.fullyLocked;
          state.workflowStatus = payload.workflowStatus;
          state.agreementType = payload.agreementType ?? null;
          state.assignedCaseManager = payload.assignedCaseManager ?? null;
          state.myInformation = payload.myInformation ?? {};
          state.partnerInformation = payload.partnerInformation ?? {};
          state.jointInformation = payload.jointInformation ?? {};
          state.stages = payload.stages ?? null;
        },
      )
      .addCase(getCasesDetails.rejected, (state) => {
        state.isLoading = false;
        // Settled, just not with a case. Anything waiting on the fetch has to
        // stop waiting -- leaving this false would keep it loading for good.
        state.hasLoaded = true;
        state.status = {};
        state.owner = null;
      });
  },
});

export const { updateApproval, setAgreementType, updateJointInformationStatus } =
  CasesSlice.actions;
export default CasesSlice.reducer;