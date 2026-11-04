"use client";

import { createContext, useContext, type ReactNode } from "react";

// Set by the `partner-…` pages when they show the real form, so the form reads
// and saves the other partner's answers instead of the signed-in partner's own.
const EditingPartnerContext = createContext(false);

export function EditingPartnerProvider({ children }: { children: ReactNode }) {
  return (
    <EditingPartnerContext.Provider value={true}>{children}</EditingPartnerContext.Provider>
  );
}

export function useEditingPartnerForm() {
  return useContext(EditingPartnerContext);
}
