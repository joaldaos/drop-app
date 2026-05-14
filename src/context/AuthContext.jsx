import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem('drop_token');
    if (!tok) { setLoading(false); return; }
    api.me()
      .then(u => setUser(u))
      .catch(() => localStorage.removeItem('drop_token'))
      .finally(() => setLoading(false));

    // check Spotify OAuth result
    const params = new URLSearchParams(window.location.search);
    if (params.get('spotify_ok')) {
      api.me().then(setUser);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem('drop_token', token);
    setUser(user);
    return user;
  }

  async function register(data) {
    const { token, user } = await api.register(data);
    localStorage.setItem('drop_token', token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('drop_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
