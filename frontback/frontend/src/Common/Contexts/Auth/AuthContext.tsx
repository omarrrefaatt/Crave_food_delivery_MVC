import { createContext } from "react";
import { AuthAction } from "./AuthProvider";

interface AuthContextType {
  user: { role: string; token: string } | null;

  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,

  dispatch: () => null,
});
