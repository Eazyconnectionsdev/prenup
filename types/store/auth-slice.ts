export interface authState {
  isLoading: boolean;
  isAuthenticated : boolean;
  caseId: string | any;
  user: { [key: string]: any };
  message: string | null;
  submitError: string | null;
}
