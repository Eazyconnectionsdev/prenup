import { z } from "zod";
import {
  checkListAnswered,
  checkTreatment,
  mustConfirm,
  optionalAmount,
  optionalDate,
  optionalText,
  requiredAmount,
  requiredChoice,
  requiredDate,
  requiredText,
  rowShape,
  treatmentShape,
  yesNo,
} from "@/lib/validations/fields";

/**
 * What each questionnaire form has to have before it can be submitted.
 *
 * Two rules decide what counts as required, so that nothing becomes required
 * that the form did not already present as such:
 *
 *  1. A field the form marks with an asterisk, or asks as a question that has
 *     to be answered to make sense of the rest.
 *  2. A field that identifies a row the person chose to add -- having said
 *     "yes, I own property" and pressed "Add property", a row with no address
 *     and no value is not an answer, it is noise in the agreement.
 *
 * Anything else stays optional, and is only checked for being the right shape
 * (a number where a number belongs, a real date where a date belongs).
 */

/* ---------------------------------------------------------------------- */
/* 1. Personal information                                                 */
/* ---------------------------------------------------------------------- */

export const personalInfoSchema = z
  .object({
    firstName: requiredText("Legal first name", 50),
    middleName: optionalText(100),
    lastName: requiredText("Legal last name", 50),
    dateOfBirth: requiredDate("Date of birth"),
    languageFluency: requiredChoice("your level of English fluency"),
    nationality: requiredChoice("your nationality"),
    domicileStatus: requiredChoice("your domicile or residency status"),
    currentProfession: optionalText(120),
    street1: optionalText(160),
    city: optionalText(80),
    county: optionalText(160),
    postcode: optionalText(16),
    marriageDate: optionalDate("Planned wedding date"),
  })
  .superRefine((value, ctx) => {
    // The agreement is between adults; the form said so with a toast after the
    // event, which let a under-18 date of birth reach the server first.
    const dob = new Date(value.dateOfBirth);
    if (Number.isNaN(dob.getTime())) return;

    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;

    if (dob.getTime() > now.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Date of birth cannot be in the future",
      });
    } else if (age < 18) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Parties must be at least 18 years of age",
      });
    }
  });

/* ---------------------------------------------------------------------- */
/* 2. Legal declaration                                                    */
/* ---------------------------------------------------------------------- */

// Every declaration is a statement the person is confirming, so an unticked
// box is an unanswered question rather than a "no".
export const legalDeclarationSchema = z.object({
  agreementObjectives: requiredText("An overview of what you are aiming to achieve", 1500),
  livingSituationFuture: requiredText("Your living situation answer", 1500),
  confirmPersonalEffects: mustConfirm("Confirm how personal possessions should be treated"),
  confirmHouseholdDivision: mustConfirm("Confirm how household items should be divided"),
  acknowledgeCourtChildren: mustConfirm("Acknowledge the court's powers over children's welfare"),
  confirmCostSharing: mustConfirm("Confirm how the costs will be shared"),
  confirmUndueInfluence: mustConfirm("Confirm you understand the undue influence point"),
  confirmIla: mustConfirm("Confirm you understand the independent legal advice point"),
  confirmPlatformDisclaimer: mustConfirm("Confirm you have read the platform disclaimer"),
  confirmAccuracy: mustConfirm("Confirm the information you have given is accurate"),
});

/* ---------------------------------------------------------------------- */
/* 3. Family and dependents                                                */
/* ---------------------------------------------------------------------- */

const childRow = rowShape({
  fullName: requiredText("The child's full name", 120),
  dob: requiredDate("The child's date of birth"),
  parentalRelationship: requiredChoice("the parental relationship"),
});

export const familySchema = z
  .object({
    priorMarriageStatus: requiredChoice("whether you have previously been married"),
    isLegallySeparated: z.boolean().optional().default(false),
    hasLivingChildren: requiredChoice("whether you have living children"),
    children: z.array(childRow).default([]),
    futureParentalIntentions: requiredChoice("your intentions about children"),
    hasFamilyPets: requiredChoice("whether you have family pets"),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(
      value.hasLivingChildren,
      value.children,
      "children",
      "Add the details of at least one child",
      ctx,
    );
  });

/* ---------------------------------------------------------------------- */
/* 4. Individual assets                                                    */
/* ---------------------------------------------------------------------- */

/**
 * A value box paired with an "I am unsure" checkbox: the amount is required
 * unless the person has said they do not know it.
 */
const valueOrUnsure = (
  label: string,
  valueField: "value" | "valueOfStake",
): ((
  row: Record<string, unknown>,
  ctx: z.RefinementCtx,
) => void) => (row, ctx) => {
  if (row.valueUnknown === true) return;
  const raw = String(row[valueField] ?? "").trim();
  if (!raw) {
    ctx.addIssue({
      code: "custom",
      path: [valueField],
      message: `${label}, or tick "I am unsure"`,
    });
    return;
  }
  const amount = Number(raw.replace(/[,£$\s]/g, ""));
  if (!Number.isFinite(amount) || amount < 0) {
    ctx.addIssue({ code: "custom", path: [valueField], message: `${label} must be a number` });
  }
};

