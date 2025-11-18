"use client";

import TopNavbar from "./TopNavbar";
import MainNavbar from "./MainNavbar";

// C075: Added explicit return type JSX.Element
// C006: Renamed to RenderHeader
const RenderHeader = (): JSX.Element => {
  return (
    <header className="bg-background border-b">
      <TopNavbar />
      <MainNavbar />
    </header>
  );
};

export default RenderHeader;
