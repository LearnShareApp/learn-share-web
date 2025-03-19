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
  const isAuthPage = pathname === "/auth";

  return (
    <>
      {!isAuthPage && (
        <div id="header-container">
          <Header />
        </div>
      )}
      <main className={!isAuthPage ? "container" : ""}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
