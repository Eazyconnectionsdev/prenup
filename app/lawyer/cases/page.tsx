import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Assigned Cases | Lawyer Portal | LetsPrenup',
  description: 'Assigned Matters Master List',
};

export default function CasesPage() {
  return <LawyerPortalDashboard initialView="assigned_cases" />;
}
