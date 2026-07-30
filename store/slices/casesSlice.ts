"use client";

import { createSlice } from "@reduxjs/toolkit";
import { getCasesDetails } from "../asyncThunk/casesThunk";

interface CasesState {
  isLoading: boolean;
  status: any;
  preQuestionnaireUser1: any;
  preQuestionnaireUser2: any;
}

const initialState: CasesState = {
  isLoading: false,
  status: {},
  preQuestionnaireUser1: {},
  preQuestionnaireUser2: {},
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
      .addCase(getCasesDetails.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.status = payload.status;
        state.preQuestionnaireUser1 = payload.preQuestionnaireUser1;
        state.preQuestionnaireUser2 = payload.preQuestionnaireUser2;

      })
      .addCase(getCasesDetails.rejected, (state) => {
        state.isLoading = false;
        state.status = {};
      });
  },
});

export const {} = CasesSlice.actions;
export default CasesSlice.reducer;
