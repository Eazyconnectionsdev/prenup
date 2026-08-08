"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCasesDetails } from "../asyncThunk/casesThunk";

/* ---------- Shared sub-shapes ---------- */

export interface SectionStatus {
  submitted: boolean;
  submittedBy: string | null;
  submittedAt: string | null;
  locked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
  unlockedBy: string | null;
  unlockedAt: string | null;
}

// Keyed by section name. Only "myInformation" is guaranteed present early
// on — the rest appear once that section has actually been touched.
export interface CaseStatus {
  myInformation?: SectionStatus;
  partnerInformation?: SectionStatus;
  jointInformation?: SectionStatus;
  independentLegalAdvice?: SectionStatus;
  _id?: string;
}

export interface PreQuestionnaire {
  answers: unknown[];
  selectedLawyer: string | null;
  selectedAt: string | null;
  submitted: boolean;
  submittedBy: string | null;
  submittedAt: string | null;
  locked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
}

export interface CaseOwner {
  _id: string;
  email: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  dateOfBirth: string | null;
  role: string;
  endUserType: "user1" | "user2" | null;
  invitedUser: string | null;
  invitedBy: string | null;
  phone: string | null;
  marketingConsent: boolean;
  acceptedTerms: boolean;
  emailVerified: boolean;
  paymentDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseApproval {
  user1Approved: boolean;
  user1ApprovedAt: string | null;
  user2Approved: boolean;
  user2ApprovedAt: string | null;
  lawyerApproved: boolean;
  lawyerApprovedAt: string | null;
  approvedLawyer: string | null;
  caseManagerApproved: boolean;
  caseManagerApprovedAt: string | null;
  approvedBy: string | null;
}

// The actual submitted answers for a "…Information" section. Extend this
// as more sub-sections (family, financials, etc.) get added on the backend.
export interface InformationSection {
  personalInformation?: Record<string, unknown>;
  legalDeclaration?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface JointInformationSection {
  JointInformation?: Record<string, unknown>;
  [key: string]: unknown;
}

/* ---------- Full case payload (what getCasesDetails resolves to) ---------- */

export interface CaseDetails {
  _id: string;
  title: string;
  inviteCredentials: unknown;
  owner: CaseOwner;
  invitedUser: unknown;
  invitedEmail: string | null;
  inviteToken: string | null;
  inviteTokenExpires: string | null;
  preQuestionnaireUser1: PreQuestionnaire;
  preQuestionnaireUser2: PreQuestionnaire;
  approval: CaseApproval;
  status: CaseStatus;
  fullyLocked: boolean;
  fullyLockedBy: string | null;
  fullyLockedAt: string | null;
  workflowStatus: string;
  assignedCaseManager: string | null;
  createdAt: string;
  updatedAt: string;
  myInformation?: InformationSection;
  partnerInformation?: InformationSection;
}

/* ---------- Slice state ---------- */

interface CasesState {
  isLoading: boolean;
  caseId: string | null;
  title: string;
  owner: CaseOwner | null;
  status: CaseStatus;
  preQuestionnaireUser1: PreQuestionnaire | Record<string, never>;
  preQuestionnaireUser2: PreQuestionnaire | Record<string, never>;
  approval: CaseApproval | null;
  fullyLocked: boolean;
  workflowStatus: string;
  myInformation: InformationSection;
  partnerInformation: InformationSection;
  jointInformation : JointInformationSection;
}

const initialState: CasesState = {
  isLoading: false,
  caseId: null,
  title: "",
  owner: null,
  status: {},
  preQuestionnaireUser1: {},
  preQuestionnaireUser2: {},
  approval: null,
  fullyLocked: false,
  workflowStatus: "DRAFT",
  myInformation: {},
  partnerInformation: {},
  jointInformation: {},
};

const CasesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
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
          state.status = payload.status;
          state.preQuestionnaireUser1 = payload.preQuestionnaireUser1;
          state.preQuestionnaireUser2 = payload.preQuestionnaireUser2;
          state.approval = payload.approval;
          state.fullyLocked = payload.fullyLocked;
          state.workflowStatus = payload.workflowStatus;
          state.myInformation = payload.myInformation ?? {};
          state.partnerInformation = payload.partnerInformation ?? {};
          state.partnerInformation = payload.partnerInformation ?? {};
        },
      )
      .addCase(getCasesDetails.rejected, (state) => {
        state.isLoading = false;
        state.status = {};
        state.owner = null;
      });
  },
});

export const {} = CasesSlice.actions;
export default CasesSlice.reducer;