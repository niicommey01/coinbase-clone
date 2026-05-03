import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!getToken()) {
        if (!cancelled) setBootstrapping(false);
        return;
      }
      try {
        const data = await apiFetch('/profile');
        if (!cancelled && data?.success && data.user) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) setToken(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/login', { method: 'POST', body: { email, password } });
    if (data?.token) setToken(data.token);
    if (data?.user) setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiFetch('/register', { method: 'POST', body: { name, email, password } });
    if (data?.token) setToken(data.token);
    if (data?.user) setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/logout', { method: 'POST' });
    } catch {
      // still clear local session
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      login,
      register,
      logout,
    }),
    [user, bootstrapping, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
