import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import DishDetails from "./pages/DishDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/menu/:id" element={<DishDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
