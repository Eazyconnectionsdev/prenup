export type ProfileForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  phone: string;
  marketingConsent: boolean;
};

export type FormErrors = Partial<Record<keyof ProfileForm, string>>;

/** The partner's details, as returned by GET /users/partner. */
export type PartnerProfile = {
  _id: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  suffix?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  emailVerified?: boolean;
  role?: string | null;
  endUserType?: string | null;
};

/** Same shape as ProfileForm minus the partner's own marketing consent. */
export type PartnerForm = Omit<ProfileForm, "marketingConsent">;

export type PartnerFormErrors = Partial<Record<keyof PartnerForm, string>>;
