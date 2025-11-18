"use client";

import TopNavbar from "./TopNavbar";
import MainNavbar from "./MainNavbar";
import { JSX } from "react";

const RenderHeader = (): JSX.Element => {
  return (
    <header className="bg-background border-b">
      <TopNavbar />
      <MainNavbar />
    </header>
  );
};

export default RenderHeader;
