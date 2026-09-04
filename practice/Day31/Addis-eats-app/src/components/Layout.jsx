import { NavLink, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

function Layout({ cartCount, isAuthenticated, onSignOut }) {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🍽️ Addis Eats</h1>
          <p>Fresh Ethiopian food delivered to you.</p>
        </div>

        <nav className="nav">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/menu">Menu</NavLink>

          <NavLink to="/cart">Cart ({cartCount})</NavLink>

          <NavLink to="/checkout">Checkout</NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              className="sign-out-button"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          ) : (
            <NavLink to="/signin">Sign In</NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 Addis Eats</p>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  cartCount: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onSignOut: PropTypes.func.isRequired,
};

export default Layout;
