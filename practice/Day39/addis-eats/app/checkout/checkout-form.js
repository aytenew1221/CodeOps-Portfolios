"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions";
import { dishes } from "@/lib/dishes";
import SubmitButton from "./submit-button";

const initialState = {
  success: false,
  error: "",
  fieldErrors: {},
};

export default function CheckoutForm({ selectedDish = "" }) {
  const [state, formAction] = useActionState(placeOrder, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          autoComplete="name"
        />

        {state.fieldErrors?.name && (
          <p role="alert">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone">Phone</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="0912345678"
          autoComplete="tel"
        />

        {state.fieldErrors?.phone && (
          <p role="alert">{state.fieldErrors.phone[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="dishId">Dish</label>

        <select id="dishId" name="dishId" required defaultValue={selectedDish}>
          <option value="" disabled>
            Select a dish
          </option>

          {dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name} - {dish.price} ETB
            </option>
          ))}
        </select>

        {state.fieldErrors?.dishId && (
          <p role="alert">{state.fieldErrors.dishId[0]}</p>
        )}
      </div>

      {state.error && !state.success && <p role="alert">{state.error}</p>}

      {state.success && (
        <p role="status">
          Order created successfully.
          <br />
          Order ID: {state.orderId}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
