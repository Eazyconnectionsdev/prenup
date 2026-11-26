"use client";

import { UpdateCaseSectionForm } from "@/components/caseManager/UpdateCaseSectionForm";
import FamilyDependents from "../../components/forms/FamilyDependents";

// Same form the case detail Forms tab shows, so staff edit one version of it.
export default function FamilyDependentsPage() {
  return <UpdateCaseSectionForm step="family-and-dependents" field="familyAndDependents" Form={FamilyDependents} />;
}
