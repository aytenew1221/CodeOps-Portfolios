"use client";

import { useActionState } from "react";
import { placeOrder } from "../app/actions";
import SubmitButton from "./SubmitButton";

const initialState = {
  success: false,
  errors: {},
  message: "",
};

export default function CheckoutForm() {
  const [state, formAction] = useActionState(placeOrder, initialState);

  return (
    <form action={formAction} className="checkout-form">
      {state.message && (
        <div className={state.success ? "success-message" : "error-message"}>
          {state.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Full Name</label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          required
        />

        {state.errors?.name && (
          <p className="field-error">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Ethiopian Phone Number</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="0912345678"
          required
        />

        {state.errors?.phone && (
          <p className="field-error">{state.errors.phone[0]}</p>
        )}
      </div>

      <SubmitButton />

      {state.success && (
        <p style={{ marginTop: "20px" }}>
          Thank you for ordering from Addis Eats!
        </p>
      )}
    </form>
  );
}
