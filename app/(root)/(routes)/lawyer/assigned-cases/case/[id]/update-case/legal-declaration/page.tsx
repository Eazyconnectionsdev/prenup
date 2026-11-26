"use client";

import { UpdateCaseSectionForm } from "@/components/caseManager/UpdateCaseSectionForm";
import LegalDeclarations from "../../components/forms/LegalDeclarations";

// Same form the case detail Forms tab shows, so staff edit one version of it.
export default function LegalDeclarationPage() {
  return <UpdateCaseSectionForm step="legal-declaration" field="legalDeclaration" Form={LegalDeclarations} />;
}
