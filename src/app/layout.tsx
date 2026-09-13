import type { Metadata } from "next";
import "./globals.css";
import { S3DataProvider } from "@/context/S3DataContext";

export const metadata: Metadata = {
  title: "SITE2SCHEDULE AI - Infrastructure Intelligence & Progress Verification",
  description: "AI-powered physical progress verification platform integrated with Amazon S3 for infrastructure engineering",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <S3DataProvider>
          {children}
        </S3DataProvider>
      </body>
    </html>
  );
}
