"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="submit-button" disabled={pending}>
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}
