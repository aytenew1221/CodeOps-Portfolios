//signin page
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { user, signIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name")).trim();

    if (!name) {
      return;
    }

    signIn(name);

    navigate(from, {
      replace: true,
    });
  }

  if (user) {
    return (
      <section className="page narrow">
        <h1>You are already signed in</h1>

        <button className="button" type="button" onClick={() => navigate(from)}>
          Continue
        </button>
      </section>
    );
  }

  return (
    <section className="page narrow">
      <span className="eyebrow">AUTHENTICATION</span>

      <h1>Sign in</h1>

      <p>Checkout is protected by RequireAuth.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Your name
          <input name="name" placeholder="Abebe" autoComplete="name" required />
        </label>

        <button className="button" type="submit">
          Sign in and continue
        </button>
      </form>
    </section>
  );
}
