"use client";

import { createSlice } from "@reduxjs/toolkit";
import { getCasesDetails } from "../asyncThunk/casesThunk";

interface CasesState {
  isLoading: boolean;
  status: any;
}

const initialState: CasesState = {
  isLoading: false,
  status: {},
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

      })
      .addCase(getCasesDetails.rejected, (state) => {
        state.isLoading = false;
        state.status = {};
      });
  },
});

export const {} = CasesSlice.actions;
export default CasesSlice.reducer;
