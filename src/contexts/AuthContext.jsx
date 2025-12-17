import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, logsAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null); // Store in memory only
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const tokenTimestamp = localStorage.getItem("jwt_token_timestamp");

    if (token && tokenTimestamp) {
      const now = Date.now();
      const tokenAge = now - parseInt(tokenTimestamp);
      const oneSecond = 1000; // 1 second in milliseconds

      // Check if token is older than 1 second since last page close
      if (tokenAge > oneSecond) {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("jwt_token_timestamp");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        // You might want to fetch user details here
      }
    }
    setIsLoading(false);
  }, []);

  // Update timestamp when page becomes visible (page is opened/active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        // Reset timestamp when page becomes visible again
        localStorage.setItem("jwt_token_timestamp", Date.now().toString());
      }
    };

    // Update timestamp before page closes/hides
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        localStorage.setItem("jwt_token_timestamp", Date.now().toString());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);

      // Check all possible token field names
      const token = data?.data?.token;

      // Validate token exists
      if (!token) {
        return {
          success: false,
          error:
            "No authentication token received from server. Please check backend response format.",
        };
      }

      // Basic JWT format check (should have 3 parts separated by dots)
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return {
          success: false,
          error: "Invalid token format received from server",
        };
      }

      // Save JWT token to localStorage with timestamp
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("jwt_token_timestamp", Date.now().toString());

      // Store master password in React state only (not localStorage!)
      setMasterPassword(password);

      // Update auth state
      setUser(data.user || data.data?.user || { email });
      setIsAuthenticated(true);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (email, password) => {
    try {
      const data = await authAPI.register(email, password);

      // Check all possible token field names
      const token =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.jwt ||
        data.authToken;

      // Optionally auto-login after registration
      if (token) {
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("jwt_token_timestamp", Date.now().toString());
        setMasterPassword(password);
        setUser(data.user || data.data?.user || { email });
        setIsAuthenticated(true);
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setMasterPassword(null); // Clear from memory
    setIsAuthenticated(false);
    localStorage.removeItem("jwt_token"); // Ensure token is removed
    localStorage.removeItem("jwt_token_timestamp"); // Remove timestamp as well
  };

  const lockVault = async () => {
    // Lock vault by clearing master password from memory
    // Keep user logged in (JWT token remains)
    setMasterPassword(null);

    // Log the action to the backend
    try {
      await logsAPI.create("Locked Vault");
    } catch {
      // Don't throw error, locking should still work even if logging fails
    }
  };

  const unlockVault = async (password) => {
    // Unlock vault by setting master password in memory
    setMasterPassword(password);

    // Log the action to the backend
    try {
      await logsAPI.create("Unlocked Vault");
    } catch {
      // Don't throw error, unlocking should still work even if logging fails
    }
  };

  const value = {
    user,
    masterPassword,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    lockVault,
    unlockVault,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
