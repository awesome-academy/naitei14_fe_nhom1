"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { JSX } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function RenderLayoutContent({ children }: ClientLayoutProps): JSX.Element {
  const pathname = usePathname();
  const shouldHideHeaderFooter = pathname?.startsWith("/admin");

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Toaster position="top-right" richColors />
      <div className={shouldHideHeaderFooter ? "" : "px-72"}>{children}</div>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default function RenderClientLayout({
  children,
}: ClientLayoutProps): JSX.Element {
  return <RenderLayoutContent>{children}</RenderLayoutContent>;
}
