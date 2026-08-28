import Header from "./components/Header";
import Dish from "./components/Dish";

function App() {
  const dishes = [
    {
      id: 1,
      name: "Doro Wat",
      price: 350,
    },
    {
      id: 2,
      name: "Kitfo",
      price: 400,
    },
    {
      id: 3,
      name: "Tibs",
      price: 380,
    },
    {
      id: 4,
      name: "Shiro",
      price: 250,
    },
    {
      id: 5,
      name: "Beyaynet",
      price: 300,
    },
    {
      id: 6,
      name: "Firfir",
      price: 200,
    },
  ];

  return (
    <div className="app">
      <Header />

      <main>
        <h2>Our Menu</h2>

        <div className="menu">
          {dishes.map((dish) => (
            <Dish key={dish.id} name={dish.name} price={dish.price} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
