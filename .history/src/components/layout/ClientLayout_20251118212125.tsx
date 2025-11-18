"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// C075: Added explicit return type JSX.Element
// C006: Renamed to RenderLayoutContent
function RenderLayoutContent({ children }: ClientLayoutProps): JSX.Element {
  const pathname = usePathname();

  // Ẩn header/footer khi vào /admin
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

// C075: Added explicit return type JSX.Element
// C006: Renamed to RenderClientLayout
export default function RenderClientLayout({
  children,
}: ClientLayoutProps): JSX.Element {
  return <RenderLayoutContent>{children}</RenderLayoutContent>;
}
