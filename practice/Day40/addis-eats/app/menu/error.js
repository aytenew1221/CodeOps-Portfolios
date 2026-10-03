"use client";

export default function MenuError({ error, reset }) {
  return (
    <section className="error-message">
      <h2>Something went wrong.</h2>

      <p>We could not load the menu. Please try again.</p>

      <button className="submit-button" onClick={() => reset()}>
        Try Again
      </button>
    </section>
  );
}
