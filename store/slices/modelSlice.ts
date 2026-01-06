"use client";

import { createSlice } from "@reduxjs/toolkit";

type ModelType = "invite-partner";

interface modelState {
  type: ModelType | null;
  isOpen: boolean;
}

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
