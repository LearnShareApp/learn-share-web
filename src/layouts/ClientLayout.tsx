"use client";

import { usePathname } from "next/navigation";
import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isEmptyPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/lessons/") ||
    pathname.startsWith("/admin");

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
