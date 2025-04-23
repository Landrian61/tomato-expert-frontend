import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logout,
  clearAuthFromIDB,
  api
} from "../services/authService";

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  defaultLocation?: {
    latitude: number;
    longitude: number;
  };
  farmName?: string;
  district?: string;
  // ...other user fields
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOffline: boolean;
  logout: () => Promise<void>;
  setUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        setAuthenticated(isAuth);

        if (isAuth) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      if (navigator.onLine) {
        await logout();
      } else {
        // Handle offline logout
        console.log("Offline logout - clearing local data only");
        localStorage.removeItem("authData");
        await clearAuthFromIDB();
      }
      setUser(null);
      setAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get current user function
  const getCurrentUser = async () => {
    try {
      // First try to get user from localStorage
      const authData = localStorage.getItem("authData");
      if (authData) {
        const parsedData = JSON.parse(authData);
        if (parsedData.user) {
          setUser(parsedData.user);
          setAuthenticated(true);
          return parsedData.user;
        }
      }

      // If not available, try to get fresh user data
      const userResponse = await api.get("/user");
      if (userResponse.data) {
        // Update local storage with fresh user data
        if (authData) {
          const parsedData = JSON.parse(authData);
          parsedData.user = userResponse.data;
          localStorage.setItem("authData", JSON.stringify(parsedData));
        }

        setUser(userResponse.data);
        setAuthenticated(true);
        return userResponse.data;
      }

      setUser(null);
      setAuthenticated(false);
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      setUser(null);
      setAuthenticated(false);
      return null;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated: authenticated,
    isOffline,
    logout: handleLogout,
    setUser: (newUser: UserData | null) => {
      setUser(newUser);
      setAuthenticated(!!newUser);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
