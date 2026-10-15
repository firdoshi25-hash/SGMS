import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";

function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch("/users/me", { name });
      setUser(response.user);
      setNotice("Profile saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="account-page">
      <div className="page-heading"><div><h1>Profile</h1><p>Manage the details linked to your account.</p></div></div>
      {error && <div className="state-message error" role="alert">{error}</div>}
      {notice && <div className="state-message success" role="status">{notice}</div>}
      <form className="account-form" onSubmit={saveProfile}>
        <label htmlFor="profile-name">Full name</label>
        <input id="profile-name" value={name} minLength="2" maxLength="80" required onChange={(event) => setName(event.target.value)} />
        <label htmlFor="profile-email">Email</label>
        <input id="profile-email" value={user?.email || ""} type="email" readOnly />
        <p className="muted-copy">Role: {user?.role || "student"}</p>
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
      </form>
    </section>
  );
}

export default Profile;