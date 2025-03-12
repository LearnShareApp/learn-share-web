import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "@/styles/globals.scss";
import LanguageProvider from "@/components/LanguageProvider";

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
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <Header />
          <main className="pt-[64px]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
