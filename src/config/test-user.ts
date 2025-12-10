export const MOCK_USER_ID = "2"; 
export function getTestUserId(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("userId");
  if (stored) return stored; 
  return MOCK_USER_ID;    
}