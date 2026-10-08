import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function RequireAuth({ isAuthenticated, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}

RequireAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
