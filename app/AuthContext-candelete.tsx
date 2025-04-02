// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the matchmaking server URL
const MATCHMAKING_HTTP_URI = "http://54.179.78.11:8000";

interface AuthContextValue {
  token: string | null;
  isInitialized: boolean;
  modelName: string; // Added for model identity
}

// Default context value
const AuthContext = createContext<AuthContextValue>({
  token: null,
  isInitialized: false,
  modelName: "Human Player"
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [modelName] = useState<string>("Human Player");
  
  useEffect(() => {
    // Generate a unique user ID if none exists in localStorage
    let userToken = localStorage.getItem("userToken");
    
    if (!userToken) {
      // Generate a random token for new users
      userToken = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userToken", userToken);
    }
    
    // Call the matchmaking server's register endpoint
    fetch(`${MATCHMAKING_HTTP_URI}/register_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userToken,
        name: "Human Player"
      })
    })
      .then((res) => res.json())
      .then((data: { token: string }) => {
        setToken(data.token || userToken); // Use returned token or fallback to generated token
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Error during initialization:", err);
        // Even if registration fails, we can use the local token
        setToken(userToken);
        setIsInitialized(true);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ token, isInitialized, modelName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);