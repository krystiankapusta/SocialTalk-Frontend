import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  exp: number;
}

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.userId;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}
