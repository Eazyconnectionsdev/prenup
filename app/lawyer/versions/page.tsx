import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Agreement Versions | Lawyer Portal | LetsPrenup',
  description: 'Agreement Versions Index',
};

export default function VersionsPage() {
  return <LawyerPortalDashboard initialView="versions" />;
}
