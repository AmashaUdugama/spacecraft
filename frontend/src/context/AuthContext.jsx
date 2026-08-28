import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getCurrentUser } from "../api/spacecraft";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("spacecraft_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          localStorage.removeItem("spacecraft_token");
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login(email, password) {
    const data = await loginUser({ email, password });
    localStorage.setItem("spacecraft_token", data.access_token);
    setToken(data.access_token);
  }

  function logout() {
    localStorage.removeItem("spacecraft_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
