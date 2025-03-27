"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isEmptyPage =
    pathname.startsWith("/auth") || pathname.startsWith("/lessons/");

  return (
    <>
      {!isEmptyPage && (
        <div id="header-container">
          <Header />
        </div>
      )}
      <main className={!isEmptyPage ? "container" : ""}>{children}</main>
      {!isEmptyPage && <Footer />}
    </>
  );
}
