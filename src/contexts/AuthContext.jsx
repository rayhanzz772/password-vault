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
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      // Check if token is older than 1 hour
      if (tokenAge > oneHour) {
        console.log("🕐 Token expired (older than 1 hour), logging out...");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("jwt_token_timestamp");
        setIsAuthenticated(false);
      } else {
        console.log(
          `✅ Token valid, expires in ${Math.round(
            (oneHour - tokenAge) / 60000
          )} minutes`
        );
        setIsAuthenticated(true);
        // You might want to fetch user details here
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email);
      const data = await authAPI.login(email, password);

      // Check all possible token field names
      const token = data?.data?.token;

      console.log("� Token received:", token);
      console.log("🔍 Available fields:", Object.keys(data));

      // Validate token exists
      if (!token) {
        console.error("❌ No token in response!");
        console.error("❌ Response fields:", Object.keys(data));
        console.error("❌ Full response:", data);
        return {
          success: false,
          error:
            "No authentication token received from server. Please check backend response format.",
        };
      }

      console.log("🔍 Token type:", typeof token);
      console.log("🔍 Token length:", token?.length);

      // Basic JWT format check (should have 3 parts separated by dots)
      const tokenParts = token.split(".");
      console.log("🔍 Token parts:", tokenParts.length);
      if (tokenParts.length !== 3) {
        console.error(
          "❌ Invalid JWT format! Expected 3 parts, got:",
          tokenParts.length
        );
        return {
          success: false,
          error: "Invalid token format received from server",
        };
      }

      // Save JWT token to localStorage with timestamp
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("jwt_token_timestamp", Date.now().toString());
      console.log("💾 Token saved to localStorage with 1 hour expiration");

      // Store master password in React state only (not localStorage!)
      setMasterPassword(password);

      // Update auth state
      setUser(data.user || data.data?.user || { email });
      setIsAuthenticated(true);
      console.log("✅ Auth state updated, isAuthenticated: true");

      return { success: true, data };
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
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
      console.log("✅ Register response:", data);

      // Check all possible token field names
      const token =
        data.token ||
        data.accessToken ||
        data.access_token ||
        data.jwt ||
        data.authToken;

      // Optionally auto-login after registration
      if (token) {
        console.log(
          "💾 Saving token after registration with 1 hour expiration"
        );
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("jwt_token_timestamp", Date.now().toString());
        setMasterPassword(password);
        setUser(data.user || data.data?.user || { email });
        setIsAuthenticated(true);
      } else {
        console.warn(
          "⚠️ No token in registration response - user needs to login"
        );
      }

      return { success: true, data };
    } catch (error) {
      console.error("❌ Registration error:", error);
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
    console.log("🔒 Vault locked - Master password cleared from memory");

    // Log the action to the backend
    try {
      await logsAPI.create("Locked Vault");
      console.log("📝 Lock action logged successfully");
    } catch (error) {
      console.error("❌ Failed to log lock action:", error);
      // Don't throw error, locking should still work even if logging fails
    }
  };

  const unlockVault = async (password) => {
    // Unlock vault by setting master password in memory
    setMasterPassword(password);
    console.log("🔓 Vault unlocked - Master password set in memory");

    // Log the action to the backend
    try {
      await logsAPI.create("Unlocked Vault");
      console.log("📝 Unlock action logged successfully");
    } catch (error) {
      console.error("❌ Failed to log unlock action:", error);
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
