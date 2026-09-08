import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Settings | Lawyer Portal | LetsPrenup',
  description: 'Portal Configuration Settings',
};

export default function SettingsPage() {
  return <LawyerPortalDashboard initialView="settings" />;
}
