import Checkout from "./components/Checkout";

function App() {
  const cartTotal = 1250;

  return (
    <div className="app">
      <header className="header">
        <h1>Addis Eats</h1>
        <p>Food delivery made simple.</p>
      </header>

      <main>
        <Checkout total={cartTotal} />
      </main>

      <footer className="footer">
        <p>© 2026 Addis Eats</p>
      </footer>
    </div>
  );
}

export default App;
