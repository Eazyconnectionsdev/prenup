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