const realEstateRow = rowShape({
  addressLine1: requiredText("Address line 1", 160),
  addressLine2: optionalText(160),
  postcode: requiredText("Postcode", 16),
  propertyType: requiredChoice("the property type"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  mortgageBalance: optionalAmount("Mortgage balance"),
  earlyPenalty: optionalAmount("Early penalty charges"),
  ownershipShare: optionalAmount("Ownership share"),
  ownershipMode: optionalText(60),
  coOwnerDetails: optionalText(500),
  thirdPartyInterest: optionalText(60),
  thirdPartyDetail: optionalText(500),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the property value", "value"));

const savingsRow = rowShape({
  institution: requiredText("The bank or institution", 120),
  accountType: requiredChoice("the account type"),
  balance: requiredAmount("Balance"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

const pensionRow = rowShape({
  provider: requiredText("The pension provider", 120),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the pension value", "value"));

const businessRow = rowShape({
  name: requiredText("The business name", 160),
  entityType: requiredChoice("the entity type"),
  turnover: optionalAmount("Turnover"),
  netProfit: optionalAmount("Net profit"),
  ownershipPercent: requiredAmount("Your ownership percentage"),
  valueOfStake: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  justification: optionalText(1000),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the value of your stake", "valueOfStake"));

const ipRow = rowShape({
  name: requiredText("The asset name", 160),
  ipType: requiredChoice("the type of intellectual property"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  registrationNumber: optionalText(80),
  description: optionalText(1000),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the value", "value"));

const chattelRow = rowShape({
  description: requiredText("A description", 300),
  category: requiredChoice("the category"),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the value", "value"));

const otherAssetRow = rowShape({
  description: requiredText("A description", 300),
  value: optionalText(20),
  valueUnknown: z.boolean().optional().default(false),
  ...treatmentShape,
})
  .superRefine((row, ctx) => checkTreatment(row, ctx))
  .superRefine(valueOrUnsure("Enter the value", "value"));

export const individualAssetsSchema = z
  .object({
    hasRealEstate: yesNo,
    realEstate: z.array(realEstateRow).default([]),
    hasSavings: yesNo,
    savings: z.array(savingsRow).default([]),
    hasPensions: yesNo,
    pensions: z.array(pensionRow).default([]),
    hasBusinesses: yesNo,
    businesses: z.array(businessRow).default([]),
    hasIP: yesNo,
    ipAssets: z.array(ipRow).default([]),
    hasChattels: yesNo,
    chattels: z.array(chattelRow).default([]),
    hasOtherAssets: yesNo,
    otherAssets: z.array(otherAssetRow).default([]),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(value.hasRealEstate, value.realEstate, "realEstate", "Add at least one property", ctx);
    checkListAnswered(value.hasSavings, value.savings, "savings", "Add at least one account", ctx);
    checkListAnswered(value.hasPensions, value.pensions, "pensions", "Add at least one pension", ctx);
    checkListAnswered(value.hasBusinesses, value.businesses, "businesses", "Add at least one business", ctx);
    checkListAnswered(value.hasIP, value.ipAssets, "ipAssets", "Add at least one asset", ctx);
    checkListAnswered(value.hasChattels, value.chattels, "chattels", "Add at least one item", ctx);
    checkListAnswered(value.hasOtherAssets, value.otherAssets, "otherAssets", "Add at least one asset", ctx);
  });

/* ---------------------------------------------------------------------- */
/* 5. Income and revenue                                                   */
/* ---------------------------------------------------------------------- */

const incomeRow = rowShape({
  description: requiredText("A description", 300),
  amount: requiredAmount("The amount"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

export const incomeSchema = z
  .object({
    grossAnnualIncome: requiredAmount("Your gross annual income"),
    salaryTreatment: z
      .object(treatmentShape)
      .loose()
      .superRefine((value, ctx) => checkTreatment(value, ctx)),
    hasPrimaryBonus: yesNo,
    primaryIncomeRows: z.array(incomeRow).default([]),
    hasAlternativeIncome: yesNo,
    altIncomeRows: z.array(incomeRow).default([]),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(
      value.hasPrimaryBonus,
      value.primaryIncomeRows,
      "primaryIncomeRows",
      "Add at least one bonus or commission entry",
      ctx,
    );
    checkListAnswered(
      value.hasAlternativeIncome,
      value.altIncomeRows,
      "altIncomeRows",
      "Add at least one other income entry",
      ctx,
    );
  });

/* ---------------------------------------------------------------------- */
/* 6. Liabilities and debts                                                */
/* ---------------------------------------------------------------------- */

const debtRow = rowShape({
  lenderName: requiredText("The lender's name", 160),
  debtType: requiredChoice("the type of debt"),
  outstandingBalance: requiredAmount("The outstanding balance"),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

const maintenanceRow = rowShape({
  dependentLink: requiredChoice("who the payments are for"),
  monthlyPayment: requiredAmount("The monthly payment"),
  // Free text, not a date: the field asks for "June 2032" or "age 18".
  projectedEndDate: optionalText(120),
  ...treatmentShape,
}).superRefine((row, ctx) => checkTreatment(row, ctx));

export const liabilitiesSchema = z
  .object({
    hasDebts: yesNo,
    debts: z.array(debtRow).default([]),
    hasMaintenance: yesNo,
    maintenance: z.array(maintenanceRow).default([]),
  })
  .superRefine((value, ctx) => {
    checkListAnswered(value.hasDebts, value.debts, "debts", "Add at least one debt", ctx);
    checkListAnswered(
      value.hasMaintenance,
      value.maintenance,
      "maintenance",
      "Add at least one maintenance commitment",
      ctx,
    );
  });
