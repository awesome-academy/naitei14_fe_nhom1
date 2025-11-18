"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  const shouldHideHeaderFooter =
    pathname?.startsWith("/admin") || hideHeaderFooter;

  // Lấy cart khi đã có userId
  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId, fetchCart]);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Toaster position="top-right" richColors />
      <div className={shouldHideHeaderFooter ? "" : "px-72"}>{children}</div>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <LayoutContent>{children}</LayoutContent>;
}
