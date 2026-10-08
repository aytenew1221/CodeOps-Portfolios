/*
  This file is part of Addis Eats Application  menu page.
 */
import { useCallback, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import ErrorBoundary from "../components/ErrorBoundary";
import ProfilerWrapper from "../components/ProfilerWrapper";
import DishCard from "../components/DishCard";
import CartPanel from "../components/CartPanel";
import DishModal from "../components/DishModal";

import { useMenu } from "../hooks/useMenu";

const categories = ["All", "Main", "Drink", "Dessert"];

export default function MenuPage() {
  const { dishes, loading, error } = useMenu();

  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "All";

  const [selectedDish, setSelectedDish] = useState(null);

  const filteredDishes = useMemo(() => {
    if (category === "All") {
      return dishes;
    }

    return dishes.filter((dish) => dish.category === category);
  }, [dishes, category]);

  const openModal = useCallback((dish) => {
    setSelectedDish(dish);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedDish(null);
  }, []);

  function changeCategory(nextCategory) {
    const next = new URLSearchParams(searchParams);

    if (nextCategory === "All") {
      next.delete("category");
    } else {
      next.set("category", nextCategory);
    }

    setSearchParams(next);
  }

  if (loading) {
    return (
      <section className="page">
        <div className="skeleton hero-skeleton" />
        <p className="muted">Loading menu…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="error-box">
          <h2>Menu unavailable</h2>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">MENU</span>

          <h1>Choose your dish</h1>

          <p>Choose a category, add dishes to your cart, or open Quick View.</p>
        </div>
      </div>

      <div className="filter-bar" aria-label="Menu categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => changeCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="menu-layout">
        {/* MENU BOUNDARY */}
        <ErrorBoundary title="Menu section recovered">
          <ProfilerWrapper>
            <div className="dish-grid">
              {filteredDishes.map((dish) => (
                <ErrorBoundary key={dish.id} title={`Dish card: ${dish.name}`}>
                  <DishCard dish={dish} onOpenModal={openModal} />
                </ErrorBoundary>
              ))}
            </div>
          </ProfilerWrapper>
        </ErrorBoundary>

        {/* CART BOUNDARY */}
        <ErrorBoundary title="Cart section recovered">
          <CartPanel />
        </ErrorBoundary>
      </div>

      <DishModal dish={selectedDish} onClose={closeModal} />
    </section>
  );
}
