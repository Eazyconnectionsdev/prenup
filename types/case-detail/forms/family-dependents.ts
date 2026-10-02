export interface Child {
  id: string;
  fullName: string;
  dob: string;
  parentalRelationship: string;
}

export interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}
