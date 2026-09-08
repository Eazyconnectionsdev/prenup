import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'ILA Register | Lawyer Portal | LetsPrenup',
  description: 'Independent Legal Advice (ILA) Register',
};

export default function IlaPage() {
  return <LawyerPortalDashboard initialView="ila" />;
}
