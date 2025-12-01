"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import * as React from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({
  children,
}: SessionProviderProps): React.JSX.Element {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
