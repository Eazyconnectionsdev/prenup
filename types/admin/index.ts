// ─── Admin Portal Types ───────────────────────────────────────────────────────

export type AdminNavView = "dashboard" | "cases" | "admin-settings" | "reports";

export interface TopBarToggleItem {
  id: string;
  label: string;
  enabled: boolean;
}

export interface LawyerCompanyRecord {
  id: string;
  name: string;
  number: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
  attachments: AttachmentItem[];
  createdAt: string;
}

export interface LawyerRecord {
  id: string;
  name: string;
  photo: string | null;
  companyId: string;
  publicEmail: string;
  publicPhone: string;
  directEmail: string;
  directPhone: string;
  website: string;
  profileLink: string;
  address: string;
  barNumber: string;
  notes: string;
  pricePerHour: string;
  vatType: "including" | "including_exempt" | "excluding";
  attachments: AttachmentItem[];
  createdAt: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}
