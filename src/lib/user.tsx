import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    favoriteFields?: string[];
    favoriteStyles?: string[];
  };
  badges?: Array<{
    id: string;
    name: string;
    unlockedAt: string;
    progress: number;
  }>;
  statistics?: {
    totalBoxes: number;
    totalOrders: number;
    totalSpent: number;
    favoriteFields: string[];
  };
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-authenticate on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = sessionStorage.getItem("studybox.token");
        if (token) {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data._id,
              email: data.email,
              name: data.name,
              avatar: data.avatar,
              preferences: data.preferences,
              badges: data.badges,
              statistics: data.statistics,
            });
          } else {
            sessionStorage.removeItem("studybox.token");
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      sessionStorage.setItem("studybox.token", data.token);
      setUser({
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.avatar,
        preferences: data.user.preferences,
        badges: data.user.badges,
        statistics: data.user.statistics,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      sessionStorage.setItem("studybox.token", data.token);
      setUser({
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.avatar,
        preferences: data.user.preferences,
        badges: data.user.badges,
        statistics: data.user.statistics,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("studybox.token");
    setUser(null);
    setError(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    try {
      setError(null);
      const token = sessionStorage.getItem("studybox.token");

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profile update failed");
      }

      setUser({
        id: data._id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        preferences: data.preferences,
        badges: data.badges,
        statistics: data.statistics,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Profile update failed";
      setError(errorMessage);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      const token = sessionStorage.getItem("studybox.token");
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data._id,
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          preferences: data.preferences,
          badges: data.badges,
          statistics: data.statistics,
        });
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const clearError = () => setError(null);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
