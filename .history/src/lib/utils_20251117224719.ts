import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { UserWithoutPassword } from "@/src/types/user.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
