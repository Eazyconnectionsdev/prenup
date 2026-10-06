"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { modelState } from "@/types/store/model-slice";

const initialState: modelState = {
  type: null,
  isOpen: false,
};

const ModelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    openInvitePartnerModel(state, action) {
      state.type = action.payload;
      state.isOpen = true;
    },
    closeModel(state) {
      state.type = null;
      state.isOpen = false;
    },
  },
});

export const { openInvitePartnerModel, closeModel } = ModelSlice.actions;
export default ModelSlice.reducer;
