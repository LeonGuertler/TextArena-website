"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email?: string;
  humanName?: string;
}

interface AuthContextValue {
  token: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  register: (
    email: string, 
    password: string, 
    humanName: string, 
    agreeToTerms: boolean, 
    agreeToMarketing: boolean
  ) => Promise<{ success: boolean; error?: any }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextValue>({ 
  token: null, 
  isInitialized: false,
  isAuthenticated: false,
  currentUser: null,
  register: async () => ({ success: false, error: 'Not implemented' }),
  login: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => ({ success: false, error: 'Not implemented' }),
});

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

// Helper to delete cookie
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Flag to indicate if we've encountered CORS issues with X-User-Token
  const [useTokenHeader, setUseTokenHeader] = useState(true);
  // NEW: State for tracking the last anonymous token
  const [lastAnonymousToken, setLastAnonymousToken] = useState<string | null>(null);

  // Helper function to generate a new token if needed
  const generateNewToken = () => {
    return crypto.randomUUID();
  };

  // Common error handler for fetch operations
  const handleFetchError = (error: any, operation: string) => {
    console.error(`${operation} error:`, error);
    
    // If we got a CORS error related to X-User-Token header
    if (error instanceof TypeError && 
        error.message.includes('Failed to fetch') && 
        useTokenHeader) {
      // Disable the use of X-User-Token header for future requests
      setUseTokenHeader(false);
      
      return { 
        success: false, 
        error: new Error(`Network error: Please try again. We've adjusted how we communicate with the server.`) 
      };
    }
    
    // Special handling for other CORS errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return { 
        success: false, 
        error: new Error(`CORS error: Please try using the production site or configure your local development environment for CORS.`) 
      };
    }
    
    return { success: false, error };
  };

  // Helper to create API request headers
  const createHeaders = (includeToken = true) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    // Only include token in header if we haven't had CORS issues with it
    if (includeToken && useTokenHeader && token) {
      headers["X-User-Token"] = token;
    }
    
    return headers;
  };

  const register = async (
    email: string, 
    password: string, 
    humanName: string, 
    agreeToTerms: boolean, 
    agreeToMarketing: boolean
  ) => {
    try {
      // Use the current token or generate a new one
      const currentToken = token || generateNewToken();
      
      // First attempt with token in header if we haven't had issues
      let response = await fetch("https://matchmaking.textarena.ai/register", {
        method: "POST",
        credentials: "include",
        headers: createHeaders(true),
        body: JSON.stringify({
          email,
          password,
          human_name: humanName,
          cookie_id: currentToken,
          agree_to_terms: agreeToTerms,
          agree_to_marketing: agreeToMarketing
        })
      }).catch(async (error) => {
        // If first attempt fails with CORS and we were using token header,
        // try again without the token header
        if (error instanceof TypeError && 
            error.message.includes('Failed to fetch') && 
            useTokenHeader) {
          
          setUseTokenHeader(false);
          console.log("Retrying without X-User-Token header due to CORS issues");
          
          return await fetch("https://matchmaking.textarena.ai/register", {
            method: "POST",
            credentials: "include",
            headers: createHeaders(false),
            body: JSON.stringify({
              email,
              password,
              human_name: humanName,
              cookie_id: currentToken,
              agree_to_terms: agreeToTerms,
              agree_to_marketing: agreeToMarketing
            })
          });
        }
        
        // If it's not a CORS error or we already weren't using the header, rethrow
        throw error;
      });
      
      // Check if the response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Registration failed";
        
        try {
          // Try to parse error as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || "Registration failed";
          
          // Check for specific error messages
          if (errorMessage.includes("Email already registered")) {
            errorMessage = "This email is already registered. Please use a different email or try logging in.";
          } else if (errorMessage.includes("Username already taken")) {
            errorMessage = "This username is already taken. Please choose a different username.";
          }
        } catch {
          // If parsing fails, use the raw text or fallback
          errorMessage = errorText || "Registration failed";
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse the successful response
      const data = await response.json();
      
      // Update state with token
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("user_id", data.token);
        setIsAuthenticated(true);
        
        // UPDATED: Clear the anonymous token as this token is now mapped to an account
        setLastAnonymousToken(null);
        localStorage.removeItem("last_anonymous_token");
      }
      
      // Set user data if available
      if (data.user) {
        setCurrentUser({
          email: data.user.email || email,
          humanName: data.user.human_name || humanName
        });
        
        // Store user info in localStorage
        try {
          localStorage.setItem("user_info", JSON.stringify({
            email: data.user.email || email,
            humanName: data.user.human_name || humanName
          }));
        } catch (err) {
          console.error("Could not save user info to localStorage:", err);
        }
      } else {
        // If no user data returned, use what we know
        setCurrentUser({ email, humanName });
        
        try {
          localStorage.setItem("user_info", JSON.stringify({ email, humanName }));
        } catch (err) {
          console.error("Could not save user info to localStorage:", err);
        }
      }
      
      return { success: true };
    } catch (error) {
      return handleFetchError(error, "Registration");
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      // First attempt with token in header if we haven't had issues
      let response = await fetch("https://matchmaking.textarena.ai/login", {
        method: "POST",
        credentials: "include",
        headers: createHeaders(true),
        body: JSON.stringify({ email, password })
      }).catch(async (error) => {
        // If first attempt fails with CORS and we were using token header,
        // try again without the token header
        if (error instanceof TypeError && 
            error.message.includes('Failed to fetch') && 
            useTokenHeader) {
          
          setUseTokenHeader(false);
          console.log("Retrying without X-User-Token header due to CORS issues");
          
          return await fetch("https://matchmaking.textarena.ai/login", {
            method: "POST",
            credentials: "include",
            headers: createHeaders(false),
            body: JSON.stringify({ email, password })
          });
        }
        
        // If it's not a CORS error or we already weren't using the header, rethrow
        throw error;
      });
      
      // Check if the response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Login failed";
        
        try {
          // Try to parse error as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || "Login failed";
        } catch {
          // If parsing fails, use the raw text or fallback
          errorMessage = errorText || "Login failed";
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse the successful response
      const data = await response.json();
      
      // Update state with token
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("user_id", data.token);
        setIsAuthenticated(true);
        
        // UPDATED: Save the current token as the last used authenticated token
        // Optionally, this can be used to track the last authenticated token if needed
        // localStorage.setItem("last_authenticated_token", data.token);
      }
      
      // Set user data if available
      if (data.user) {
        setCurrentUser({ 
          email: data.user.email || email, 
          humanName: data.user.human_name || data.user.name
        });
        
        // Store user info in localStorage
        try {
          localStorage.setItem("user_info", JSON.stringify({ 
            email: data.user.email || email, 
            humanName: data.user.human_name || data.user.name 
          }));
        } catch (err) {
          console.error("Could not save user info to localStorage:", err);
        }
      } else {
        // If no user data returned, use what we know
        setCurrentUser({ email });
        
        try {
          localStorage.setItem("user_info", JSON.stringify({ email }));
        } catch (err) {
          console.error("Could not save user info to localStorage:", err);
        }
      }
      
      return { success: true };
    } catch (error) {
      return handleFetchError(error, "Login");
    }
  };
  
  // UPDATED: Modified logout function to properly clean up auth state
  const logout = async () => {
    try {
      console.log("Executing logout process...");
      
      // First call the logout endpoint to invalidate the session on the server
      try {
        const logoutResponse = await fetch("https://matchmaking.textarena.ai/logout", {
          method: "POST",
          credentials: "include",
          headers: createHeaders(true)
        });
        
        console.log("Logout response:", logoutResponse.status);
      } catch (logoutError) {
        console.error("Error calling logout endpoint:", logoutError);
        // Continue with client-side logout even if server request fails
      }
      
      // Clear authentication state
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      // Clear stored user info
      localStorage.removeItem("user_info");
      
      // UPDATED: Check if we have a previous anonymous token to restore
      if (lastAnonymousToken) {
        console.log("Restoring previous anonymous token:", lastAnonymousToken);
        
        // Explicitly delete the authentication cookie first
        deleteCookie("user_id");
        
        // Then wait a moment before setting the new anonymous token cookie
        // This helps ensure we don't have race conditions with cookie setting
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now restore the previous anonymous token
        setToken(lastAnonymousToken);
        localStorage.setItem("user_id", lastAnonymousToken);
        setCookie("user_id", lastAnonymousToken, 365);
        
        // Explicitly reinitialize with the anonymous token
        // This helps ensure the server recognizes the new token
        try {
          const initResponse = await fetch("https://matchmaking.textarena.ai/init", {
            method: "GET",
            credentials: "include",
            headers: {
              "X-User-Token": lastAnonymousToken
            }
          });
          
          if (initResponse.ok) {
            console.log("Successfully reinitialized with anonymous token");
          }
        } catch (initError) {
          console.error("Error reinitializing with anonymous token:", initError);
        }
        
        return { success: true };
      } else {
        // If we don't have a previous anonymous token, request a new one
        console.log("No previous anonymous token found, requesting a new one");
        
        // First explicitly delete the authentication cookie 
        deleteCookie("user_id");
        
        // Then wait a moment before making the init request
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now request a new anonymous token
        const initResponse = await fetch("https://matchmaking.textarena.ai/init", {
          credentials: "include",
        });
        
        const initData = await initResponse.json();
        const newAnonymousToken = initData.token;
        
        // Store the new anonymous token
        setToken(newAnonymousToken);
        setLastAnonymousToken(newAnonymousToken);
        localStorage.setItem("user_id", newAnonymousToken);
        localStorage.setItem("last_anonymous_token", newAnonymousToken);
        setCookie("user_id", newAnonymousToken, 365);
        
        return { success: true };
      }
    } catch (error) {
      return handleFetchError(error, "Logout");
    }
  };
  
  useEffect(() => {
    // Check multiple storage locations in order of preference
    const localStorageToken = localStorage.getItem("user_id");
    const cookieToken = getCookie("user_id");
    
    // Try to restore user info from localStorage
    let userInfo: User | null = null;
    try {
      const savedUserInfo = localStorage.getItem("user_info");
      if (savedUserInfo) {
        userInfo = JSON.parse(savedUserInfo);
        setCurrentUser(userInfo);
      }
    } catch (err) {
      console.error("Could not restore user info from localStorage:", err);
    }
    
    // Use token from localStorage or cookie, preferring localStorage
    const storedToken = localStorageToken || cookieToken;
    
    // If we have a token from any source, use it immediately
    if (storedToken) {
      setToken(storedToken);
      console.log("Using existing token:", storedToken, 
        localStorageToken ? "(from localStorage)" : "(from cookie)");
    }
    
    // UPDATED: Try to restore the last anonymous token
    const savedAnonymousToken = localStorage.getItem("last_anonymous_token");
    if (savedAnonymousToken) {
      setLastAnonymousToken(savedAnonymousToken);
      console.log("Restored last anonymous token:", savedAnonymousToken);
    }
    
    // UPDATED: If we have a token but no user info, it's an anonymous token
    // We should save it as the last anonymous token
    if (storedToken && !userInfo) {
      setLastAnonymousToken(storedToken);
      localStorage.setItem("last_anonymous_token", storedToken);
      console.log("Current token is anonymous, saving as lastAnonymousToken:", storedToken);
    }
    
    // Make the API call to verify/get a token with CORS-safe headers
    fetch("https://matchmaking.textarena.ai/init", { 
      credentials: "include",
      // Only include token in header if we're using token headers
      headers: (useTokenHeader && storedToken) ? { "X-User-Token": storedToken } : undefined
    })
      .then((res) => res.json())
      .then((data: { token: string, isAuthenticated?: boolean, user?: any }) => {
        console.log("Init response:", data);
        
        // If we got a token and it's different from what we had
        if (data.token && (!storedToken || data.token !== storedToken)) {
          console.log("Received new token from server:", data.token);
          // Save the token in both state, localStorage, and as a cookie
          setToken(data.token);
          localStorage.setItem("user_id", data.token);
          setCookie("user_id", data.token, 365); // Store for 1 year
          
          // UPDATED: If this is a new anonymous token (no authentication), save it
          if (!data.isAuthenticated) {
            setLastAnonymousToken(data.token);
            localStorage.setItem("last_anonymous_token", data.token);
            console.log("New anonymous token saved:", data.token);
          }
        } else if (storedToken) {
          // If the token from the server matches what we have, ensure it's in all storage locations
          localStorage.setItem("user_id", storedToken);
          setCookie("user_id", storedToken, 365);
        }
        
        // Set authentication status if available from server
        if (data.isAuthenticated !== undefined) {
          console.log("Setting authentication state:", data.isAuthenticated);
          setIsAuthenticated(data.isAuthenticated);
          
          // If authenticated and we have user data from server, update current user
          if (data.isAuthenticated && data.user) {
            const userFromServer = {
              email: data.user.email,
              humanName: data.user.human_name || data.user.name
            };
            setCurrentUser(userFromServer);
            
            // Update stored user info
            try {
              localStorage.setItem("user_info", JSON.stringify(userFromServer));
            } catch (err) {
              console.error("Could not save user info to localStorage:", err);
            }
          } else if (!data.isAuthenticated) {
            // If not authenticated, ensure user data is cleared
            setCurrentUser(null);
            localStorage.removeItem("user_info");
          }
        }
        
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Error during initialization:", err);
        
        // If error is CORS-related to X-User-Token, disable it for future requests
        if (err instanceof TypeError && 
            err.message.includes('Failed to fetch') && 
            useTokenHeader) {
          setUseTokenHeader(false);
          console.log("Disabling X-User-Token header due to CORS issues");
          
          // Retry the init request without the token header
          fetch("https://matchmaking.textarena.ai/init", { 
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              if (data.token) {
                setToken(data.token);
                localStorage.setItem("user_id", data.token);
                setCookie("user_id", data.token, 365);
                
                // UPDATED: If this is a new anonymous token (no authentication), save it
                if (!data.isAuthenticated) {
                  setLastAnonymousToken(data.token);
                  localStorage.setItem("last_anonymous_token", data.token);
                  console.log("New anonymous token saved after retry:", data.token);
                }
              }
              setIsInitialized(true);
            })
            .catch(retryErr => {
              console.error("Error during retry initialization:", retryErr);
              // If we already had a token, still consider ourselves initialized
              if (storedToken) {
                console.log("Using existing token despite fetch error");
              }
              setIsInitialized(true);
            });
          
          return; // Early return to avoid setting isInitialized twice
        }
        
        // If we already had a token, still consider ourselves initialized
        if (storedToken) {
          console.log("Using existing token despite fetch error");
        }
        setIsInitialized(true);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      isInitialized,
      isAuthenticated,
      currentUser,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);