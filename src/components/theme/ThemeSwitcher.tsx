"use client";

import { useTheme } from "next-themes";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/src/components/ui/dropdown-menu";
import { Moon, Sun, Monitor } from "lucide-react";
import { NoSSR } from "./NoSSR";

function ThemeSwitcherCore() {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-accent/50"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Sử dụng Portal để menu hiển thị ở lớp trên cùng của trang web, không bị Navbar che */}
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={8} // Tạo khoảng cách nhỏ với nút bấm
          className="w-36 md:w-40 z-100 shadow-xl border bg-popover"
        >
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === "light" ? "bg-accent" : ""
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === "dark" ? "bg-accent" : ""
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === "system" ? "bg-accent" : ""
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function ThemeSwitcher() {
  return (
    <NoSSR
      fallback={
        <Button
          variant="outline"
          size="icon"
          disabled
          className="border-none bg-transparent"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Loading theme</span>
        </Button>
      }
    >
      <ThemeSwitcherCore />
    </NoSSR>
  );
}
