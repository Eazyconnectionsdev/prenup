// The service a couple picks is stored on the case as `agreementType`, using
// the same six ids the backend enum accepts (AGREEMENT_TYPES in case.schema.ts).
// The service selector asks for it as a service + a situation, so both
// directions of that mapping live here, together with the labels used wherever
// the chosen service is displayed.

export type AgreementType =
  | "prenup-marriage"
  | "prenup-civil"
  | "postnup-marriage"
  | "postnup-civil"
  | "cohabitation"
  | "help-choose";

export type ServiceId = "prenup" | "postnup" | "cohabitation";

export const AGREEMENT_TYPE_LABELS: Record<AgreementType, string> = {
  "prenup-marriage": "Prenuptial Agreement (Marriage)",
  "prenup-civil": "Prenuptial Agreement (Civil Partnership)",
  "postnup-marriage": "Postnuptial Agreement (Marriage)",
  "postnup-civil": "Postnuptial Agreement (Civil Partnership)",
  cohabitation: "Cohabitation Agreement",
  "help-choose": "Help Me Choose",
};

// Short enough for the dashboard status pill
export const AGREEMENT_TYPE_SHORT_LABELS: Record<AgreementType, string> = {
  "prenup-marriage": "Prenup (Marriage)",
  "prenup-civil": "Prenup (Civil Partnership)",
  "postnup-marriage": "Postnup (Marriage)",
  "postnup-civil": "Postnup (Civil Partnership)",
  cohabitation: "Cohabitation",
  "help-choose": "Help Me Choose",
};

export function isAgreementType(value: unknown): value is AgreementType {
  return (
    typeof value === "string" && value in AGREEMENT_TYPE_LABELS
  );
}

export function agreementTypeLabel(value?: string | null): string | null {
  return isAgreementType(value) ? AGREEMENT_TYPE_LABELS[value] : null;
}

export function agreementTypeShortLabel(value?: string | null): string | null {
  return isAgreementType(value) ? AGREEMENT_TYPE_SHORT_LABELS[value] : null;
}

// service + situation -> what the backend stores
const TO_AGREEMENT_TYPE: Record<string, AgreementType> = {
  "prenup:marriage": "prenup-marriage",
  "prenup:civil-partnership": "prenup-civil",
  "postnup:married": "postnup-marriage",
  "postnup:civil-partnership": "postnup-civil",
  // Both cohabitation situations are the same agreement in law, and the
  // backend enum has a single id for it.
  "cohabitation:living-together": "cohabitation",
  "cohabitation:moving-in": "cohabitation",
};

export function toAgreementType(
  service: ServiceId,
  situation: string,
): AgreementType | null {
  return TO_AGREEMENT_TYPE[`${service}:${situation}`] ?? null;
}

// What the backend stores -> the selector's own two choices. Cohabitation
// cannot say which of its situations was picked, so it falls back to the first.
export function fromAgreementType(
  value?: string | null,
): { service: ServiceId; situation: string } | null {
  switch (value) {
    case "prenup-marriage":
      return { service: "prenup", situation: "marriage" };
    case "prenup-civil":
      return { service: "prenup", situation: "civil-partnership" };
    case "postnup-marriage":
      return { service: "postnup", situation: "married" };
    case "postnup-civil":
      return { service: "postnup", situation: "civil-partnership" };
    case "cohabitation":
      return { service: "cohabitation", situation: "living-together" };
    default:
      // "help-choose" has no equivalent here: the selector asks outright.
      return null;
  }
}
