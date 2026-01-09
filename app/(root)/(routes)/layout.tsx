import AuthBootstrap from "@/components/AuthBootstrap";
import Sidebar from "@/components/ui/layout/Sidebar";
import ModalProvider from "@/providers/ModalProvider";

export default function MainLayouyt({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModalProvider />
      <AuthBootstrap>
        <Sidebar>
          <div className="h-full">{children}</div>
        </Sidebar>
      </AuthBootstrap>
    </>
  );
}
