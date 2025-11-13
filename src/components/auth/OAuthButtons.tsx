"use client";

import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export function OAuthButtons() {
  return (
    <div className="mx-0 sm:mx-10 lg:mx-20 space-y-4">
      {/* Divider */}
      <div className="flex items-center justify-center">
        <div className="border-t border-gray-300 grow"></div>
        <span className="px-3 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
          Hoặc đăng nhập với
        </span>
        <div className="border-t border-gray-300 grow"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-none border-gray-300 hover:bg-gray-100 cursor-pointer h-11 text-xs sm:text-sm"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-none border-gray-300 hover:bg-gray-100 cursor-pointer h-11 text-xs sm:text-sm"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
