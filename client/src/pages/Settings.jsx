import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";

function Settings() {
  const { user, setUser } = useAuth();
  const [theme, setTheme] = useState(user?.settings?.theme || "light");
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications ?? true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch("/users/me", { settings: { theme, emailNotifications } });
      setUser(response.user);
      document.documentElement.dataset.theme = theme;
      setNotice("Settings saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="account-page">
      <div className="page-heading"><div><h1>Settings</h1><p>Choose how SGMS looks and sends updates.</p></div></div>
      {error && <div className="state-message error" role="alert">{error}</div>}
      {notice && <div className="state-message success" role="status">{notice}</div>}
      <form className="account-form" onSubmit={saveSettings}>
        <label htmlFor="theme-setting">Appearance</label>
        <select id="theme-setting" value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <label className="checkbox-setting"><input type="checkbox" checked={emailNotifications} onChange={(event) => setEmailNotifications(event.target.checked)} /> Email notifications enabled</label>
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Save settings"}</button>
      </form>
    </section>
  );
}

export default Settings;