import Sidebar from "@/components/Layout/Sidebar";
import TopBar from "@/components/Layout/TopBar";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

export default function MainLayouyt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OnboardingGate />
      <Sidebar>
        <TopBar />
        <div className="h-full">{children}</div>
      </Sidebar>
    </>
  );
}
