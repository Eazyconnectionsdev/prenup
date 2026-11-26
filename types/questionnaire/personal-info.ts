// Personal information page types
export interface personalInfoFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  currentProfession: string;

  // Planned wedding / civil partnership date and the 29–35 day acknowledgement
  marriageDate: string;
  ceremonyTimingAcknowledged: boolean;

  // Contact. The email comes from the account and is shown read-only.
  email: string;
  mobilePhone: string;

  // "Yes" | "No"; when "No", the language needed is required
  languageFluency: string;
  requiredLanguage: string;

  // "Yes" | "No" — living and domiciled in the UK. When "No", domicileStatus
  // holds the country of residence and domicile.
  ukDomiciled: string;
  domicileStatus: string;

  street1: string;
  street2: string;
  city: string;
  postcode: string;
  country: string;

  // Older answers stored address line 2 here; read as a fallback only.
  county?: string;
}
