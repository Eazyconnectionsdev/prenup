import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Lawyer Dashboard | LetsPrenup',
  description: 'Lawyer Portal Dashboard',
};

export default function LawyerDashboardPage() {
  return <LawyerPortalDashboard initialView="dashboard" />;
}
