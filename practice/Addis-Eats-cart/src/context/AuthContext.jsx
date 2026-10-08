import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("addis-eats-auth");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signIn = (userData) => {
    setUser(userData);

    localStorage.setItem("addis-eats-auth", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);

    localStorage.removeItem("addis-eats-auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
