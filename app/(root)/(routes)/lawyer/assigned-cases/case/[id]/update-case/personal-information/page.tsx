"use client";

import { UpdateCaseSectionForm } from "@/components/caseManager/UpdateCaseSectionForm";
import PersonalInformation from "../../components/forms/PersonalInformation";

// Same form the case detail Forms tab shows, so staff edit one version of it.
export default function PersonalInformationPage() {
  return <UpdateCaseSectionForm step="personal-information" field="personalInformation" Form={PersonalInformation} />;
}
