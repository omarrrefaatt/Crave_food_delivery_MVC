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
    console.log("AuthContextProvider mounted");
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser);
    const storedToken = localStorage.getItem("token");
    console.log("Stored token:", storedToken);
    if (storedUser && storedToken) {
      if (storedToken && storedUser) {
        dispatch({
          type: "LOGIN",
          payload: {
            role: JSON.parse(storedUser),
            token: JSON.parse(storedToken),
          },
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
