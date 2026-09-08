import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Appendices Vault | Lawyer Portal | LetsPrenup',
  description: 'Disclosure Appendices Vault',
};

export default function AppendicesPage() {
  return <LawyerPortalDashboard initialView="appendices" />;
}
