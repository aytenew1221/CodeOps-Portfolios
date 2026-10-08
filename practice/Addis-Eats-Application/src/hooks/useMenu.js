/**
 * Custom hook to fetch and manage the menu data.
 * @returns {Object} An object containing the dishes, loading state, and error message.
 */
import { useEffect, useState } from "react";

export function useMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/menu.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load menu.");
        }

        const data = await response.json();

        setDishes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    dishes,
    loading,
    error,
  };
}
