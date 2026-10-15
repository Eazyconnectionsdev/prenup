import type { ReactNode } from "react";
import SessionWatch from "@/components/auth/SessionWatch";

export default function SignedInLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SessionWatch />
      {children}
    </>
  );
}
