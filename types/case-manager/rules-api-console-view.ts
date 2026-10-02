import type { ApiLogEntry, RuleEntry } from "@/types/case-manager";

export interface RulesApiConsoleViewProps {
  rules: RuleEntry[];
  apiLogs: ApiLogEntry[];
  onTriggerApiEndpoint: (endpoint: string, method: string, mockPayload: any) => void;
}
