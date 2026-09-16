import { NavLink } from "react-router-dom";

import { useCartStore } from "../store/cartStore";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

function Navbar() {
  // Narrow selector
  const items = useCartStore((state) => state.items);

  const { user, signOut } = useAuth();

  const { darkMode, toggleTheme } = useTheme();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <NavLink className="logo" to="/">
        Addis Eats
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/menu">Menu</NavLink>

        <NavLink to="/cart">Cart ({cartCount})</NavLink>

        {user ? (
          <>
            <span>Hi, {user.name}</span>

            <button onClick={signOut} className="small-button">
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/signin">Sign In</NavLink>
        )}

        <button className="small-button" onClick={toggleTheme}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
