/**
 * LoadingSkeleton.jsx
 * This component displays a loading skeleton while data is being fetched.
 * It provides a visual placeholder for the content that is being loaded.
 */
export default function LoadingSkeleton() {
  return (
    <section className="page">
      <div className="loading-container">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-input" />
        <div className="skeleton skeleton-button" />
      </div>
    </section>
  );
}
