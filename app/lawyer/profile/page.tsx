import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Lawyer Profile | Lawyer Portal | LetsPrenup',
  description: 'Lawyer Profile Information',
};

export default function ProfilePage() {
  return <LawyerPortalDashboard initialView="profile" />;
}
