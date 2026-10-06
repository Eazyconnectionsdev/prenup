export interface LawyerFilterState {
  status: string;
  priority: string;
  search: string;
}

export interface LawyerRowCase {
  id: string;
  p1Name: string;
  p2Name: string;
  service: string;
  status: string;
  priority: string;
  daysInStatus: number;
  lastActivity: string;
  certificateExpiryDate: string | null;
}
