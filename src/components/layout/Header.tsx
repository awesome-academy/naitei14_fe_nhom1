"use client";

import TopNavbar from "./TopNavbar";
import MainNavbar from "./MainNavbar";

const Header = () => {
  return (
    <header className="sticky bg-background border-b">
      <TopNavbar />
      <MainNavbar />
    </header>
  );
};

export default Header;
