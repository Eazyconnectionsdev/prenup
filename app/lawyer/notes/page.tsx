import { LawyerPortalDashboard } from '@/components/lawyer/LawyerPortalDashboard';

export const metadata = {
  title: 'Summary Notes | Lawyer Portal | LetsPrenup',
  description: 'Confidential Summary Notes',
};

export default function NotesPage() {
  return <LawyerPortalDashboard initialView="notes" />;
}
