import { useReducer, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface AuthState {
  user: { role: string; token: string } | null;
}

export interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: { role: string; token: string } | null;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload ?? null };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser) as { role: string; token: string };
      if (user && user.role && user.token) {
        dispatch({ type: "LOGIN", payload: user });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
