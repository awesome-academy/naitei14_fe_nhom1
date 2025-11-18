"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import * as React from "react";

interface SessionProviderProps {
  children: ReactNode;
}

// C075: Added explicit return type React.JSX.Element
export function SessionProvider({
  children,
}: SessionProviderProps): React.JSX.Element {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
