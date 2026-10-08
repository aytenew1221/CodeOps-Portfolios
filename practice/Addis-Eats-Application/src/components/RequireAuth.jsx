/**
 * RequireAuth.jsx
 * This component is used to protect routes that require authentication.
 * It checks if the user is authenticated and redirects to the sign-in page if not.
 */
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return children;
}
