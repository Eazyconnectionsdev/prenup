export type YesNo = "yes" | "no" | "";

export type ChildEntry = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  specialNeeds: YesNo;
  fromCurrentRelationship: YesNo;
  livesWithYou: YesNo;
  maintenanceAndCustody: string;
};
