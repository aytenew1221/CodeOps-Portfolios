import { NavLink, Outlet, Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="brand">
          🍲 Addis Eats
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/menu">Menu</NavLink>

          <NavLink to="/checkout">Checkout</NavLink>

          {user ? (
            <button type="button" className="nav-user" onClick={signOut}>
              Sign out ({user.name})
            </button>
          ) : (
            <NavLink to="/signin">Sign in</NavLink>
          )}

          <Link to="/menu" className="cart-link">
            🛒 {cartCount}
          </Link>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Addis Eats · React resilience project
        </p>
      </footer>
    </div>
  );
}
