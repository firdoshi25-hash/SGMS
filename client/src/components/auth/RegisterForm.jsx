import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await register({ name: form.get("name"), email: form.get("email"), password });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create account</h2>
      <label htmlFor="register-name">Full name</label>
      <input id="register-name" name="name" type="text" autoComplete="name" minLength="2" maxLength="80" required />
      <label htmlFor="register-email">Email</label>
      <input id="register-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="register-password">Password</label>
      <input id="register-password" name="password" type="password" autoComplete="new-password" minLength="8" required />
      <label htmlFor="register-confirm">Confirm password</label>
      <input id="register-confirm" name="confirmPassword" type="password" autoComplete="new-password" minLength="8" required />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
      <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
    </form>
  );
}

export default RegisterForm;