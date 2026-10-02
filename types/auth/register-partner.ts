export interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export interface InviteData {
  token: string;
  caseId: string;
}
