// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({ token: null, isInitialized: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Call the /init endpoint once when the provider mounts.
    //fetch("https://localhost:8000/init", { credentials: "include" })
    fetch("https://api.textarena.ai/init", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { token: string }) => {
        setToken(data.token);
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Error during initialization:", err);
        setIsInitialized(true);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ token, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
