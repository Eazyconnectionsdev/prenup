export interface DashboardResponse {
  totalCases: number;
  partnerFilling: {
    total: number;
    partnerNotInvited: number;
    partnerFilling: number;
  };
  cmReview: {
    total: number;
    returnedToDraft: number;
    awaitingCmReview: number;
  };
  legalReview: {
    total: number;
    preLawyer: {
      p1QuestionnairePending: number;
      p2QuestionnairePending: number;
    };
    clientConfirmation: {
      p1ConfirmationPending: number;
      p2ConfirmationPending: number;
    };
    lawyerSignOff: {
      p1LawyerApprovalPending: number;
      p2LawyerApprovalPending: number;
    };
  };
  completed: {
    total: number;
    executionPackGenerated: number;
  };
  readyForArchive: {
    total: number;
  };
}

export interface StatBox {
  label: string;
  value: number;
  filter: string;
}
