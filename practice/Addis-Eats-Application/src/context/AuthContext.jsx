/**
 * AuthContext.jsx
 * This file defines the authentication context for the application.
 * It provides a way to manage user authentication state and actions.
 */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("addis-eats-user")) || null;
    } catch {
      return null;
    }
  });

  function signIn(name) {
    const nextUser = {
      name,
    };

    localStorage.setItem("addis-eats-user", JSON.stringify(nextUser));

    setUser(nextUser);
  }

  function signOut() {
    localStorage.removeItem("addis-eats-user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
