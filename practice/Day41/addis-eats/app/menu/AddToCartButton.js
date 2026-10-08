"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/cart-api";

export default function AddToCartButton({ dish }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate(dish)}
      disabled={mutation.isPending}
      className="mt-4 rounded-xl bg-purple-700 px-4 py-2.5 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {mutation.isPending ? "Adding…" : "Add to Cart"}
    </button>
  );
}
