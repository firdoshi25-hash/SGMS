import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService.current()
      .then(({ user: currentUser }) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user?.settings?.theme) document.documentElement.dataset.theme = user.settings.theme;
  }, [user?.settings?.theme]);

  async function login(values) {
    const response = await authService.login(values);
    setUser(response.user);
    return response.user;
  }

  async function register(values) {
    const response = await authService.register(values);
    setUser(response.user);
    return response.user;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}