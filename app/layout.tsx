import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Instrument_Serif } from "next/font/google";
import { cn } from "@/lib/utils";

import "./globals.css";

import { StoreProvider } from "@/providers/StoreProvider";
import ToastContext from "@/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        instrumentSerif.variable,
        "font-sans"
      )}
    >
      <body  cz-shortcut-listen="true" className="min-h-full flex flex-col">
        <StoreProvider>
          <ToastContext />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}