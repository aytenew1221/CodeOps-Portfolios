import { useState } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import DeliveryForm from "./components/DeliveryForm";
import "./index.css";

function App() {
  const [orderTotal, setOrderTotal] = useState(0);

  const handleAddToOrder = (price) => {
    setOrderTotal((currentTotal) => currentTotal + price);
  };

  return (
    <div className="app">
      <Header />

      <main>
        <Menu onAddToOrder={handleAddToOrder} />

        <section className="order-summary">
          <h2>Your Order</h2>

          <p>
            Total:
            <strong>{orderTotal.toLocaleString()} ETB</strong>
          </p>
        </section>

        <DeliveryForm />
      </main>
    </div>
  );
}

export default App;
