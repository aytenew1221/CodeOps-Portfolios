import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function SignIn() {
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const { signIn } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const destination = location.state?.from?.pathname || "/";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    signIn({
      name: name.trim(),
    });

    navigate(destination, {
      replace: true,
    });
  };

  return (
    <section className="form-page">
      <h1>Sign In</h1>

      <p>Sign in before completing checkout.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <button type="submit">Sign In</button>
      </form>
    </section>
  );
}

export default SignIn;
