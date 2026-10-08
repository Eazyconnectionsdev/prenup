/** Field descriptor for dynamic forms */
export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: string[]; // for select
  placeholder?: string;
};

export type Entry = {
  id: string;
  values: Record<string, string | number>;
};
