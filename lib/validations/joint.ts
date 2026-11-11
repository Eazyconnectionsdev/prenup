import { z } from "zod";
import {
  checkListAnswered,
  checkTreatment,
  optionalAmount,
  optionalText,
  requiredAmount,
  requiredChoice,
  requiredText,
  rowShape,
  treatmentShape,
  yesNo,
} from "@/lib/validations/fields";

/**
 * The joint section and the matrimonial agreement: the three forms the couple
 * fill in together, and the one that records what they want the agreement to
 * say.
 *
 * Same rule as the personal forms (see ./questionnaire.ts): a question that
 * has to be answered for the rest to make sense, a field that identifies a row
 * the person chose to add, and the follow-up box behind a choice that asks for
 * one. Everything else is only checked for shape.
 */

/* ---------------------------------------------------------------------- */
/* Joint assets                                                            */
/* ---------------------------------------------------------------------- */

const sharedRealEstateRow = rowShape({
  addressLine1: requiredText("Address line 1", 160),
  addressLine2: optionalText(160),
  postcode: requiredText("Postcode", 16),
  propertyType: requiredChoice("the property type"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  mortgageBalance: optionalAmount("Mortgage balance"),
  earlyPenalty: optionalAmount("Early penalty charges"),
  ownershipPercentage: optionalAmount("Ownership percentage"),
  thirdPartyInterest: optionalText(60),
  thirdPartyDetail: optionalText(1000),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine((row, ctx) => {
    if (row.valueUnknown === true) return;
    if (!String(row.value ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: 'Enter the property value, or tick "I am unsure"',
      });
    }
  });

const sharedSavingsRow = rowShape({
  accountHolder: requiredChoice("whose account this is"),
  institution: requiredText("The bank or institution", 120),
  accountType: requiredChoice("the account type"),
  balance: requiredAmount("Balance"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

const sharedBusinessRow = rowShape({
  name: requiredText("The business name", 160),
  entityType: requiredChoice("the entity type"),
  turnover: optionalAmount("Turnover"),
  netProfit: optionalAmount("Net profit"),
  ownershipPercent: requiredAmount("The combined ownership percentage"),
  valueOfStake: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  justification: optionalText(1000),
  directorLoanBalance: optionalAmount("Director loan balance"),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine((row, ctx) => {
    if (row.valueUnknown === true) return;
    if (!String(row.valueOfStake ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["valueOfStake"],
        message: 'Enter the value of the stake, or tick "I am unsure"',
      });
    }
  });

const sharedIPRow = rowShape({
  name: requiredText("The asset name", 160),
  ipType: requiredChoice("the type of intellectual property"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  registrationNumber: optionalText(80),
  description: optionalText(1000),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

const sharedChattelRow = rowShape({
  description: requiredText("A description", 300),
  category: requiredChoice("the category"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

const sharedOtherAssetRow = rowShape({
  description: requiredText("A description", 300),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

export const jointAssetsSchema = z
  .object({
    livingArrangement: requiredChoice("your living arrangement"),
    rentDuration: optionalText(120),
    monthlyRent: optionalAmount("Monthly rent"),
    thirdPartyDescription: optionalText(1000),
    otherDescription: optionalText(1000),

    hasSharedRealEstate: yesNo,
    sharedRealEstate: z.array(sharedRealEstateRow).default([]),
    hasSharedSavings: yesNo,
    sharedSavings: z.array(sharedSavingsRow).default([]),
    hasSharedBusinesses: yesNo,
    sharedBusinesses: z.array(sharedBusinessRow).default([]),
    hasSharedIP: yesNo,
    sharedIP: z.array(sharedIPRow).default([]),
    hasSharedChattels: yesNo,
    sharedChattels: z.array(sharedChattelRow).default([]),
    hasSharedOtherAssets: yesNo,
    sharedOtherAssets: z.array(sharedOtherAssetRow).default([]),
  })
  .superRefine((value, ctx) => {
    // Each living arrangement opens its own follow-up, and choosing it
    // without answering that leaves the question half-answered.
    if (value.livingArrangement === "Rent") {
      if (!value.rentDuration?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["rentDuration"],
          message: "Tell us how long you have been renting",
        });
      }
      if (!value.monthlyRent?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["monthlyRent"],
          message: "Enter the monthly rent",
        });
      }
    }
    if (value.livingArrangement === "ThirdParty" && !value.thirdPartyDescription?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["thirdPartyDescription"],
        message: "Describe the arrangement with the third party",
      });
    }
    if (value.livingArrangement === "Other" && !value.otherDescription?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["otherDescription"],
        message: "Describe your living arrangement",
      });
    }

    checkListAnswered(value.hasSharedRealEstate, value.sharedRealEstate, "sharedRealEstate", "Add at least one property", ctx);
    checkListAnswered(value.hasSharedSavings, value.sharedSavings, "sharedSavings", "Add at least one account", ctx);
    checkListAnswered(value.hasSharedBusinesses, value.sharedBusinesses, "sharedBusinesses", "Add at least one business", ctx);
    checkListAnswered(value.hasSharedIP, value.sharedIP, "sharedIP", "Add at least one asset", ctx);
    checkListAnswered(value.hasSharedChattels, value.sharedChattels, "sharedChattels", "Add at least one item", ctx);
    checkListAnswered(value.hasSharedOtherAssets, value.sharedOtherAssets, "sharedOtherAssets", "Add at least one asset", ctx);
  });

/* ---------------------------------------------------------------------- */
/* Joint income and revenue                                                */
/* ---------------------------------------------------------------------- */

const sharedIncomeRow = rowShape({
  description: requiredText("A description", 300),
  // Free text: "Company X", "ABC Property Management".
  source: requiredText("The income source", 200),
  annualIncome: requiredAmount("The annual income"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

export const jointIncomeSchema = z
  .object({
    hasSharedIncome: yesNo,
    sharedIncomeRows: z.array(sharedIncomeRow).default([]),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(
      value.hasSharedIncome,
      value.sharedIncomeRows,
      "sharedIncomeRows",
      "Add at least one shared income source",
      ctx,
    );
  });

/* ---------------------------------------------------------------------- */
/* Joint liabilities and debts                                             */
/* ---------------------------------------------------------------------- */

const sharedDebtRow = rowShape({
  lenderName: requiredText("The lender's name", 160),
  liabilityType: requiredChoice("the type of liability"),
  outstandingBalance: requiredAmount("The outstanding balance"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

export const jointLiabilitiesSchema = z
  .object({
    hasSharedDebts: yesNo,
    sharedDebts: z.array(sharedDebtRow).default([]),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(
      value.hasSharedDebts,
      value.sharedDebts,
      "sharedDebts",
      "Add at least one shared debt",
      ctx,
    );
  });

/* ---------------------------------------------------------------------- */
/* Matrimonial agreement                                                   */
/* ---------------------------------------------------------------------- */

const inheritanceEntry = rowShape({
  recipientPartner: requiredChoice("who the inheritance is for"),
  inheritanceStatus: requiredChoice("the status"),
  composition: requiredText("What the inheritance consists of", 1000),
  originalAmount: optionalAmount("Original amount"),
  originalCurrency: optionalText(10),
  gbpEquivalent: requiredAmount("The GBP equivalent"),
  basisOfEstimate: optionalText(1000),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

/**
 * Every question on this form starts on a default answer, so what is left to
 * check is the box each "Custom" choice opens, and the two lists.
 */
export const matrimonialAgreementSchema = z
  .object({
    futureAssetsTreatment: requiredChoice("how future assets should be treated"),
    customFutureAssets: optionalText(2000),

    futureGiftsTreatment: requiredChoice("how future gifts should be treated"),
    customFutureGifts: optionalText(2000),

    inheritanceSelection: requiredChoice("your inheritance position"),
    inheritanceEntries: z.array(inheritanceEntry).default([]),

    spousalMaintenanceIntention: requiredChoice("your maintenance intentions"),
    customSpousalMaintenance: optionalText(2000),

    criticalIllnessSafeguard: requiredChoice("the critical illness safeguard"),
    customHealthSafeguards: optionalText(2000),

    deathWillsAlignment: requiredChoice("how wills should align"),

    reviewTriggerType: requiredChoice("when the agreement should be reviewed"),
    standardMilestones: z.array(z.string()).default([]),
    customReviewTriggers: optionalText(2000),

    specialCircumstances: z
      .object({
        pregnancyOrAdoption: yesNo,
        sharedBusiness: yesNo,
        financialReliance: yesNo,
        coOwnedRealEstate: yesNo,
        highValueAssets: yesNo,
        priorDependents: yesNo,
      })
      .loose(),
    specialCircumstancesOverview: optionalText(4000),
  })
  .superRefine((value, ctx) => {
    const requireWhenCustom = (
      choice: string,
      custom: string | undefined,
      path: string,
      message: string,
    ) => {
      if (choice === "Custom" && !custom?.trim()) {
        ctx.addIssue({ code: "custom", path: [path], message });
      }
    };

    requireWhenCustom(
      value.futureAssetsTreatment,
      value.customFutureAssets,
      "customFutureAssets",
      "Describe how future assets should be treated",
    );
    requireWhenCustom(
      value.futureGiftsTreatment,
      value.customFutureGifts,
      "customFutureGifts",
      "Describe how future gifts should be treated",
    );
    requireWhenCustom(
      value.spousalMaintenanceIntention,
      value.customSpousalMaintenance,
      "customSpousalMaintenance",
      "Describe your maintenance intentions",
    );
    requireWhenCustom(
      value.criticalIllnessSafeguard,
      value.customHealthSafeguards,
      "customHealthSafeguards",
      "Describe the safeguards you have in mind",
    );
    requireWhenCustom(
      value.reviewTriggerType,
      value.customReviewTriggers,
      "customReviewTriggers",
      "Describe what should trigger a review",
    );

    // "We expect an inheritance" with nothing logged says nothing.
    if (value.inheritanceSelection === "LogDetails" && value.inheritanceEntries.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["inheritanceEntries"],
        message: "Add the details of at least one inheritance",
      });
    }

    // Likewise choosing the standard review milestones and then clearing all
    // of them: nothing would trigger a review.
    if (value.reviewTriggerType === "Standard" && value.standardMilestones.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["standardMilestones"],
        message: "Choose at least one milestone",
      });
    }

    // The overview is what the case manager reads to size the case, so it is
    // required exactly when something out of the ordinary has been flagged.
    const flagged = Object.values(value.specialCircumstances).some((v) => v === "Yes");
    if (flagged && !value.specialCircumstancesOverview?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["specialCircumstancesOverview"],
        message: "Tell us about the circumstances you have flagged",
      });
    }
  });
