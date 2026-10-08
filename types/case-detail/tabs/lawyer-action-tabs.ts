/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */
export type Persona = "L1" | "L2";

export type Confirmation = {
  uploaded?: boolean;
  fileName?: string | null;
  url?: string | null;
  uploadedAt?: string | null;
};

export type ConfirmationResponse = {
  finalP1Confirmed?: boolean;
  finalP2Confirmed?: boolean;

  finalP1ConfirmedAt?: string | null;
  finalP2ConfirmedAt?: string | null;

  p1?: Confirmation | null;
  p2?: Confirmation | null;

  p1Confirmation?: Confirmation | null;
  p2Confirmation?: Confirmation | null;
};

export type ILAStatus = {
  /*
   * Current backend response:
   *
   * {
   *   p1ILACompleted: true,
   *   p2ILACompleted: false,
   *   p1ILACompletedAt: "...",
   *   p2ILACompletedAt: null
   * }
   */

  p1ILACompleted?: boolean;
  p2ILACompleted?: boolean;

  p1ILACompletedAt?: string | null;
  p2ILACompletedAt?: string | null;

  /*
   * Legacy/fallback fields.
   */
  p1?: boolean;
  p2?: boolean;

  p1Completed?: boolean;
  p2Completed?: boolean;

  p1Signoff?: boolean;
  p2Signoff?: boolean;

  p1Ila?: boolean;
  p2Ila?: boolean;
};

export type Note = {
  _id?: string;
  id?: string;
  note?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NotesResponse = {
  notes?: Note[];
};

export type CaseResponse = {
  _id?: string;
  id?: string;
  caseId?: string;

  client1?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };

  client2?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };

  [key: string]: any;
};

export type ILAPersona = "P1" | "P2";

/* ========================================================================== */
/* CONFIRMATION UPLOAD FORM                                                   */
/* ========================================================================== */
export type ConfirmationUploadFormProps = {
  persona: Persona;
  uploading: boolean;
  onSubmit: (
    persona: Persona,
    file: File,
  ) => Promise<void>;
};

/* ========================================================================== */
/* CONFIRMATION CARD                                                          */
/* ========================================================================== */
export type ConfirmationCardProps = {
  persona: Persona;
  complete: boolean;
  confirmedAt?: string | null;
  uploading: boolean;
  onSubmit: (
    persona: Persona,
    file: File,
  ) => Promise<void>;
};

/* ========================================================================== */
/* ILA UPLOAD FORM                                                            */
/* ========================================================================== */
export type ILAUploadFormProps = {
  type: ILAPersona;
  uploading: boolean;
  onSubmit: (
    type: ILAPersona,
    file: File,
  ) => Promise<void>;
};

/* ========================================================================== */
/* ILA CARD                                                                   */
/* ========================================================================== */
export type ILACardProps = {
  type: ILAPersona;
  complete: boolean;
  completedAt?: string | null;
  uploading: boolean;
  onSubmit: (
    type: ILAPersona,
    file: File,
  ) => Promise<void>;
};
