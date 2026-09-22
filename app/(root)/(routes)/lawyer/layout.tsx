import React from "react";

export const metadata = {
  title: "Lawyer Portal",
};

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {children}
    </div>
  );
}