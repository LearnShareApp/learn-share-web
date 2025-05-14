import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import LanguageProvider from "@/providers/LanguageProvider";
import ProfileProvider from "@/providers/ProfileProvider";
import AuthRedirector from "@/components/AuthRedirector";
import ClientLayout from "@/layouts/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn&Share - Платформа для обучения",
  description: "Онлайн-платформа для поиска учителей и обмена знаниями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <ProfileProvider>
            <AuthRedirector />
            <ClientLayout>{children}</ClientLayout>
          </ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
