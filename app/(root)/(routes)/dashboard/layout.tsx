import OnboardingGate from "@/components/onboarding/OnboardingGate";
import Sidebar from "@/components/Layout/Sidebar";
import TopBar from "@/components/Layout/TopBar";
import EditingPartnerBanner from "@/components/Layout/EditingPartnerBanner";
import EditLockRedirect from "@/components/Layout/EditLockRedirect";

export default function MainLayouyt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      {/* <OnboardingGate /> */}
      <TopBar />
      <EditLockRedirect />
      <EditingPartnerBanner />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
