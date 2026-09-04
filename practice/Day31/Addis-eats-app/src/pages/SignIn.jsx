import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

function SignIn({ isAuthenticated, onSignIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");

    onSignIn();

    navigate(from, {
      replace: true,
    });
  };

  return (
    <section className="signin-page">
      <div className="signin-card">
        <h2>Sign In</h2>

        <p>Please sign in to continue to checkout.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="signin-email">Email</label>

          <input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <label htmlFor="signin-password">Password</label>

          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <p className="signin-note">
          Demo sign-in: any non-empty email and password will work.
        </p>

        <Link to="/menu">Back to Menu</Link>
      </div>
    </section>
  );
}

export default SignIn;
