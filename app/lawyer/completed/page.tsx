import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Completed Cases | Lawyer Portal | LetsPrenup',
  description: 'Completed Cases Registry',
};

export default function CompletedCasesPage() {
  return <LawyerPortalDashboard initialView="completed" />;
}
