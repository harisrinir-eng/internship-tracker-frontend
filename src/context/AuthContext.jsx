import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api.js";

// The context shares "who is logged in" with every page.
// IMPORTANT: this is only for SHOWING the right screens. The real security
// is on the server, which checks the cookie on every request.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we ask the server "am I still logged in?"

  // When the app opens (or the page is refreshed), ask the server who we are.
  useEffect(() => {
    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.loginUser(email, password);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api.logoutUser(); // server deletes the cookie
    } finally {
      setUser(null); // clear the frontend state either way
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
