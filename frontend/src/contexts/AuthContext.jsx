import { createContext, useEffect, useContext, useState } from "react";
import { authService, profileService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await profileService.getCurrentProfile();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateUser = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    currentUser,
    loading,
    logout,
    refreshUser: loadCurrentUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  return useContext(AuthContext);
}
