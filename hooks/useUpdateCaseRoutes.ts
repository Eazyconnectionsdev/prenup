"use client";

import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useUpdateCaseRoutes = () => {
  const pathname = usePathname();
  const params = useParams();

  const id = params?.id as string;

  const { status } = useSelector((state: RootState) => state.cases);

  const basePath = `/cm/case-manager/cases/${id}/update-case`;

  const steps = [
    {
      label: "Personal Information",
      slug: "personal-information",
      section: "myInformation",
      field: "personalInformation",
    },
    {
      label: "Legal Declaration",
      slug: "legal-declaration",
      section: "myInformation",
      field: "legalDeclaration",
    },
    {
      label: "Family & Dependents",
      slug: "family-and-dependents",
      section: "myInformation",
      field: "familyAndDependents",
    },
    {
      label: "Individual Assets",
      slug: "individual-assets",
      section: "myInformation",
      field: "individualAssets",
    },
    {
      label: "Income & Revenue",
      slug: "income-and-revenue",
      section: "myInformation",
      field: "incomeAndRevenue",
    },
    {
      label: "Liabilities & Debts",
      slug: "liabilities-and-debts",
      section: "myInformation",
      field: "liabilitiesAndDebts",
    },

    {
      label: "Partner Personal Information",
      slug: "partner-personal-information",
      section: "partnerInformation",
      field: "personalInformation",
    },
    {
      label: "Partner Legal Declaration",
      slug: "partner-legal-declaration",
      section: "partnerInformation",
      field: "legalDeclaration",
    },
    {
      label: "Partner Family & Dependents",
      slug: "partner-family-and-dependents",
      section: "partnerInformation",
      field: "familyAndDependents",
    },
    {
      label: "Partner Individual Assets",
      slug: "partner-individual-assets",
      section: "partnerInformation",
      field: "individualAssets",
    },
    {
      label: "Partner Income & Revenue",
      slug: "partner-income-and-revenue",
      section: "partnerInformation",
      field: "incomeAndRevenue",
    },
    {
      label: "Partner Liabilities & Debts",
      slug: "partner-liabilities-and-debts",
      section: "partnerInformation",
      field: "liabilitiesAndDebts",
    },

    {
      label: "Joint Assets",
      slug: "joint-assets",
      section: "jointInformation",
      field: "jointAssets",
    },
    {
      label: "Joint Income & Revenue",
      slug: "joint-income-and-revenue",
      section: "jointInformation",
      field: "jointIncomeAndRevenue",
    },
    {
      label: "Joint Liabilities & Debts",
      slug: "joint-liabilities-and-debts",
      section: "jointInformation",
      field: "jointLiabilitiesAndDebts",
    },

    {
      label: "Solicitor Details",
      slug: "solicitor-details",
      section: "independentLegalAdvice",
      field: "solicitorDetails",
    },
    {
      label: "Lawyer Questionnaire",
      slug: "lawyer-questionnaire",
      section: "independentLegalAdvice",
      field: "lawyerQuestionnaire",
    },
    {
      label: "Review & Sign",
      slug: "review-and-sign",
      section: "independentLegalAdvice",
      field: "reviewAndSign",
    },
  ];

  return steps.map((step) => ({
    label: step.label,
    href: `${basePath}/${step.slug}`,
    isActive: pathname === `${basePath}/${step.slug}`,
    isCompleted:
      (status as Record<string, Record<string, { submitted?: boolean }>>)?.[
        step.section
      ]?.[step.field]?.submitted ?? false,
  }));
};