"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { useLayoutStore } from "@/src/stores/layout.store";
import { useUserStore } from "@/src/stores/user.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useNextAuthSync } from "@/src/hooks/useNextAuthSync";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideHeaderFooter = useLayoutStore((state) => state.hideHeaderFooter);

  const userId = useUserStore((state) => state.user?.id);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useNextAuthSync();

  const shouldHideHeaderFooter =
    pathname?.startsWith("/admin") || hideHeaderFooter;

  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId, fetchCart]);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Toaster position="top-right" richColors />
      <div
        className={
          shouldHideHeaderFooter
            ? ""
            : "px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-72"
        }
      >
        {children}
      </div>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <LayoutContent>{children}</LayoutContent>;
}
