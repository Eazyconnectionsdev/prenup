import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/providers/StoreProvider";
import ToastContext from "@/providers/ToastProvider";

const poppin = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppin",
});

export const metadata: Metadata = {
  title: "Lets Prenup Portal",
  description: "A Prenup Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${poppin.className} antialiased`}
      >
        <StoreProvider>
          <ToastContext />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
