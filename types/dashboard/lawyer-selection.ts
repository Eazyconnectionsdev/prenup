/** A solicitor as returned by GET /cases/:id/lawyers. */
export interface LawyerOption {
  _id: string;
  externalId?: string;
  name: string;
  priceText?: string | null;
  avatarUrl?: string | null;
  status?: "available" | "unavailable" | "archived" | null;
  company?: { _id?: string; name?: string } | string | null;
  publicEmail?: string | null;
  publicPhone?: string | null;
  website?: string | null;
  profileLink?: string | null;
  address?: string | null;
  barNumber?: string | null;
  verified?: boolean;
}

/** One party's slot on the case: preQuestionnaireUser1 or ...User2. */
export interface PreQuestionnaireSlot {
  answers?: unknown[];
  responses?: Record<string, unknown>;
  // Populated by GET /cases/:id, so this is the lawyer object, not an id
  selectedLawyer?: LawyerOption | string | null;
  selectedAt?: string | null;
  submitted?: boolean;
  submittedAt?: string | null;
  locked?: boolean;
}
