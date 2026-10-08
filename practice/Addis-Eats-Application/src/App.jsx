//addis-Eats-Application
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import LoadingSkeleton from "./components/LoadingSkeleton";

import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import DishDetails from "./pages/DishDetails";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

// Lazy-loaded heavy pages
const Checkout = lazy(() => import("./pages/Checkout"));
const Receipt = lazy(() => import("./pages/Receipt"));

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/menu" element={<MenuPage />} />

          <Route path="/menu/:id" element={<DishDetails />} />

          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />

          <Route path="/receipt" element={<Receipt />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
