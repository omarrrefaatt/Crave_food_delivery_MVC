import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthContextProvider } from "./Common/Contexts/Auth/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
