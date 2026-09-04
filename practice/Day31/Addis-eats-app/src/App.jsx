import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import DishDetails from "./pages/DishDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("addis-eats-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("addis-eats-auth") === "true";
  });

  useEffect(() => {
    localStorage.setItem("addis-eats-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === dish.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (dishId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== dishId));
  };

  const increaseQuantity = (dishId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === dishId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (dishId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === dishId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    localStorage.setItem("addis-eats-auth", "true");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("addis-eats-auth");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            cartCount={cartCount}
            isAuthenticated={isAuthenticated}
            onSignOut={handleSignOut}
          />
        }
      >
        {/* Landing page */}
        <Route index element={<Home />} />

        {/* Menu */}
        <Route path="menu" element={<Menu onAddToCart={addToCart} />} />

        {/* Individual dish */}
        <Route
          path="menu/:id"
          element={<DishDetails onAddToCart={addToCart} />}
        />

        {/* Cart */}
        <Route
          path="cart"
          element={
            <Cart
              cart={cart}
              cartTotal={cartTotal}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
            />
          }
        />

        {/* Sign in */}
        <Route
          path="signin"
          element={
            <SignIn isAuthenticated={isAuthenticated} onSignIn={handleSignIn} />
          }
        />

        {/* Protected checkout */}
        <Route
          path="checkout"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Checkout cart={cart} cartTotal={cartTotal} onClear={clearCart} />
            </RequireAuth>
          }
        />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
