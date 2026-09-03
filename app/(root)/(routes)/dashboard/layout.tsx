import Sidebar from "@/components/Layout/Sidebar";
import TopBar from "@/components/Layout/TopBar";

export default function MainLayouyt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar>
        <TopBar />

        <div className="h-full">{children}</div>
      </Sidebar>
    </>
  );
}
