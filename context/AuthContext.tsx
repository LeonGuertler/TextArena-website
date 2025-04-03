// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({ token: null, isInitialized: false });

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check multiple storage locations in order of preference
    const localStorageToken = localStorage.getItem("user_id");
    const cookieToken = getCookie("user_id");
    
    // Use token from localStorage or cookie, preferring localStorage
    const storedToken = localStorageToken || cookieToken;
    
    // If we have a token from any source, use it immediately
    if (storedToken) {
      setToken(storedToken);
      console.log("Using existing token:", storedToken, 
        localStorageToken ? "(from localStorage)" : "(from cookie)");
    }
    
    // Make the API call to verify/get a token
    fetch("https://matchmaking.textarena.ai/init", { 
      credentials: "include",
      headers: storedToken 
        ? { "X-User-Token": storedToken } // Send token as header too
        : undefined
    })
      .then((res) => res.json())
      .then((data: { token: string }) => {
        // If we got a token and it's different from what we had
        if (data.token && (!storedToken || data.token !== storedToken)) {
          console.log("Received new token from server:", data.token);
          // Save the token in both state, localStorage, and as a cookie
          setToken(data.token);
          localStorage.setItem("user_id", data.token);
          setCookie("user_id", data.token, 365); // Store for 1 year
        } else if (storedToken) {
          // If the token from the server matches what we have, ensure it's in all storage locations
          localStorage.setItem("user_id", storedToken);
          setCookie("user_id", storedToken, 365);
        }
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Error during initialization:", err);
        // If we already had a token, still consider ourselves initialized
        if (storedToken) {
          console.log("Using existing token despite fetch error");
        }
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