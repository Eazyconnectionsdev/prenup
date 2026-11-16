export interface FormState {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  marketingConsent?: boolean;
  acceptedTerms: boolean;
}

export interface InviteData {
  token: string;
  caseId: string;
}
