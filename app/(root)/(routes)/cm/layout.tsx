import React from "react";

export const metadata = {
  title: "Case Manager",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#f7f4ee]">{children}</div>;
}
